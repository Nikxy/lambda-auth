sam local invoke LoginFunction -t test-template.yaml -e sam-events/empty-body.json \
--docker-network ssl-proxy \
--container-host 172.17.0.1 \
--container-host-interface 0.0.0.0