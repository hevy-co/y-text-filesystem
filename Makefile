DIST     := dist
TEST_OUT := tests/out

default: test

build:
	npx tsc

clean:
	rm -rf $(DIST) $(TEST_OUT)

test: build
	@mkdir -p $(TEST_OUT)
	npx ava $(DIST)/tests/y-filesystem.tests.js