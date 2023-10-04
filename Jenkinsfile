def SRC_FOLDER = 'src'

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        TEST_NODE_MODULES_EXISTS = fileExists 'node_modules'
        SRC_NODE_MODULES_EXISTS = fileExists 'src/node_modules'
        AWS_SAM_EXISTS = fileExists 'venv/bin/sam'
        AWS_DEPLOY_REGION = 'il-central-1'

        LOCALSTACK_URL = 'http://localstack.dev.callandorit.net/'
        LOCALSTACK_TESTING_REGION = 'il-central-1'
        // Location of the workspace on the docker host machine
        DOCKER_HOST_WORKSPACE = '/home/diana/dev/jenkins_workspace/auth.nikxy.dev'
        STACK_NAME = 'nikxy-auth'
        // S3 Bucket for SAM to upload the template and code to
        SAM_S3 = 'nikxy-cloudformation'
    }

    stages {
        stage('Install AWS SAM') {
            when { expression { AWS_SAM_EXISTS == 'false' } }
            steps {
                echo 'Installing AWS SAM'
                sh(returnStdout:true, script: 'python3 -m venv venv && venv/bin/pip install aws-sam-cli')
            }
        }
        stage('Install test npm dependencies') {
            when {
                anyOf {
                    changeset 'package.json';
                    changeset 'package-lock.json';
                    expression { TEST_NODE_MODULES_EXISTS == 'false' }
                }
            }
            steps {
                sh 'npm ci'
            }
        }
        stage('Install src npm dependencies') {
            when {
                anyOf {
                    changeset 'src/package.json';
                    changeset 'src/package-lock.json';
                    expression { SRC_NODE_MODULES_EXISTS == 'false' }
                }
            }
            steps {
                dir(SRC_FOLDER) { sh 'npm ci' }
            }
        }
        stage('Unit Tests') {
            when {
                anyOf { changeset 'src/**'; changeset 'tests/unit/**'; changeset 'Jenkinsfile' }
            }
            steps {
                script {
                    def exitStatus = sh returnStatus: true, script: 'npm run test_ci:unit'
                    junit 'junit.xml'
                    if (exitStatus != 0) {
                        error 'Unit tests failed'
                    }
                }
            }
        }
        stage('SAM Integration Tests') {
            when {
                anyOf { changeset 'src/**'; changeset 'tests/integration/**'; changeset 'Jenkinsfile' }
            }

            steps {
                script {
                    def sam_arguments = readFile "${WORKSPACE}/sam-api-arguments.sh"

                    sh 'nohup venv/bin/sam '+sam_arguments+' --region $LOCALSTACK_TESTING_REGION -v $DOCKER_HOST_WORKSPACE --parameter-overrides EnvironmentType=test LocalStack=$LOCALSTACK_URL TableName=auth-test JWTSecretsKey=auth-test/secrets > $WORKSPACE/sam.log 2>&1 &'
                    sh '''#!/bin/bash
                        while [[ $(tail -n 1 sam.log) != *"CTRL+C"* ]]; do echo "waiting for sam" && sleep 1; done'''

                    def exitStatus = sh returnStatus: true, script: 'npm run test_ci:integration'
                    junit 'junit-integration.xml'
                    if (exitStatus != 0) {
                        error 'Integration tests failed'
                    }
                }
            }
        }
        
        stage('Deploy To AWS') {
            when {
                anyOf { changeset 'src/**'; changeset 'template.yaml'}
            }
            steps {
                sh 'echo "Deploying to AWS"'
                withCredentials([usernamePassword(
                    credentialsId: 'AWSJenkinsDeploy',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh 'venv/bin/sam deploy --stack-name $STACK_NAME --region ${AWS_DEPLOY_REGION} \
                        --s3-bucket $SAM_S3 --s3-prefix sam-$STACK_NAME \
                        --on-failure ROLLBACK --capabilities CAPABILITY_NAMED_IAM \
                        --no-progressbar'
                }
            }
        }
    }
}
