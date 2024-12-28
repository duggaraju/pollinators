#!/bin/bash
docker build -t buzzmapcontainerregistry.azurecr.io/buzzmap ../Pollinators
az acr login -n buzzmapcontainerregistry
docker push buzzmapcontainerregistry.azurecr.io/buzzmap

az group create -n buzzmap -l "westus2"

az deployment group create -g buzzmap --template-file deployment.bicep --parameters parameters.bicepparam