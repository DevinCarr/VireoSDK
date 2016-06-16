// Begin postamble
// Add some functions to the vireo object.

Module.v_create = Module.cwrap('EggShell_Create', 'number', ['number']);
Module.v_readDouble = Module.cwrap('EggShell_ReadDouble', 'number', ['number', 'string', 'string']);
Module.v_writeDouble = Module.cwrap('EggShell_WriteDouble', 'void', ['number', 'string', 'string', 'number']);
Module.v_readValueString = Module.cwrap('EggShell_ReadValueString', 'string', ['number', 'string', 'string', 'string' ]);
Module.v_writeValueString = Module.cwrap('EggShell_WriteValueString', 'void', ['number', 'string', 'string', 'string', 'string']);
Module.v_dataWriteString = Module.cwrap('Data_WriteString', 'void', ['number', 'number', 'string', 'number']);
Module.v_dataWriteInt32 = Module.cwrap('Data_WriteInt32', 'void', ['number', 'number']);
Module.v_dataWriteUInt32 = Module.cwrap('Data_WriteUInt32', 'void', ['number', 'number']);
Module.v_repl = Module.cwrap('EggShell_REPL', 'void', ['number', 'string', 'number']);
Module.v_executeSlices = Module.cwrap('EggShell_ExecuteSlices', 'number', ['number',  'number']);
Module.v_delete = Module.cwrap('EggShell_Delete', 'number', ['number']);
Module.v_setOccurrence = Module.cwrap('Occurrence_Set', 'void', ['number']);
Module.v_root =  Module.v_create(0);
Module.v_userShell = Module.v_create(Module.v_root);
Module.fpSync = function(fpId) {};

HttpUser = function (userName, password) {
    'use strict';
    // Properties
    this.userName = userName;
    this.password = password;
    this.headers = {};

    // Methods
    if (typeof this.HttpUserMethods !== 'function') {
        var proto = HttpUser.prototype;
        proto.HttpUserMethods = function () {
        };

        proto.setUserName = function (userName) {
            this.userName = userName;
        };

        proto.getUserName = function () {
            return this.userName;
        };

        proto.setPassword = function (password) {
            this.password = password;
        };

        proto.getPassword = function () {
            return this.password;
        };

        proto.addHeader = function (header, value) {
            this.headers[header] = value;
        };

        proto.removeHeader = function (header) {
            if (this.headers.hasOwnProperty(header))
            {
                delete this.headers[header];
            }
        };

        proto.getHeaderValue = function (header) {
            if (this.headers.hasOwnProperty(header))
            {
                return this.headers[header];
            }
            else
            {
                throw new Error('"' + header + '" is not included in the client handle.');
            }
        };

        proto.headerExist = function (header) {
            if (this.headers.hasOwnProperty(header))
            {
                return true;
            }
            return false;
        };

        proto.listHeaders = function () {
            var outputHeaders = '';
            for (var header in this.headers) {
                outputHeaders += header + ': ' + this.headers[header];
                outputHeaders += '\r\n';
            }
            return outputHeaders;
        };

        proto.getHeaders = function () {
            return this.headers;
        };
    }
};

HttpUsers = function () {
    'use strict';
    // Properties
    this.httpClients = {};

    // Methods
    if (typeof this.HttpUsersMethods !== 'function') {
        var proto = HttpUsers.prototype;
        proto.HttpUsersMethods = function () {
        };

        proto.add = function (userName, password) {
            var httpUser = new HttpUser(userName, password);
            var handle = Object.keys(this.httpClients).length + 1;
            var strHandle = handle.toString();
            this.httpClients[strHandle] = httpUser;
            //console.log ('Created handle(' + handle + ') for user: "' + userName + '".');
            return handle;
        };

        proto.remove = function (handle) {
            var strHandle = handle.toString();
            if (this.httpClients.hasOwnProperty(strHandle))
            {
                var user = this.httpClients[strHandle];
                //console.log ('Deleted handle(' + strHandle + ') for user: "' + user.getUserName() + '".');
                delete this.httpClients[strHandle];
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };

        proto.get = function (handle) {
            var strHandle = handle.toString();
            if (this.httpClients.hasOwnProperty(strHandle))
            {
                var user = this.httpClients[strHandle];
                //console.log ('The following handle(' + strHandle + ') was requested for: "' + user.getUserName() +'".');
                return user;
            }
            else
            {
                return null;
            }
        };

        proto.addHeader = function (handle, header, value) {
            var user = this.get (handle);
            if (user instanceof HttpUser)
            {
                user.addHeader (header, value);
                //console.log ('The following header was added: ' + header + '(' + value + ') for user: "' + user.getUserName() +'".');
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };

        proto.removeHeader = function (handle, header) {
            var user = this.get (handle);
            if (user instanceof HttpUser)
            {
                user.removeHeader (header);
                //console.log ("The following header was removed: " + header);
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };

        proto.getHeaderValue = function (handle, header) {
            var user = this.get (handle);
            if (user instanceof HttpUser)
            {
                var value = user.getHeaderValue (header);
                //console.log ('The following value was returned: "' + value + '" for header: "' + header + '".');
                return value;
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };

        proto.headerExist = function (handle, header) {
            var user = this.get (handle);
            if (user instanceof HttpUser)
            {
                var exist = user.headerExist (header);
                //console.log ('The following headerExist value was returned: "' + exist + '" for header: "' + header + '".');
                return exist;
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };

        proto.listHeaders = function (handle) {
            var user = this.get (handle);
            if (user instanceof HttpUser)
            {
                var value = user.listHeaders ();
                //console.log ('The following list of headers was returned: "' + value + '".');
                return value;
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };
    }
};

CookieJar = function() {
    'use strict';

    // Properties
    this.jar = new Map();

    // Methods
    if (typeof this.CookieJarMethods !== 'function') {
        var proto = CookieJar.prototype;

        proto.CookieJarMethods = function() { };

        proto.create = function (item) {
            var cookie = this.jar.size + 1;
            this.jar.set(cookie, item);
            return cookie;
        };

        proto.remove = function (cookie) {
            if (this.jar.has(cookie)) {
                return this.jar.delete(cookie);
            } else {
                throw new Error('Cookie Jar had no item to delete: ' + cookie.toString());
            }
        };

        proto.get = function (cookie) {
            if (this.jar.has(cookie)) {
                return this.jar.get(cookie);
            } else {
                throw new Error('Cookie Jar had no item to get: ' + cookie.toString());
            }
        };

        proto.set = function (cookie) {
            if (this.jar.has(cookie)) {
                return this.jar.set(cookie);
            } else {
                throw new Error('Cookie Jar had no item to set: ' + cookie.toString());
            }
        };

    }
};

WebBluetoothRequest = function(occurrence, handle, services) {
    this.occurrenceReference = occurrence;
    this.handleReference = handle;
    this.servicesArray = services;
    this.device = undefined;
};


WebBluetooth = function (cookieJar) {
    'use strict';

    // Properties
    this.cookieJar = cookieJar;

    // Methods
    if (typeof this.WebBluetoothMethods !== 'function') {
        var proto = WebBluetooth.prototype;

        proto.WebBluetoothMethods = function() { };

        // Setup the device object and occurrence reference to be set after the user
        // selects the device from the navigator.bluetooth.requestDevice call.
        // Will return 0 if it failed to initiailize the device
        // TODO: devincarr Add checks for valid availability of WebBluetooth on Device
        proto.initializeDevice = function(occurrenceRef, deviceReference, servicesArray) {
            if (!Array.isArray(servicesArray)) {
                throw new Error('Invalid parameters in initializeDevice, looking for an Array, provided: ' + servicesArray);
            }
            var deviceCookie = 0;
            try {
                // store request
                deviceCookie = this.cookieJar.create(new WebBluetoothRequest(occurrenceRef, servicesArray))
                NationalInstruments.Vireo.dataWriteUInt32(deviceReference, deviceCookie);
            } catch (error) {
                // set error and trigger occurrence
                NationalInstruments.Vireo.setOccurence(that.request.occurrence);
            }
                
            return deviceCookie;
        };

        // Start the request device promise chain for a Bluetooth Device
        proto.requestDevice = function(deviceReference) {
            var request = this.cookieJar.get(deviceReference);
            if (request instanceof WebBluetoothRequest) {
                if (request.device !== undefined) {
                    throw new Error('Device is already exists in the request');
                }
                // set the device object for the request as the promise
                request.device = navigator.bluetooth.requestDevice(
                    {filters: [{services: request.servicesArray}] })
                    .then(function(device) {
                        NationalInstruments.Vireo.setOccurence(request.occurrence);
                        return dev;
                    })
                    .catch(function(error) {
                        NationalInstruments.Vireo.setOccurence(request.occurrence);
                        return -1;
                    });
                this.cookieJar.set(deviceReference, request);
            } else {
                // invalid reference parameter passed in
                throw new Error('Invalid handle passed in: ' + deviceReference + ' (expected an instanceof WebBluetoothRequest)');
            }
        };

        proto.getServer = function(device, attempts) {
            console.log('Connecting to GATT Server...');
            return device.gatt.connect()
            .then(function(server) {
                console.log(server);
                if (server.connected === true) {
                    console.log('Connected!');
                    console.log(server);
                    return server;
                } else {
                    console.log('Not Connected, retrying...');
                    return proto.getServer(device,attempts+1);
                }
            })
            .catch(function(error) {
                console.log('Error in connection: ' + error);
                if (++attempts < 8) {
                    console.log('Retrying(' + attempts + ')');
                    return proto.getServer(device,attempts);
                } else {
                    throw error;
                }
            });
        };

        proto.getService = function(server, serviceName) {
            console.log('Getting ' + serviceName + '...');
            console.log(server);
            return server.getPrimaryService(serviceName);
        };

        proto.getCharacteristic = function(service, characteristic) {
            console.log('Getting ' + characteristic + ' Characteristic...');
            console.log(service);
            return service.getCharacteristic(characteristic);
        };

        proto.getValue = function(characteristic) {
            console.log('Reading Value...');
            console.log(characteristic);
            return characteristic.readValue();
        };
    }
};

WebSocketUser = function () {
    "use strict";


};


//TODO: tnelligan change name to reflect it is a collection of connections
WebSocketUsers = function () {
    "use strict";
    //Properties
    this.webSocketClients = {};

    if (typeof this.WebSocketUsersMethods !== 'function') {
        var proto = WebSocketUsers.prototype;
        proto.WebSocketUsersMethods = function () {
        };

        proto.add = function (url, protocol) {
            var webSocketUser = new WebSocket(url); //put protocol in later
            var handle = Object.keys(this.webSocketClients).length + 1;
            var strHandle = handle.toString();
            this.webSocketClients[strHandle] = webSocketUser;
            console.log('Created handle(' + handle + ')');
            return handle;
        };

        proto.remove = function (handle) {
            var strHandle = handle.toString();
            if (this.webSocketClients.hasOwnProperty(strHandle))
            {
                var user = this.webSocketClients[strHandle];
                //console.log ('Deleted handle(' + strHandle + ') for user: "' + user.getUserName() + '".');
                delete this.webSocketClients[strHandle];
            }
            else
            {
                throw new Error('Unknown handle(' + handle + ').');
            }
        };
        proto.get = function (handle) {
            var strHandle = handle.toString();
            if (this.webSocketClients.hasOwnProperty(strHandle))
            {
                var user = this.webSocketClients[strHandle];

                return user;
            }
            else
            {
                return null;
            }
        };
    }
};


var httpUsers = new HttpUsers();

var webSocketUsers = new WebSocketUsers();

var cookieJar = new CookieJar();

var webBluetooth = new WebBluetooth(cookieJar);

//TODO: tnelligan break this up into generic, http, websockets
return {
    version: Module.cwrap('Vireo_Version', 'number', []),
    readDouble:
        function(vi, path)
        { return Module.v_readDouble(Module.v_userShell, vi, path); },
    writeDouble:
        function(vi, path, value)
        { Module.v_writeDouble(Module.v_userShell, vi, path, value); },
    readJSON:
        function(vi, path)
        { return Module.v_readValueString(Module.v_userShell, vi, path, 'JSON'); },
    writeJSON:
        function(vi, path, value)
        { Module.v_writeValueString(Module.v_userShell, vi, path, 'JSON', value); },
    dataWriteString:
        function(destination, source, sourceLength)
        { Module.v_dataWriteString(Module.v_userShell, destination, source, sourceLength); },
    dataWriteInt32:
        function(destination, value)
        { Module.v_dataWriteInt32(destination, value); },
    dataWriteUInt32:
        function(destination, value)
        { Module.v_dataWriteUInt32(destination, value); },
    setOccurence:
        function(occurrence)
        { Module.v_setOccurrence(occurrence); },
    loadVia:
        function(viaText)
        { Module.v_repl(Module.v_userShell, viaText, -1); },
    executeSlices:
        function(slices)
        { return Module.v_executeSlices(Module.v_userShell, slices); },
    reboot:
        function() {
            Module.v_delete(Module.v_userShell);
            Module.v_userShell = Module.v_create(Module.v_root);
        },
    core: Module,
    addHttpUser:
        function (handlePointer, userName, password, errorMessage) {
            var handle = 0;
            var returnValue = 0;
            var errorString = '';
            try
            {
                handle = httpUsers.add (userName, password);
            }
            catch (error)
            {
                handle = 0;
                returnValue = -1;
                errorString = "Unable to open HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteUInt32(handlePointer, handle);
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    removeHttpUser:
        function (handle, errorMessage) {
            var returnValue = 0;
            var errorString = '';
            try
            {
                httpUsers.remove(handle);
            }
            catch (error)
            {
                returnValue = -1;
                errorString = "Unable to close HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    getHttpUser:
        function (handle) {
            return httpUsers.get(handle);
        },
    addHeader:
        function (handle, header, value, errorMessage) {
            var returnValue = 0;
            var errorString = '';
            try
            {
                httpUsers.addHeader (handle, header, value);
            }
            catch (error)
            {
                returnValue = -1;
                errorString = "Unable to add header to HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    removeHeader:
        function (handle, header, errorMessage) {
            var returnValue = 0;
            var errorString = '';
            try
            {
                httpUsers.removeHeader (handle, header);
            }
            catch (error)
            {
                returnValue = -1;
                errorString = "Unable to remove header from HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    getHeaderValue:
        function (handle, header, value, errorMessage) {
            var valueText = '';
            var returnValue = 0;
            var errorString = '';
            try
            {
                valueText = httpUsers.getHeaderValue(handle, header);
            }
            catch (error)
            {
                valueText = '';
                returnValue = -1;
                errorString = "Unable to get header value from HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(value, valueText, valueText.length);
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    headerExist:
        function (handle, header, headerExistPointer, errorMessage) {
            var headerExist = false;
            var returnValue = 0;
            var errorString = '';
            try
            {
                headerExist = httpUsers.headerExist(handle, header);
            }
            catch (error)
            {
                headerExist = false;
                returnValue = -1;
                errorString = "Unable to verify if header exists in HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteUInt32(headerExistPointer, headerExist?1:0);
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    listHeaders:
        function (handle, list, errorMessage) {
            var listText = '';
            var returnValue = 0;
            var errorString = '';
            try
            {
                listText = httpUsers.listHeaders (handle);
            }
            catch (error)
            {
                listText = '';
                returnValue = -1;
                errorString = "Unable to list headers for HTTP handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(list, listText, listText.length);
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    addWebSocketUser:
        function (handlePointer, url, protocol, errorMessage) {
            var handle = 0;
            var returnValue = 0;
            var errorString = '';
            try
            {
                handle = webSocketUsers.add(url, protocol);
            }
            catch (error)
            {
                handle = 0;
                returnValue = -1;
                errorString = "Unable to open WebSocket handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteUInt32(handlePointer, handle);
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    removeWebSocketUser:
        function (handle, errorMessage) {
            var returnValue = 0;
            var errorString = '';
            try
            {
                webSocketUsers.remove(handle);
            }
            catch (error)
            {
                returnValue = -1;
                errorString = "Unable to close WebSocket handle: " + error.message;
            }
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            return returnValue;
        },
    //TODO: tnelligan add try catch and errorMessage and return value
    getWebSocketUser:
        function (handle) {
            return webSocketUsers.get(handle);
        },
    //TODO: tnelligan refactor so that http and websockets both use this
    setOccurenceAndError:
        function (occurrenceRef, errorMessage, errorString, errorNum) {
            NationalInstruments.Vireo.dataWriteString(errorMessage, errorString, errorString.length);
            NationalInstruments.Vireo.setOccurence(occurrenceRef);
            return errorNum;
        },
    putDeviceOccurrence:
        function (occurrenceRef, handler) {
            webBluetooth.putDeviceOcc(occurrenceRef, handler);
        },
    requestWebBluetoothDevice:
        function (services) {
            return webBluetooth.requestDevice(services);
        },
    getWebBluetoothDevice:
        function (userHandle) {
            return webBluetooth.getDevice(userHandle);
        },
    getWebBluetoothBatteryLevel:
        function (userHandle) {
            console.log('Requesting Bluetooth Device battery level...');
            console.log('handleid: ' + userHandle);

            return webBluetooth.getDevice(userHandle)
                .then(function(device) { return webBluetooth.getServer(device,0) })
                .then(function(server) { return webBluetooth.getService(server, 'battery_service') })
                .then(function(service) { return webBluetooth.getCharacteristic(service, 'battery_level') })
                .then(webBluetooth.getValue)
                .then(function(value) {
                    console.log('Got Value:');
                    console.log(value);
                    var batteryLevel = value.getUint8(0);
                    console.log('> Battery Level is ' + batteryLevel + '%');
                    errorMessage = "";
                    NationalInstruments.Vireo.dataWriteString(errorMessage, '', 0);
                    return 0;
                })
                .catch(function(error) {
                    console.log('Argh! ' + error);
                    console.log(error);
                    return error;
                });
        }
};

}());

if (typeof process === 'object' && typeof require === 'function') {
    module.exports = NationalInstruments.Vireo;
}
