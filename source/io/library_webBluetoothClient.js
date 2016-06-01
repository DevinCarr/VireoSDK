
var WebBluetoothClient =
{
    jsWebBluetoothClientMethod: function (userHandle, errorMessage) {
        return NationalInstruments.Vireo.WebBluetooth(userHandle, errorMessage);
    }
};

mergeInto(LibraryManager.library, WebBluetoothClient);
