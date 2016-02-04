Portal Chrome Extension
==

This is a client for the Portal Messaging service. It leverages GCM and Google OAuth to connect 
register and sign into the Portal service.

## Overview

The Chrome client is built using an opinionated set of web frameworks:

- ES2015 with Babel polyfills
- React and Redux, an implementation of the Flux architecture
- Facebook's Immutable.js for object transforms
- Airbnb's Javascript style/linting
- Webpack to bundle all dependencies together
- Google Material Design Lite components
- Sass for stylesheets

## Use

To set up the Chrome extension locally, do the following. There is a 83% chance it won't work.

- `git clone ssh://git@code.portalmessaging.com:2222/clients/portal-chrome.git`
- `cd portal-chrome`
- `npm i` (make sure you have npm installed globally)
- `npm run build`
- `cp app/main.js app/manifest.json app/index.html build/`
- Chrome -> Extensions -> Load Unpacked Extension -> portal-chrome/build

## TODO

- Possibly use Grunt/Gulp to pipe manifest.json and other Chrome extension files into build/
