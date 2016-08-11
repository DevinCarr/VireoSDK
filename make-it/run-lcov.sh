#!/bin/bash
# Needed because travisci appends '-v' and causes it to break lcov
lcov --base-directory ./objs --directory ./objs --gcov-tool ./llvm-gcov.sh --capture -o cov.info
