clean:
	rm -rf pkg
	
build:
	wasm-pack build
	npm run build

deploy: build
	scp -r dist/* theantway:/var/www/sites/html-converter.theantway.com/
