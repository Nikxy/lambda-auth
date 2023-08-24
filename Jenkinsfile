def SRC_FOLDER = 'src'

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        AWS_SAM_EXISTS = fileExists 'venv/bin/sam'
        REGION = 'il-central-1'
    }

    stages {
        /*stage('Clone Source') {
            steps {
                withCredentials([gitUsernamePassword(credentialsId: 'Gogs-Access-Token', gitToolName: 'git-tool')]){
                    git branch: 'master',
                    url: 'https://gogs.dev.callandorit.net/nikxy/lambda-auth.git'
                }
            }
        }*/
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
            
            when { expression { AWS_SAM_EXISTS == 'false' } }
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
                dir(SRC_FOLDER) {

                    sh (returnStdout:true,
                        script: 'zip -r deploy.zip * -x ./test**\\* -x ./node_modules/@aws-sdk**\\* -x ./node_modules/@aws-crypto**\\*')
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'AWSJenkinsDeploy',
                            usernameVariable: 'accessKeyId',
                            passwordVariable: 'accessKeySecret'
                        )]) {
                        sh 'echo $accessKeyId'
                        deployLambda([
                            alias: '',
                            artifactLocation: 'deploy.zip',
                            awsAccessKeyId: accessKeyId,
                            awsRegion: "${REGION}",
                            awsSecretKey: accessKeySecret,
                            deadLetterQueueArn: '',
                            description: '',
                            environmentConfiguration: [kmsArn: ''],
                            functionName: 'nikxy-auth',
                            handler: '', memorySize: '',
                            role: '', runtime: '',
                            securityGroups: '', subnets: '', timeout: '',
                            updateMode: 'code'
                        ])
                        }
                    sh 'rm deploy.zip'
                }
            }
        }
    }
}
