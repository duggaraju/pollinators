using 'deployment.bicep'

@description('The name of the container app to deploy')
param containerAppName = 'buzzmap'

param recaptchaSecretKey = ''
