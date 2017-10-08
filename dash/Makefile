generate_docs:
	mkdir -p node-mongodb-native.docset/Contents/Resources/Documents/
	cp -R ../public/* node-mongodb-native.docset/Contents/Resources/Documents/
	cp Info.plist node-mongodb-native.docset/Contents
	rm -f node-mongodb-native.docset/Contents/Resources/docSet.dsidx
	node parse.js
