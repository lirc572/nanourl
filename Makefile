.PHONY: build clean

all: build

build:
	go build -v -o bin/nanourl .

clean:
	rm -rf bin
	go clean -i
