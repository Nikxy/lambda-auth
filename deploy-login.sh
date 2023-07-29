LOG_FILE=./login-lambda-deploy.log
LAMBDA_NAME=lambda-login

echo 'Starting demployment...'
if [ -e $LOG_FILE ]
then
    echo 'Clearing log file'
    rm $LOG_FILE
fi
echo 'Creating zip archive...'
cd $LAMBDA_NAME
zip -r $LAMBDA_NAME.zip * -x *.test.mjs jest.config.mjs &> /dev/null
echo 'Uploading...'
aws lambda --function-name update-function-code nikxy-auth-login --zip-file fileb://$LAMBDA_NAME.zip  &> ../$LOG_FILE
echo 'Removing zip archive...'
rm $LAMBDA_NAME.zip
echo 'Done.'