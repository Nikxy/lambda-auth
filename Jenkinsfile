def SRC_FOLDER = 'src'

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        AWS_SAM_BIN = fileExists 'venv/bin/sam'
    }

    stages {
        stage('Clone Source') {
            steps {
                git branch: 'master',
                url: 'https://c16adb70562dc0fcfb69f83802bafb4044b3ef4e@gogs.dev.callandorit.net/nikxy/lambda-auth.git'
            }
        }
        stage('Install dependencies') {
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
            
            when { expression { AWS_SAM_BIN == 'false' } }
            steps {
                echo 'Installing AWS SAM'
                sh(returnStdout:true, script: 'python3 -m venv venv && venv/bin/pip install aws-sam-cli')
            }
        }
        stage('SAM Integration Tests') {
            environment
            {
                TEST_DOMAIN = 'orders'
                TEST_USERNAME = 'orders'
                TEST_PASSWORD = '0SdoPPhVztwbuSt2lTgv'
            }
            steps {
                sh 'chmod +x sam-start.sh'
                sh 'nohup ./sam-start.sh &'
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
                /*dir(SRC_FOLDER) {

                    sh (returnStdout:true, script: '''
                    zip -FSr deploymentFile.zip . -x \
                    ./jest.config.mjs \
                    ./__tests__/**\\* \
                    ./__tests__/ \
                    ./node_modules/@aws-sdk/**\\* \
                    ./node_modules/@aws-sdk/
                    ''')
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'AWSJenkinsDeploy',
                            usernameVariable: 'accessKeyId',
                            passwordVariable: 'accessKeySecret'
                        )]) {
                        sh 'echo $accessKeyId'
                        deployLambda([
                            alias: '',
                            artifactLocation: 'deploymentFile.zip',
                            awsAccessKeyId: accessKeyId,
                            awsRegion: "${REGION}",
                            awsSecretKey: accessKeySecret,
                            deadLetterQueueArn: '',
                            description: '',
                            environmentConfiguration: [kmsArn: ''],
                            functionName: 'nikxy-auth-login',
                            handler: '', memorySize: '',
                            role: '', runtime: '',
                            securityGroups: '', subnets: '', timeout: '',
                            updateMode: 'code'
                        ])
                        }
                    sh 'rm deploymentFile.zip'
                }*/
            }
        }
    }
}
