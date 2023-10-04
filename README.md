# Lambda Auth Service
Auth Service in Lambda With DynamoDB

![Service Diagram](diagram.png)

### Local Testing

`Localstack should be installed and running.`

1. Populate localstack with ./localstack/populate.sh script
2. Create test-parameters.env file from the example with your localstack url
3. Start AWS SAM with ./sam-start script
4. run npm test or use the client from web-test folder

### Deployment
1. Create stack using the AWS Console or CLI, populating the parameters.
    * AWS SAM uses already set parameters values from the stack when deploying.
2. Deploying using AWS `sam deploy` or setup a Jenkins pipeline.