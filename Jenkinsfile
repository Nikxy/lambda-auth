def SRC_FOLDER = 'src'

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        AWS_SAM_EXISTS = fileExists 'venv/bin/sam'
        AWS_DEFAULT_REGION = 'il-central-1'
    }

    stages {
        stage('Install AWS SAM') {
            when { expression { AWS_SAM_EXISTS == 'false' } }
            steps {
                echo 'Installing AWS SAM'
                sh(returnStdout:true, script: 'python3 -m venv venv && venv/bin/pip install aws-sam-cli')
            }
        }
        stage('Install src npm dependencies') {
            when {
                anyOf { changeset 'src/package.json'; changeset 'src/package-lock.json' }
            }
            steps {
                dir(SRC_FOLDER) { sh 'npm ci' }
            }
        }
        stage('Install test npm dependencies') {
            when {
                anyOf { changeset './package.json'; changeset './package-lock.json' }
            }
            steps {
                sh 'npm ci'
            }
        }
        stage('Unit Tests') {
            when {
                anyOf { changeset 'src/**'; changeset 'tests/unit/**'; changeset 'Jenkinsfile' }
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
        stage('SAM Integration Tests') {
            when {
                anyOf { changeset 'src/**'; changeset 'tests/integration/**'; changeset 'Jenkinsfile' }
            }
            
            steps {
                sh 'chmod +x sam-start-ci.sh'
                sh 'nohup ./sam-start-ci.sh > $WORKSPACE/sam.log 2>&1 &'
                sh 'sleep 10'
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
                    sh 'venv/bin/sam deploy --stack-name nikxy-auth --region ${AWS_DEFAULT_REGION} \
                        --s3-bucket nikxy-cloudformation --s3-prefix sam-nikxy-auth \
                        --on-failure ROLLBACK --capabilities CAPABILITY_NAMED_IAM \
                        --no-progressbar'
                }
            }
        }
    }
}
