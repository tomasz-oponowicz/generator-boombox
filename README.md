# generator-boombox

[![Build Status](https://travis-ci.org/tomasz-oponowicz/generator-boombox.svg?branch=master)](https://travis-ci.org/tomasz-oponowicz/generator-boombox)

Yeoman generator for a front-end component. 

## TL;DR

The generator focues on:

* document: `jsdoc`;
* test: `jsonlint`, `lesslint` _(upcoming)_,`jshint`, `jscs`, `jasmine`;
* transform: `browserify`, `less`, `jade`;
* optimize: `uglify`, `minify-css`, `minify-html`, `imagemin`, `sprity` _(upcoming)_;
* debug: `sourcempas`;

## Setup

Install the Boombox locally:

    git clone git@github.com:tomasz-oponowicz/generator-boombox.git
    cd generator-boombox
    npm link

## Usage

Create a new application using the Boombox:

    yo boombox [appName]

## License

MIT
