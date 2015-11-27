# Twitter roulette

We expected this to exist somewhere else, but it didn't. So we did it.

This Chrome extension will pick a random tweet based on your search criteria, useful for IT events and promotions. It requires a Twitter API key. Developed in 48h, battle-tested at Codemotion Spain.

The Twitter API does not serve proper CORS headers, so in order to do this without a server, it had to be packaged as a Chrome Extension.

This extension is available <a href="https://chrome.google.com/webstore/detail/jidffkpleipkoohdmdjabocmehcemifm">at the Chrome Store</a>.

## Quick start

```bash
git clone https://github.com/icoloma/twitter-roulette.git
cd twitter-roulette
# sudo npm install -g gulp 
npm install
gulp
```
After that, you just have to execute gulp to get the page running.
