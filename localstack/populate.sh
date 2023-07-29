#!/bin/bash
userData=$(<localstack/test-user.json)
secretData=$(<localstack/test-secret.json)

docker exec localstack_main awslocal dynamodb create-table \
    --table-name nikxy-auth \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=doc_type,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=doc_type,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD

docker exec localstack_main awslocal dynamodb put-item \
    --table-name nikxy-auth \
    --item="$userData"

docker exec localstack_main awslocal secretsmanager create-secret \
    --name "nikxy/auth/jwtsecrets" \
    --secret-string "$secretData"