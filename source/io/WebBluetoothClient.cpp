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
    extern Int32 jsWebBluetoothClientConnect(UInt32, StringRef);
}
#endif

//------------------------------------------------------------
// handle(0), error code(1), error message(2)
VIREO_FUNCTION_SIGNATURE7(WebBluetoothClientConnect, UInt32, Int32, StringRef)
{
#if kVireoOS_emscripten
    _Param(1) = jsWebBluetoothClientConnect(_Param(0), _Param(2));
#endif
    return _NextInstruction();
}

//------------------------------------------------------------
DEFINE_VIREO_BEGIN(WebBluetoothClient)
    DEFINE_VIREO_REQUIRE(Synchronization)
    DEFINE_VIREO_FUNCTION(WebBluetoothClientConnect, "p(i(.UInt32) io(.Int32) o(.String))")
DEFINE_VIREO_END()
#endif
