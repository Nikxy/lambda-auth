if [ $# -eq 0 ]
  then
    echo "No event name supplied"
    exit 1
fi
echo 'Running LoginFunction with event '$1

sam local invoke LoginFunction -t test-template.yaml -e sam-events/$1.json \
--docker-network ssl-proxy \
--container-host 172.17.0.1 \
--container-host-interface 0.0.0.0