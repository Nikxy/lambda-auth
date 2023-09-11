def SRC_FOLDER = 'src'

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        AWS_SAM_EXISTS = fileExists 'venv/bin/sam'
        AWS_DEFAULT_REGION = 'il-central-1'
        AWS_LAMBDA_NAME = 'nikxy-auth'
    }

    stages {
        stage('Install npm dependencies') {
            when {
                changeset 'src/package.json'
            }

            steps {
                dir(SRC_FOLDER) {
                    sh 'npm ci'
                }
            }
        }
        stage('Unit Tests') {
            when {
                changeset 'src/**'
            }
            steps {
                dir(SRC_FOLDER) {
                    script {
                        def exitStatus = sh returnStatus: true, script: 'npm run test_ci:unit'
                        junit 'junit.xml'
                        if (exitStatus != 0) {
                            error 'Unit tests failed'
                        }
                    }
                }
            }
        }
        stage('Install AWS SAM') {
            when { expression { AWS_SAM_EXISTS == 'false' } }
            steps {
                echo 'Installing AWS SAM'
                sh(returnStdout:true, script: 'python3 -m venv venv && venv/bin/pip install aws-sam-cli')
            }
        }
        stage('SAM Integration Tests') {
            when {
                changeset 'src/**'
            }
            environment
            {
                TEST_DOMAIN = 'orders'
                TEST_USERNAME = 'orders'
                TEST_PASSWORD = '0SdoPPhVztwbuSt2lTgv'
            }
            steps {
                sh 'chmod +x sam-start-ci.sh'
                sh 'nohup ./sam-start-ci.sh > $WORKSPACE/sam.log 2>&1 &'
                sh 'sleep 3'
                dir(SRC_FOLDER) {
                    script {
                        def exitStatus = sh returnStatus: true, script: 'npm run test_ci:integration'
                        junit 'junit-integration.xml'
                        if (exitStatus != 0) {
                            error 'Integration tests failed'
                        }
                    }
                }
            }
        }
        stage('Deploy To AWS') {
            steps {
                sh 'echo "Deploying to AWS"'
                withCredentials([usernamePassword(
                            credentialsId: 'AWSJenkinsDeploy',
                            usernameVariable: 'AWS_ACCESS_KEY_ID',
                            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                        )]) {
                        sh 'venv/bin/sam deploy --stack-name nikxy-auth --region ${AWS_DEFAULT_REGION} \
                            --s3-bucket nikxy-cloudformation --s3-prefix sam-nikxy-auth \
                            --on-failure ROLLBACK --capabilities CAPABILITY_NAMED_IAM'
                        }
                }
            }
        }
    }
}
