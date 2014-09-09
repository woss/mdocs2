build: html js

# css:
# 	node_modules/.bin/cssimport style/main.css ./ ./style ./style/font-awesome > style/main.min.css

html:
	@node_modules/.bin/jade -O '{"prod": false}' index.jade

js:
	@node_modules/.bin/browserify client_side/index.js -t jadeify -d -o main.js
	@node_modules/.bin/uglifyjs main.js > main.min.js
	@echo "generated main.js"

clean:
	@rm -f main.js index.html style/main.min.css

run: html js
	@node_modules/.bin/serve

run-dev:
	@`which supervisor` > /dev/null || (echo "Please install supervisor via npm '(sudo) npm install -g supervisor'" && exit 1)
	@supervisor --extensions html,js,css,jade -i main.js,index.html -x make -- run

.PHONY: css, build, html, js, clean