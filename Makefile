# Makefile for TravisCI

.PHONY: native js testjs testnative docs

all: native js

native:
	cd make-it; make simple

js:
	cd make-it; make vjs

test: testnative testjs

testjs:
	cd test-it; ./test.js -j

testnative:
	cd test-it; ./test.js -n

clean:
	cd make-it; make clean

docs:
	cd make-it; make coverage
	cd make-it; ./deploy-docs.sh
