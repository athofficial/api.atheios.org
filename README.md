# api.atheios.org
This is the code for the api.atheios.org website. It is using NodeJS and express to fireup a server on port 8080.
The program also interacts with gath, the Atheios blockchain. gath should be running on the same machine as the program interacts with IPC with gath.

The program provides both the api and documentation for the API calls. The documentation is available at https://api.atheios.org, the
api calls are available via https://api.atheios.org/api/... followed by the API call.

# Installation
Git, Nodejs and npm need to be installed. As we will also need mysql, this needs to be also installed. 
First we clone this repository on the home directory of the user
```
git clone https://github.com/athofficial/api.atheios.org
```
Now a directory called api.atheios.org should be available.
Enter the directory with 
```
cd api.atheios.org
```

Thereafter we load the dependencies:
```
$ npm install
```
This will install all dependencies and might take a while. 

Next we install gath, the Atheios blockchain executable. Get the latest gath release and place it in Your home directory in a subdirectory called gath. In gath should be the executable and a start script.

The script is called 'start_gath.sh' and has the following syntax:
```
#!/bin/bash

./gath --rpc --rpcaddr 0.0.0.0 --rpcport 8696 --rpccorsdomain "http://localhost" --rpcapi "personal,db,eth,net,web3" --syncmode=full
```

You can run gath with the start script in the background, however syncing the complete blockchain might take 24hrs or more.
I also run gath with supervisor in order to automatically restart it if it should go down.

# Run
After the blcockchain is fully synced, the following command will start the server.
```
$ node bin/www
```

