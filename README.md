## Medical Sample Database

## Usage

-- Development server
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

-- Production Deployment process
```
Change database credentials in server/config/config.json.
```

```
In server directory, run below script
# Install dependencies && Start
npm install && npm run production-deploy
pm2 start index.js -i 0 --watch
```
