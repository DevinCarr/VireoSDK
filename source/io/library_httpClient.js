
var HttpClient =
{
    jsHttpClientOpen: function (cookieFile, cookieFileLength, userName, userNameLength, password, passwordLength, verifyServer, userHandlePointer, errorMessage) {
        return NationalInstruments.Vireo.addHttpUser(userHandlePointer, Pointer_stringify(userName, userNameLength), Pointer_stringify(password, passwordLength), errorMessage);
    },

    jsHttpClientClose: function (userHandle, errorMessage) {
        return NationalInstruments.Vireo.removeHttpUser(userHandle, errorMessage);
    },

    jsHttpClientAddHeader: function (userHandle, header, headerLength, value, valueLength, errorMessage) {
        return NationalInstruments.Vireo.addHeader(userHandle, Pointer_stringify(header, headerLength), Pointer_stringify(value, valueLength), errorMessage);
    },

    jsHttpClientRemoveHeader: function (userHandle, header, headerLength, errorMessage) {
        return NationalInstruments.Vireo.removeHeader(userHandle, Pointer_stringify(header, headerLength), errorMessage);
    },

    jsHttpClientGetHeader: function (userHandle, header, headerLength, value, errorMessage) {
        return NationalInstruments.Vireo.getHeaderValue(userHandle, Pointer_stringify(header, headerLength), value, errorMessage);
    },

    jsHttpClientHeaderExist: function (userHandle, header, headerLength, headerExistPointer, errorMessage) {
        return NationalInstruments.Vireo.headerExist(userHandle, Pointer_stringify(header, headerLength), headerExistPointer, errorMessage);
    },

    jsHttpClientListHeaders: function (userHandle, list, errorMessage) {
        return NationalInstruments.Vireo.listHeaders(userHandle, list, errorMessage);
    },

    jsHttpClientMethod: function (methodId, userHandle, url, urlLength, outputFile, outputFileLength, buffer, bufferLength, timeOut, headers, body, errorCodePointer, errorMessage, occurrenceRef) {
        var methodNames = ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'];
        var methodName = methodNames[methodId];

        // Setup parameters
        var urlString = Pointer_stringify(url, urlLength);
        var outputFile = Pointer_stringify(outputFile, outputFileLength);
        var bufferString = undefined;
        if (buffer) {
            bufferString = Pointer_stringify(buffer, bufferLength);
        }

        var occurrenceHasBeenSet = false;
        function setErrorAndOccurrence(errorCode, operation, additionalErrorText) {
            var fullErrorText = '';
            if (errorCode !== 0) {
                fullErrorText = 'Unable to complete ' + operation + ' operation. Look at your browser console log for more details : ' + additionalErrorText;
                //console.log(fullErrorText);
            }
            NationalInstruments.Vireo.dataWriteInt32(errorCodePointer, errorCode);
            NationalInstruments.Vireo.dataWriteString(errorMessage, fullErrorText, fullErrorText.length);
            NationalInstruments.Vireo.setOccurrence(occurrenceRef);
            if (!occurrenceHasBeenSet) {
                occurrenceHasBeenSet = true;
                NationalInstruments.Vireo.setOccurrence(occurrenceRef);
            }
        };

        try {
            //NationalInstruments.Vireo.makeRequest(userHandle, methodName, urlString, timeOut, bufferString, successCallback, errorCallback, timeOutCallback);
            var httpUser = NationalInstruments.Vireo.getHttpUser(userHandle);

            var request = new XMLHttpRequest();
            request.open(methodName, urlString);
            request.timeout = timeOut;

            // Set the headers
            if (httpUser instanceof HttpUser) {
                var allHeaders = httpUser.getHeaders();
                for (var key in allHeaders) {
                    if (allHeaders.hasOwnProperty(key)) {
                        request.setRequestHeader(key, allHeaders[key]);
                    }
                }
            }

            request.onreadystatechange = function (event) {
                if (request.readyState === 4) {
                    if (request.status == 200) {
                        // Success!
                        var errorString = '';
                        var headersText = request.getAllResponseHeaders();
                        var bodyText = request.responseText;

                        NationalInstruments.Vireo.dataWriteString(headers, headersText, headersText.length);
                        if (body) {
                            NationalInstruments.Vireo.dataWriteString(body, bodyText, bodyText.length);
                        }
                        setErrorAndOccurrence(0, '');
                    } else {
                        setErrorAndOccurrence(-1, methodName, request.statusText + '(' + request.status + ').');
                    }
                }
            };

            request.onerror = function (event) {
                setErrorAndOccurrence(-1, methodName, event.target.statusText + '(' + event.target.status + ').');
            };

            request.ontimeout = function (event) {
                setErrorAndOccurrence(-1, methodName, 'The time out value of ' + timeOut + ' was exceeded.');
            }

            if (bufferString === undefined) {
                request.send();
            } else {
                request.send(bufferString);
            }
        }
        catch (error) {
            setErrorAndOccurrence(-1, methodName, error.message);
        }
    }
};

mergeInto(LibraryManager.library, HttpClient);
