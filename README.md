# ID1212-Project

## Config
1. Clone repo
2. Set up some firebase admin stuff
3. `yarn install`
4. `yarn dev`
5. Go crazy

## For db container in docker:
1. navigate to db folder
1. Do `docker network create realtime-network`
1. Do `docker build -t realtime-document-db ./`
1. Do `docker run --network realtime-network -d --name realtime-document-db-container -p 5432:5432 realtime-document-db`
## For server container in docker:
1. Navigate to server folder
1. Do `docker inspect realtime-document-db-container | grep IPAddress`
1. Change host property in client object at ./server/api/database/ to result from step 2
1. Do `docker build . -t realtime-document`
1. Do `docker run --network realtime-network --name realtime-document-server -p 8888:8888 -p 7777:7777 -d realtime-document`

