#!/usr/bin/env bash

rm -rf *.html assets
cp -r dist/. . && rm -rf dist
