@description('Azure Container App name')
@minLength(3)
param containerAppName string

@description('Managed Identity name')
var appManagedIdentityName = '${containerAppName}ManagedIdentity'

@description('Cosmos DB name')
var databaseName = '${containerAppName}db'

@description('Azure Container Registry name')
var containerRegistryName = '${containerAppName}containerregistry'

@secure()
@description('Recaptcha secret key')
param recaptchaSecretKey string

// create a managed identity.
resource appManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: appManagedIdentityName
  location: resourceGroup().location
}

// create a container regitstry to store the images.
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: resourceGroup().location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
  }
}

// get the role definition ID for the ACR pull role
var acrRoleDefinitionResourceID = resourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')

// give reader access on the container registry to the managed identity.
resource acrRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, appManagedIdentity.id, acrRoleDefinitionResourceID)
  properties: {
    roleDefinitionId: acrRoleDefinitionResourceID
    principalId: appManagedIdentity.properties.principalId
    principalType: 'servicePrincipal'
  }
}

// create a Cosmos DB account
resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2024-11-15' = {
  name: databaseName
  location: resourceGroup().location
  kind: 'GlobalDocumentDB'
  properties: {
    locations: [
      {
        locationName: resourceGroup().location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

// create a database with the account
resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-11-15' = {
  name: 'PollinatorDatabase'
  parent: cosmosDbAccount
  properties: {
    resource: {
      id: 'PollinatorDatabase'
    }
  }
}

// create a container named locations
resource cosmosDbContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-11-15' = {
  name: 'LocationContainer'
  parent: cosmosDbDatabase
  properties: {
    resource: {
      id: 'LocationContainer'
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
    }
  }
}


// assign cosmsos DB account reader role to managed identity.
resource cosmosDbRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: cosmosDbAccount
  name: guid(cosmosDbAccount.id, appManagedIdentity.id)
  properties: {
    principalId: appManagedIdentity.properties.principalId
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', 'fbdf93bf-df7d-467e-a4d2-9458aa1360c8')
  }
}

var databaseWriterRole = '${cosmosDbAccount.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002'
resource assignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = {
  name: guid(databaseWriterRole, appManagedIdentity.id, cosmosDbAccount.id)
  parent: cosmosDbAccount
  properties: {
    principalId: appManagedIdentity.properties.principalId
    roleDefinitionId: databaseWriterRole
    scope: cosmosDbAccount.id
  }
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: '${containerAppName}LogAnalyticsWorkspace'
  location: resourceGroup().location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${containerAppName}AppInsights'
  location: resourceGroup().location
  kind: 'other'
  properties: {
    Application_Type: 'other'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}


resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-10-01' = {
  name: '${containerAppName}Environment'
  location: resourceGroup().location
  sku: {
    name: 'Consumption'
  }
  properties: {
    daprAIInstrumentationKey: applicationInsights.properties.InstrumentationKey
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey:  logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerapp 'Microsoft.App/containerApps@2024-10-02-preview' = {
  name: containerAppName
  location: resourceGroup().location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${appManagedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      secrets: [
        {
          name: 'recaptcha-secret-key'
          value: recaptchaSecretKey
        }
      ]
  
      registries: [
        {
          identity: appManagedIdentity.id
          server: containerRegistry.properties.loginServer
        }
      ]
      ingress: {
        external: true
      }
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: '${containerRegistryName}.azurecr.io/${containerAppName}:latest'
          imageType: 'ContainerImage'
          resources: {
            cpu: 1
            memory: '2Gi'
          }
          env: [
            {
              name: 'AZURE_CLIENT_ID'
              value: appManagedIdentity.properties.clientId
            }
            {
              name: 'RecaptchaSecretKey'
              secretRef: 'recaptcha-secret-key'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 2
        rules: [
        ]
      }
    }
  }
}

