LOG_FILE=./lambda-deploy.log
SRC_DIR=src

echo 'Starting demployment...'
if [ -e $LOG_FILE ]
then
    echo 'Clearing log file'
    rm $LOG_FILE
fi
echo 'Creating zip archive...'
cd $SRC_DIR
zip -r deploy.zip * -x ./test**\* -x ./node_modules/@aws-sdk**\* -x ./node_modules/@aws-crypto**\* &> /dev/null
echo 'Uploading...'
aws lambda --function-name update-function-code nikxy-auth --zip-file fileb://deploy.zip  &> ../$LOG_FILE
echo 'Removing zip archive...'
rm deploy.zip
echo 'Done.'