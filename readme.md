
Link to article: [here](https://blog.usejournal.com/build-a-decentralized-react-native-application-9897b5d88641)

# Setting up 



## Ensure you have Node.js installed on your machine if not download

## To get started
* Install  Ganache globally
        ```npm i -g ganache-cli```

* Download IPFS locally 
     
        
* Download IPFS => https://ipfs.io/docs/install/

* Start an IPFS node with your CLI;

    ```
    ipfs init 
    ```

    ```
    ipfs daemon 
    ```
* cd into the backend folder and run
    ```npm start ```

* install dependencies
    ``` npm i ```
    
* start ganache 
    ```node_modules/.bin/testrpc```

* cd into frontend

* install dependencies
    ``` npm i ```
    
* Add  a local.properties file in the root of the android folder.The local.properties should contain  a link to your sdk e.g
    ```sdk.dir = /Users/david/Library/Android/sdk```
    
* Start your emulator

* start the app
    ```react-native run-android```

