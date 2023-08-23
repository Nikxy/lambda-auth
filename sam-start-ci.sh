venv/bin/sam local start-api -t test-template.yaml \
--docker-network ssl-proxy \
--container-host 172.17.0.1 \
--container-host-interface 0.0.0.0 \
-v /home/diana/dev/jenkins_workspace/auth.nikxy.dev-login