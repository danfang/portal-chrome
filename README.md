Portal Chrome Extension
==

[![Build Status](https://build.portalmessaging.com/api/badges/danfang/portal-chrome/status.svg)](https://build.portalmessaging.com/danfang/portal-chrome)

This is a client for the Portal Messaging service. It leverages GCM and Google OAuth to connect
register and sign into the Portal service.

## Overview

The Chrome client is built using an opinionated set of web frameworks:

Application

- ES2015 with Babel polyfills
- React and Redux, an implementation of the Flux architecture
- Airbnb's Javascript style/linting
- Webpack to bundle all dependencies together
- Google Material Design Lite components
- Sass for stylesheets

Testing

- Karma JS, PhantomJS as test runners
- Mocha, Chai, and Sinon for BDD testing
- fetchMock for web request mocking
- redux-mock-store and react-addons-test-utils for testing React components

## Use

- Clone this repository
- `cd portal-chrome`
- `npm i`
- `npm run build`
- Chrome -> Extensions -> Load Unpacked Extension -> portal-chrome/build

## TODO

- Possibly use Grunt/Gulp to pipe manifest.json and other Chrome extension files into build/
