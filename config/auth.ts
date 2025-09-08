// Move sensitive config to separate file
/* 
  ref: https://react-native-google-signin.github.io/docs/original
  To configure the Android client in the Google Auth Platform console, 
  you must provide the SHA1 key got from the below command:
  `cd android/ && ./gradlew signingReport`
  Do not use the keytool command as its output is not used by Expo
*/
export const AUTH_CONFIG = {
  WEB_CLIENT_ID: '734081178634-59heofe6sep82c3qvnf1kbkaic94bu4q.apps.googleusercontent.com',
  CLIENT_ID: '734081178634-b4s3as3h4dnnu0nde7uf2s80asi08ko9.apps.googleusercontent.com', // Android Client ID
  IOS_CLIENT_ID: '734081178634-f5nooqccroj42u62ebfn6kqf1u4rflq3.apps.googleusercontent.com',
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/documents.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/presentations.readonly',
    'https://www.googleapis.com/auth/calendar'
  ],
  offlineAccess: false // if you want to access Google API on behalf of the user FROM YOUR SERVER
};