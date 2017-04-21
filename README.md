# Sajari React SDK

![npm version](https://img.shields.io/npm/v/sajari-react.svg?style=flat-square) ![license](http://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

**sajari-react** is a library of React Components for the [Sajari](https://www.sajari.com) search platform to help build fast and powerful search interfaces.

React provides a simple and elegant way to structure user interfaces. The Sajari React SDK provides a way to seamlessly integrate the Sajari platform into any React app through the use of easily composable Components.

We also provide a vanilla Sajari JS library [here](https://github.com/sajari/sajari-sdk-js/).


## Table of Contents

* [Setup](#setup)
  * [NPM](#npm)
* [Getting started](#getting-started)
* [Examples](#examples)
  * [Basic Search](#basic-search)
* [UI](#ui)
  * [BodyInput](#bodyinput)
* [Components](#components)
  * [Body](#body)
  * [Pagination](#pagination)
* [API](#api)
  * [Body](#body-api)
  * [Page](#page)
  * [Limit](#limit)
  * [Fields](#fields)
  * [RegisterNamespace](#registernamespace)
  * [Response](#response)
  * [Filter](#filter)
  * [Index Boosts](#index-boosts)
    * [FieldInstanceBoost](#fieldinstanceboost)
    * [ScoreInstanceBoost](#scoreinstanceboost)
  * [Field Boosts](#field-boosts)
    * [FilterFieldBoost](#filterfieldboost)
    * [DistanceFieldBoost](#distancefieldboost)
    * [IntervalFieldBoost](#intervalfieldboost)
    * [ElementFieldBoost](#elementfieldboost)
    * [TextFieldBoost](#textfieldboost)
  * [Sort](#sort)
  * [Aggregates](#aggregates)
    * [BucketAggregate](#bucketaggregate)
    * [CountAggregate](#countaggregate)
    * [MetricAggregate](#metricaggregate)
* [License](#license)
* [Browser Support](#browser-support)

## Setup

### NPM

```
npm install --save sajari sajari-react
```

## Getting Started

Here is a barebones use of the library.

- The project and collections is registered to the `default` namespace
- An `<input>` element is rendered, with it's value being linked to the body of the query
- The results of the query are injected into `ResultRenderer`
- `ResultRenderer` renders the results into HTML

```javascript
import { RegisterNamespace, ResultInjector } from 'sajari-react/api-components'
import { BodyInput } from 'sajari-react/ui-components'

const App = () => (
  <div>
    <RegisterNamespace project='bobstools' collection='inventory' />
    <BodyInput />
    <ResultInjector>
      <YourResultRenderer />
    </ResultInjector>
  </div>
)
```

##

The library is split into 3 main parts:

- `ui`: A selection of pre-defined React components for common search use cases.  We also provide some simple event handling to reduce the amount of code you need to write.  This is a great starting for getting to grips with the search system - you should only need to use a few components to get up and running.

- `components`: A high-level set of React components for building search interfaces.  Most `components` combine a few `api` components and do basic event handling for common search use cases. Ideal for customisation of search parameters using `api` components whilst also using taking care of basic search session life-cycles.

- `api`: A set of React components which correspond directly to query parameters and result handling.  They do not render any HTML directly; including an api-component in a render attaches its corresponding query parameter to the current query.

## Examples

### [Site Search Integration](./examples/basic-site-integration/)

The [site search integration](./examples/basic-site-integration/) is the fastest way to get an interface on your website.

### [Basic search](./examples/basic-search/)

[This example](./examples/basic-search/) showcases a simple web app with instant search.

### [Overlay](./examples/overlay/)

The [Overlay](./examples/overlay/) showcases an overlay interface to search made for inclusion in web pages to get search up and running in the quickest time possible.

## License

We use the [MIT license](./LICENSE)

## Browser Support

The browser support is dependent on the React library, which currently supports recent versions of Chrome, Firefox, Sajari, Opera, and IE9+. (17/8/2016)
