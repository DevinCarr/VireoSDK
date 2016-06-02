
var WebBluetoothClient =
{
    jsWebBluetoothClientGetDevice: function (userHandlePointer, service, serviceLength, errorCodePointer, errorMessage, occurrenceRef) {
        var occurrenceHasBeenSet = false;
        function setErrorAndOccurrence(errorCode, operation, additionalErrorText) {
            var fullErrorText = '';
            if (errorCode !== 0) {
                fullErrorText = 'Unable to complete ' + operation + ' operation. Look at your browser console log for more details : ' + additionalErrorText;
            }
            console.log("Setting an error: " + errorCode + " (" + fullErrorText + ")");
            NationalInstruments.Vireo.dataWriteInt32(errorCodePointer, errorCode);
            NationalInstruments.Vireo.dataWriteString(errorMessage, fullErrorText, fullErrorText.length);
            NationalInstruments.Vireo.setOccurence(occurrenceRef);
            if (!occurrenceHasBeenSet) {
                occurrenceHasBeenSet = true;
                NationalInstruments.Vireo.setOccurence(occurrenceRef);
                console.log("Occurrence (" + occurrenceRef + ") has been set to true");
            }
        };
        var serv = Pointer_stringify(service, serviceLength);
        console.log("Entered jsWebBluetoothClientGetDevice, looking for service: " + serv);

        try {
            var services = [];
            services.push(serv);
            // request the device and store the device promise in WebBluetooth.devices
            // and return a key (uint) to the promise
            userHandle = NationalInstruments.Vireo.requestWebBluetoothDevice(services);
            // write the userHandlePointer
            NationalInstruments.Vireo.dataWriteUInt32(userHandlePointer, userHandle);
            console.log("Acquired device, handle: " + userHandle);
            NationalInstruments.Vireo.getWebBluetoothDevice(userHandle)
            .then(function() {
                setErrorAndOccurrence(0, '');
            }).catch(function(error) {
                setErrorAndOccurrence(-1, 'GetDevice', error);
            });
            console.log("Completed");
        } catch (error) {
            setErrorAndOccurrence(-1, 'GetDeviceCatch', error.message);
        }
    },

    jsWebBluetoothClientGetBatteryLevel: function (userHandle, errorMessage) {
        return NationalInstruments.Vireo.getWebBluetoothBatteryLevel(userHandle, errorMessage)
            .catch(function(error) {
                NationalInstruments.Vireo.dataWriteString(errorMessage, error, error.length);
                return -1;
            });
    }
};

mergeInto(LibraryManager.library, WebBluetoothClient);
