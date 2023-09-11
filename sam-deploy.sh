sam deploy \
--stack-name nikxy-auth \
--region il-central-1 \
--s3-bucket nikxy-cloudformation \
--s3-prefix sam-nikxy-auth \
--on-failure ROLLBACK \
--capabilities CAPABILITY_NAMED_IAM