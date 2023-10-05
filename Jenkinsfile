def SRC_FOLDER = 'src'
def CONFIG_FILE = configFile(fileId:'auth-service-config', variable:'config_json')

pipeline {
    agent any

    tools {
        nodejs 'Node 18.x'
    }
    environment {
        // Check if node_modules has been installed in previous builds
        TEST_NODE_MODULES_EXISTS = fileExists 'node_modules'
        SRC_NODE_MODULES_EXISTS = fileExists 'src/node_modules'
        // Check if AWS SAM has been installed in previous builds
        AWS_SAM_EXISTS = fileExists 'venv/bin/sam'
    }

    stages {
        stage('Install AWS SAM') {
            when { expression { AWS_SAM_EXISTS == 'false' } }
            steps {
                // Install AWS SAM with Python into venv to keep the install only for the build
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
                configFileProvider([CONFIG_FILE]) {
                    script {
                        config = readJSON(file:config_json)

                        // Read sam arguments from file
                        def sam_arguments = readFile "${WORKSPACE}/sam-api-arguments.sh"
                        
                        // Start SAM
                        sh "nohup venv/bin/sam $sam_arguments " +
                            "--region $config.LOCALSTACK_TESTING_REGION "+
                            "-v $config.DOCKER_HOST_WORKSPACE " +
                            "--parameter-overrides EnvironmentType=test "+
                            "LocalStack=$config.LOCALSTACK_URL " +
                            "> $WORKSPACE/sam.log 2>&1 &"

                        // Wait for SAM finish initializing
                        def waitStatus = sh returnStatus: true, script:  '''#!/bin/bash
                            time=0
                            while [[ $(tail -n 1 sam.log) != *"CTRL+C"* ]]
                            do 
                                echo "waiting for sam"
                                sleep 1
                                if((time > 30)); then
                                    exit 1
                                fi
                                time=$((time+1))
                            done
                        '''
                        if(waitStatus != 0){
                            error 'Sam Timeout'
                        }

                        // Run integration tests
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
                configFileProvider([CONFIG_FILE]) {
                    withCredentials([usernamePassword(
                            credentialsId: 'AWSJenkinsDeploy',
                            usernameVariable: 'AWS_ACCESS_KEY_ID',
                            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                        )]) {
                        script {
                            config = readJSON(file:config_json)
                            sh "venv/bin/sam deploy --no-progressbar "+
                                "--stack-name $config.AWS_STACK_NAME "+
                                "--region $config.AWS_DEPLOY_REGION "+
                                "--s3-bucket $config.SAM_S3 --s3-prefix sam-$config.AWS_STACK_NAME " +
                                "--on-failure ROLLBACK --capabilities CAPABILITY_NAMED_IAM"
                        }
                    }
                }
            }
        }
    }
}
