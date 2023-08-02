LOG_FILE=./status-lambda-deploy.log
LAMBDA_NAME=lambda-status

echo 'Starting demployment...'
if [ -e $LOG_FILE ]
then
    echo 'Clearing log file'
    rm $LOG_FILE
fi
echo 'Creating zip archive...'
cd $LAMBDA_NAME
zip -r $LAMBDA_NAME.zip * &> /dev/null
echo 'Uploading...'
aws lambda --function-name update-function-code nikxy-auth-status --zip-file fileb://$LAMBDA_NAME.zip  &> ../$LOG_FILE
echo 'Removing zip archive...'
rm $LAMBDA_NAME.zip
echo 'Done.'