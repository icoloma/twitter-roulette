# Twitter roulette

We expected this to exist somewhere else, but it didn't. So we did it.

This page will require a Twitter API key and search term, and it will perform a random search. Useful for IT events and such. Developed in 48h, battle-tested at Codemotion Spain. 

The Twitter API does not serve proper CORS headers, so it doesn't support pure JavaScript JSON requests. In order to do this without a server, we had to package it as a Chrome Extension.

## Quick start

```bash
git clone https://github.com/icoloma/twitter-roulette.git
cd twitter-roulette
sudo npm install -g gulp 
npm install
gulp
```
After that, you just have to execute gulp to get the page running.
