# api.atheios.org
This is the code for the api.atheios.org website. It is using NodeJS and express to fireup a server on port 8080.
The program also interacts with gath, the Atheios blockchain. gath should be running on the same machine as the program interacts with IPC with gath.

The program provides both the api and documentation for the API calls. The documentation is available at https://api.atheios.org, the
api calls are available via https://api.atheios.org/api/... followed by the API call.

# Installation
Nodejs and npm need to be installed. Issue
```
$ npm install
```
This will install all dependencies. After that You can start the server. However note that You need also have gath running in the background. Get the latest gath release and make sure it is running in Your local directory. I create for that a directory in the home dir call gath. That one holds the executable and a script. The script is called 'start_gath.sh' and has the following syntax:
```
#!/bin/bash

./gath --rpc --rpcaddr 0.0.0.0 --rpcport 8696 --rpccorsdomain "http://localhost" --rpcapi "personal,db,eth,net,web3"
# --ipcapi "personal,db,eth,net,web3"

```

# Run
The following command will start the server.
```
$ node bin/www
```

