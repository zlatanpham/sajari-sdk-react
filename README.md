# Sajari React SDK

![npm version](https://img.shields.io/npm/v/sajari-react.svg?style=flat-square) ![license](http://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

**sajari-react** is a client side javascript library of React Components for the [Sajari](https://www.sajari.com) search platform to help build fast and powerful search interfaces.

React provides a simple and elegant way to structure user interfaces. The Sajari React SDK provides a way to seamlessly integrate the Sajari platform into any web-based app through the use of easily composable Components.

We also provide a vanilla Sajari JS library [here](https://github.com/sajari/sajari-sdk-js/).

<img width="1060" alt="screen shot 2017-07-26 at 8 42 16 pm" src="https://user-images.githubusercontent.com/2822/28617328-4ce241aa-7243-11e7-8d0e-47fdde1867e6.png">

# Table of Contents

* [Examples](#examples)
* [Setup](#setup)
  * [NPM](#npm)
* [Getting started](#getting-started)
* [License](#license)
* [Browser Support](#browser-support)

# Examples

It's easy to get up and running using one of our examples as a starting point.  They're pre-configured with all the correct dependencies, so all you need to do is copy the example directory into your own workspace and you're on your way!

* [Autocomplete](./examples/autocomplete-only/): Search box with autocomplete.
* [Simple Search](./examples/simple-search/): Instant search with autocomplete.
* [Standard Search](./examples/standard-search/): Instant search with autocomplete + tab filtering.
* [Custom Result Renderer](./examples/custom-result-renderer/): Instant search with autocomplete + custom result renderers.
* [Radio/Checkbox](./examples/radio-checkbox/): Radio/Checkbox filtering.

# Setup

Check out our examples for the best way to get started.  You only need to follow the instructions here if you are wanting to add the SDK to an existing project, or just want to start from scratch.

### NPM

We currently distribute the `sajari-react` library through npm. Npm is only required for downloading the library. The SDK is made to be used from the browser.

```
npm install --save sajari sajari-react
```

# Performing Searches

To perform a search on a collection, you'll need a few key pieces:

* `Client`: used to make underlying API calls.
* `Pipeline`: handles search requests/response lifecycle.
* `Values`: set of key-value pairs defining parameters to use in `Pipeline` search requests.

For the mostpart, you'll be using the pre-defined `website` pipeline for searching, which provides a great starting point for website search.

```javascript
import { Client, Tracking } from "sajari";
import { Pipeline, Values } from "sajari-react/controllers";

// Setup your project/collection configuration
const project = "<your-project>";
const collection = "<your-collection>";
const pipelineName = "website";

// Create a client for making API requests.
const client = new Client(project, collection);
const tracking = new Tracking();

// Create a pipeline for handling the "website" pipeline.
const pipeline = new Pipeline(client, "website");

// Pipeline parameters are defined in values.
const values = new Values();
values.set({
  "q": "awesome articles",
  "filter": "category='articles'",
})

// Perform a search
pipeline.search(values, tracking);
```

# Quick Reference

This library includes a standard set of components for building search interfaces.

## AutocompleteInput

![autocomplete](https://media.giphy.com/media/26zyVB5UcumOfOInu/giphy.gif)

`AutocompleteInput` provides a text-box which performs searches as the user types and renders appropraite autocomplete suggestions back in the input box.

```javascript
import { AutocompleteInput } from "sajari-react/ui/text";

<AutocompleteInput values={values} pipeline={pipeline} />
```

## Input

`Input` is a plain search box which does not show autocomplete suggestions.

```javascript
import { Input } from "sajari-react/ui/text";

<Input values={values} pipeline={pipeline} />
```

# Building Facets

Use the `Filter` helper-class from `sajari-react/controllers` to integrate facets into UI.  The library provides a standard set of components under `sajari-react/ui/facets` which can automatically bind state to `Filter` instances.  For more details, see the [full documentation](./src/controllers/Filter.js).

## Single-select filters

A single-select filter is used to handle state for components that offer multiple filtering options but only allow one option to be enabled at any one time. For example: a drop-down box or group of radio buttons.

```javascript
const categories = new Filter(
  {
    // Options: Name -> Filter
    "all":      "",
    "blog":     "dir1='blog'",     // limit to results with dir1='blog'
    "articles": "dir1='articles'"  // limit to results with dir1='articles'
  },
  // The default option.
  "all"
);
```

Each filter is given a name (in this example: `all`, `blog`, `articles`) which can then be used to bind them to UI components:

```javascript
import { RadioFacet } from "sajari-react/ui/facets";

<div>
  <h3>Categories</h3>
  <RadioFacet filter={categories} name="all" /><label>All</label>
  <RadioFacet filter={categories} name="blog" /><label>Blog</label>
  <RadioFacet filter={categories} name="articles" /><label>Articles</label>
</div>
```

Or a drop-down select box:

```javascript
import { SelectFacet } from "sajari-react/ui/facets";

<SelectFacet
  filter={categories}
  options={{
    // Options: Name -> Display Name
    all: "All",
    blog: "Blog",
    articles: "Articles"
  }}
/>
```

To include the filter in a search it needs to be attached to the `Values` instance used by `Pipeline`:

```javascript
// Add the filter to the values instance.
values.set({ filter: () => categories.filter() }); 

// Trigger a search every time the filter seletion changes.
categories.listen(() => pipeline.search(values, tracking));
```

## Multi-select filters

A multi-select filter is used to represent state for UI components that can have multiple options selected at once, i.e. a list of check boxes or a multi-select list.

```javascript
const categories = new Filter(
  {
    // Options: Name -> Filter
    "blog":     "dir1='blog'",     // limit to dir1='blog'
    "articles": "dir1='articles'", // limit to dir1='articles'
    "other":    "dir1!='blog' AND dir1!='articles'", // everything else
  },
  // The default filters to be enabled
  ["blog", "articles"], // default filter will be "dir1='blog' OR dir1='articles'"
  true, // Allow multiple selections
);
```

This can be hooked up to a list of checkboxes:

```javascript
import { CheckboxFacet } from "sajari-react/ui/facets";

<div>
  <h3>Categories</h3>
  <CheckboxFacet filter={categories} name="blog" /><label>Blog</label>
  <CheckboxFacet filter={categories} name="articles" /><label>Articles</label>
  <CheckboxFacet filter={categories} name="other" /><label>Other</label>
</div>
```

The default operator used to combine selected filters is `OR`, but this can be overriden by the last argument in the `Filter` construtor.  See the full class docs for more details.

To include the filter in a search it needs to be attached to the `Values` instance used by `Pipeline`:

```javascript
// Add the filter to the values instance.
values.set({ filter: () => categories.filter() }); 

// Trigger a search every time the filter seletion changes.
categories.listen(() => pipeline.search(values, tracking));
```

## Tidying up filter listeners

The `listen` method returns a closure that will unrgister itself:

```javascript
const unregister = filter.listen(() => {
  console.log("filter changed:", filter.get());
});

// sometime later...
unregister();
```

## Combining multiple filters

To combine multiple `Filter` instances into one, use the `CombineFilters` function.

```javascript
// Define recency filter
const recencyFilter = new Filter(...);

// Define category Filter
const categoryFilter = new Filter(...);

// Combine both recency and category filters.
const filter = CombineFilters([recencyFilter, categoryFilter])

// When either recencyFilter or categoryFilter is updated, they trigger
// an event on the combined filter.
const unregister = filter.listen(() => {
  pipeline.search(values, tracking);
});

// sometime later...
unregister();
```

## License

We use the [MIT license](./LICENSE)

## Browser Support

The browser support is dependent on the React library, which currently supports recent versions of Chrome, Firefox, Sajari, Opera, and IE9+. (17/8/2016)
