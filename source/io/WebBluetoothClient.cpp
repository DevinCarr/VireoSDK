/**

Copyright (c) 2015 National Instruments Corp.

This software is subject to the terms described in the LICENSE.TXT file

SDG
*/

#include <stdio.h>

#include "TypeDefiner.h"
#include "ExecutionContext.h"
#include "StringUtilities.h"
#include "TDCodecVia.h"
#include "VirtualInstrument.h"

#if defined (VIREO_TYPE_WebBluetoothClient)

#if kVireoOS_emscripten
#include "emscripten.h"
#endif

using namespace Vireo;

#if kVireoOS_emscripten

extern "C" {
    extern void jsWebBluetoothClientGetDevice(UInt32 *, const char *, int, Int32 *, StringRef, OccurrenceRef);
    extern Int32 jsWebBluetoothClientGetBatteryLevel(UInt32, StringRef);
}
#endif

//------------------------------------------------------------
// handle(0), service(1), error code(2), error message(3), occurrence(4)
VIREO_FUNCTION_SIGNATURE5(WebBluetoothClientGetDevice, UInt32, StringRef, Int32, StringRef, OccurrenceRef)
{
#if kVireoOS_emscripten
    jsWebBluetoothClientGetDevice(
        _ParamPointer(0),
        (char*)_Param(1)->Begin(),
        _Param(1)->Length(),
        _ParamPointer(2),
        _Param(3),
        _Param(4));
#endif
    return _NextInstruction();
}

//------------------------------------------------------------
// handle(0), error code(1), error message(2)
VIREO_FUNCTION_SIGNATURE3(WebBluetoothClientGetBatteryLevel, UInt32, Int32, StringRef)
{
#if kVireoOS_emscripten
    _Param(1) = jsWebBluetoothClientGetBatteryLevel(_Param(0), _Param(2));
#endif
    return _NextInstruction();
}

//------------------------------------------------------------
DEFINE_VIREO_BEGIN(WebBluetoothClient)
    DEFINE_VIREO_REQUIRE(Synchronization)
    DEFINE_VIREO_FUNCTION(WebBluetoothClientGetDevice, "p(io(.UInt32) i(.String) io(.Int32) o(.String) i(.Occurrence))")
    DEFINE_VIREO_FUNCTION(WebBluetoothClientGetBatteryLevel, "p(io(.UInt32) io(.Int32) o(.String))")
DEFINE_VIREO_END()
#endif
