#!/bin/sh

DIR=`dirname $(readlink -f "$0")`
CWD=`pwd`
FILE=$1

cd "$DIR"
cat "$FILE" \
	| node cleanLinks.js \
	| node normalizeTags.js

