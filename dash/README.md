# Description

Script to generate a Docset for [Dash](https://kapeli.com/dash) based on the official API documentation.

## Instructions

First, build the regular API docs

```shell
cd node-mongodb-native
make
```

Then build the docset

```shell
cd dash
make
```

And finally add the Docset to Dash by double clicking the resulting **node-mongodb-native.docset** file.