## Medical Sample Database
	SAM Research Database is a full stack web application which helps to minimize the task of maintaining the record of the results obtained after conducting tests on medical samples of children 
## Usage

 - Development server
```
Change database credentials in server/config/local_config.json.
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

**Cloning**:
```
clone this repo in /data/web/medsample
cd medicalsample
cd client && npm install && cd ..
cd server && npm install && cd ..
```

**Add Environment Variables**:
```
pm2 stop medsample_server
pm2 stop medsample_client
setenv MED_DEPLOY_ENV deployment
setenv REACT_APP_MED_DEPLOY_ENV deployment
```
**Start Application**:
```
cd server && pm2 start index.js --name "medsample_server" && cd ..
cd client && pm2 start --name "medsample_client" npm -- start && cd ..

```
