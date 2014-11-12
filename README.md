# Twitter roulette

We expected this to exist somewhere else, but it didn't. So we did it.

This page will require a Twitter API key and search term, and it will perform a random search. Useful for IT events and such. Developed in one day, battle-tested at Codemotion Spain.

Give it a try: http://twitter-roulette.github.io

## Quick start

```bash
git clone https://github.com/icoloma/twitter-roulette.git
cd twitter-roulette
sudo npm install -g gulp node-inspector 
sudo gem install jekyll cairo tmuxinator   # or sudo gem update
npm install
```

After installing, execute in two separate shells

```bash
gulp
bin/jekyll
```

Alternatively, there is a tmuxinator config file:

```
mkdir -p ~/.tmuxinator
ln -s $(pwd)/roulette.yml ~/.tmuxinator
tmuxinator roulette
```
