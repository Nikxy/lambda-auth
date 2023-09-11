venv/bin/sam local start-api -t cloudformation.yml \
--region il-central-1 \
--parameter-overrides ParameterKey=EnvironmentType,ParameterValue=test \
--docker-network ssl-proxy \
--container-host 172.17.0.1 \
--container-host-interface 0.0.0.0 \
-v /home/diana/dev/jenkins_workspace/auth.nikxy.dev