(function($) {

  // for the documentation about how to use OAuth, go to https://github.com/ddo/oauth-1.0a
  // and search for the jQuery example with OAuth headers

  'use strict';

  // go to the page
  // create your app
  // go to key and access tokens https://apps.twitter.com/app/7198719/keys
  // click "Create Token"
  var MAX_TWEETS = 200;

  var _ = require('lodash')
  , OAuth   = require('oauth-1.0a')
  , template = require('./template').template
  , moment = require('moment')
  , credentials
  , oauth
  , token
  , tweetCount

  , retrieveTweets = function(params) {
    $('.tweets-loading').html('Reading ' + (tweetCount + 100) + ' tweets...');
    var request_data = {
        url: 'https://api.twitter.com/1.1/search/tweets.json' + params,
        method: 'GET'
    };
    $.ajax({
      url: request_data.url,
      type: request_data.method,
      headers: oauth.toHeader(oauth.authorize(request_data, token))
    }).then(function(response) {
      console.log(response);
      var tweets = response.statuses.map(function(item) {
        return JSON.stringify(item);
      })

      tweetCount += response.statuses.length
      if (tweetCount < MAX_TWEETS && response.statuses.length) {
        retrieveTweets(response.search_metadata.next_results)
      } else {
        var tmpl = template($('.tweet-template').html())
        , html = !tweetCount? '<p><span class="icon-heart-broken"></span> No tweets found' : response.statuses.map(function(tweet) {
          return tmpl(_.extend({
            humanizedTime: moment().fromNow()
          }, tweet))
        }).join('');
        $('.tweets').html(html);
      }
      
    });

  }

  chrome.storage.sync.get({
    'api-key': '',
    'api-secret': '',
    'access-token': '',
    'access-token-secret': ''
  }, function(c) {
    credentials = c;
    for (var i in credentials) {
      if ( credentials.hasOwnProperty( i )  && !credentials[i]) {
        $('.contents').html(
          template('<h1>Configuration required</h1><p>You should fill in your Twitter credentials in the <a href="{{link}}">options page</a> before going further.', {
            link: chrome.extension.getURL("options.html")
          }
        ))
      }
    }
  });

  // set the values on the form
  $('.query').val(localStorage.getItem('query') || '');

  // intercept the submit event
  $('.roulette-form').on('submit', function(e) {
    e.preventDefault();

    // reset the tweet counter
    tweetCount = 0;

    // save the query into localStorage
    var query = $('.query').val();
    localStorage.setItem('query', query);

    // prepare credentials
    oauth = OAuth({
      consumer: {
        public: credentials['api-key'], 
        secret: credentials['api-secret']
      },
      signature_method: 'HMAC-SHA1'
    });
    token = {
      public: credentials['access-token'],
      secret: credentials['access-token-secret']
    };

    $('.tweets').html(
      '<div class="row">' +
        '<div class="columns small-2">' +
          '<div id="preloader_2"> <span></span> <span></span> <span></span> <span></span> </div>' +
        '</div>' +
        '<div class="columns small-10"><output class="tweets-loading"></output></div>' +
      '</div>'
    );
    retrieveTweets('?' + $.param({
      q: query,
      count: 100
    }))

  });

})(jQuery)