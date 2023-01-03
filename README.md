# ID1212-Project
 ## For db container in docker:
    1. navigate to db folder
    2. Do ```docker network create realtime-network```
    3. Do ```docker build -t realtime-document-db ./```
    4. Do ```docker run --network realtime-network -d --name realtime-document-db-container -p 5432:5432 realtime-document-db```
## For server container in docker:
    1. Navigate to server folder
    2. Do ```docker inspect realtime-document-db-container | grep IPAddress```
    3. Change host property in client object at ./server/api/database/ to result from step 2
    4. Do ```docker build . -t realtime-document```
    5. Do ```docker run --network realtime-network --name realtime-document-server -p 8888:8888 -p 7777:7777 -d realtime-document```

