node ./actors-service/index.js &
node ./movies-service/index.js &
sleep 2 &&
  node ./gateway-service/index.js && fg
