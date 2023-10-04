#!/bin/bash
if [ -z "$1" ]
  then
    echo "Please provide the localstack endpoint as the first argument."
    exit 1
fi

cd "$(dirname "$0")"

userData=$(<test-user.json)
secretData=$(<test-secret.json)

localstackEndpoint="$1"
tableName="auth-test"
secretName="auth-test/secrets"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "#=================================================#"
echo "#   Population aws localstack with test data...   #"
echo "#=================================================#"

aws_command(){
    result=`aws "$@" --endpoint-url "$localstackEndpoint" 2>&1` \
    && echo -e "${GREEN}Done.${NC}" \
    || echo -e "${RED}Failed: ${result##$'\n'}${NC}"
}

echo -n "#   Creating table... "
aws_command dynamodb create-table --table-name "$tableName" \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=doc_type,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=doc_type,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD

echo -n "#   Putting userdata into table... "
aws_command dynamodb put-item --table-name "$tableName" --item="$userData"

echo -n "#   Creating secret... "
aws_command secretsmanager create-secret --name "$secretName" --secret-string "$secretData"

echo "#=================================================#"