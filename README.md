## Medical Sample Database

## Usage

 - Development server
```
Change database credentials in server/config/config.json.
```

```
In server directory, run below script
# Install dependencies && Start
npm install & npm start
```

```
In client directory, run below script
# Install dependencies && Start
npm install & npm start
```
- Deployment process
```
Add Environment Variables
```
```
pm2 stop medsample_server
pm2 stop medsample_client
setenv MED_DEPLOY_ENV deployment
setenv REACT_APP_MED_DEPLOY_ENV deployment
```
```
In medicalsample directory, run below commands
cd server && pm2 start index.js --name "medsample_server" && cd ..
cd client && pm2 start --name "medsample_client" npm -- start && cd ..

```
