# Now Micro

[![Build Status](https://travis-ci.org/lucasconstantino/now-micro.svg?branch=master)](https://travis-ci.org/lucasconstantino/now-micro)
[![coverage](https://img.shields.io/codecov/c/github/lucasconstantino/now-micro.svg?style=flat-square)](https://codecov.io/github/lucasconstantino/now-micro)
[![npm version](https://img.shields.io/npm/v/now-micro.svg?style=flat-square)](https://www.npmjs.com/package/now-micro)

Proper Micro builder for [Now 2.0](https://zeit.co/blog/now-2)

## Purpose

As of now, `@now/node` lambdas resemble a lot a [Micro](https://github.com/zeit/micro) environment, but it is just not that, which causes quite a lot of [unexpected](https://hyperion.alpha.spectrum.chat/zeit/now/504-lambda-invocation-timeout~dd711cf6-347d-4a91-83b3-c2ae097c4ce1) [results](https://github.com/zeit/now-builders/issues/133).

## Installation

`yarn add now-micro`

## Usage

Use `now-micro` in your builders on `now.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "file.js", "use": "now-micro" }]
}
```

Develop your lambdas as a fully Micro compatible function:

```js
// ex. showing async usage and value returning (no res.end):
module.exports = async req => Promise.resolve(`Some result`)
```
