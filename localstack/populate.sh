#!/bin/bash
userData=$(<localstack/test-user.json)

docker exec localstack_main awslocal dynamodb create-table \
    --table-name nikxy-auth \
    --attribute-definitions \
        AttributeName=Id,AttributeType=S \
        AttributeName=Type,AttributeType=S \
    --key-schema \
        AttributeName=Id,KeyType=HASH \
        AttributeName=Type,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD

docker exec localstack_main awslocal dynamodb put-item \
    --table-name nikxy-auth \
    --item="$userData"