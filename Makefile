clean:
	rm -rf pkg
	
build:
	wasm-pack build
	npm run build
