const express = require('express');
const http = require('http');
const moment = require('moment');
const path = require('path');
const iotHubClient = require('./node_modules/azure-iothub/iothub.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

var IOTHubHostName = 'iothub-grp1.azure-devices.net';
var IOTHubConnectionString = 'HostName='+IOTHubHostName+';SharedAccessKeyName=iothubowner;SharedAccessKey=xQ4fePtMRPCfxrzthc467zkQh865nXLc7ZNdPoSMTWA=';
var registry = iotHubClient.Registry.fromConnectionString(IOTHubConnectionString);
//Sample test URI: http://localhost:3000/register/myDeviceId11

function printDeviceInfo(device, deviceInfo, response){
  registry.get(device.deviceId, function(err, deviceInfo, res){ 
    //Sample output connection string -> 'HostName=iothub-grp1.azure-devices.net;DeviceId=###;SharedAccessKey=###''
    var DeviceID = deviceInfo.deviceId;
    var DeviceKey = deviceInfo.authentication.symmetricKey.primaryKey;
    var DeviceConnectionString = 'HostName='+IOTHubHostName+';DeviceId='+DeviceID+';SharedAccessKey='+DeviceKey;
    response.write('DeviceConnectionString: '+DeviceConnectionString);
    response.end();
    });
}

app.get('/register/:deviceID', function (req, response) {
    var device = {'deviceId': req.params.deviceID };
    console.log('get data for: '+device);
    registry.create(device, function(err, deviceInfo, res) {
      if (err) {
        response.write("Device already exist");    
      }
      printDeviceInfo(device, deviceInfo, response);  
    });
});


const server = http.createServer(app);
var port = normalizePort(process.env.PORT || '3000');

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

