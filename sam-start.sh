sam local start-api -t sam-test-template.yaml \
--docker-network ssl-proxy \
--container-host 172.17.0.1 \
--container-host-interface 0.0.0.0 \
--host 0.0.0.0