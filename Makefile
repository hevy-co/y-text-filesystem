DIST := dist

default: test

build:
	npx tsc

test: build
	npx mocha --trace-warnings $(DIST)/tests/y-filesystem.tests.js