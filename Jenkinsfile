def SRC_FOLDER = 'src'

pipeline {
    agent any
    
    tools {
        nodejs 'Node 18.x'
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
            when {
                changeset "**/*js"
            }
            steps {
                dir(SRC_FOLDER) {
                    sh 'npm run test_ci'
                }
            }
            post {
                always {
                    dir(SRC_FOLDER) {
                        junit 'junit.xml'
                    }
                }
            }
        }
        stage('Install AWS SAM'){
            steps {
                sh (returnStdout:true, script: 'python3 -m venv venv && venv/bin/pip install aws-sam-cli')
            }
        }
        stage('SAM Integration Tests'){
            steps {
                script {
                    def samCommand = '''nohup venv/bin/sam local start-api \
                        -t test-template.yaml \
                        --docker-network ssl-proxy \
                        --container-host 172.17.0.1 \
                        --container-host-interface 0.0.0.0 \
                        -v /home/diana/dev/projects/auth.nikxy.dev'''

                    def samProcess = sh(returnStdout:true, script: samCommand + " ./sam.log &");
                    echo samProcess;
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
