# Lambda Auth Service
Auth Service in Lambda With DynamoDB

![Service Diagram](diagram.png)


### Local Testing

`Localstack should be installed and running.`

1. Populate localstack with ./localstack/populate.sh script
2. Create test-parameters.env file from the example with your localstack url
3. Start AWS SAM with ./sam-start script
4. run npm test or use the client from web-test folder
