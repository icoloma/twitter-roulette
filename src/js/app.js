(function($) {

  // for the documentation about how to use OAuth, go to https://github.com/ddo/oauth-1.0a
  // and search for the jQuery example with OAuth headers

  'use strict';

  // go to the page
  // create your app
  // go to key and access tokens https://apps.twitter.com/app/7198719/keys
  // click "Create Token"

  var _ = require('lodash')
  , OAuth   = require('oauth-1.0a')
  , s = localStorage.getItem('credentials')
  , query = localStorage.getItem('query')
  , credentials = (s && JSON.parse(s)) || {
    'api-key': '',
    'api-secret': '',
    'access-token': '',
    'access-token-secret': ''
  }

  for (var i in credentials) {
    $('.' + i).val(credentials[i]);
  }
  $('.query').val(query);

  $('.roulette-form').on('submit', function(e) {
    e.preventDefault();
    for (var i in credentials) {
      credentials[i] = $('.' + i).val();
    }
    localStorage.setItem('credentials', JSON.stringify(credentials));
    localStorage.setItem('query', query);

    var oauth = OAuth({
      consumer: {
        public: credentials['api-key'], 
        secret: credentials['api-secret']
      },
      signature_method: 'HMAC-SHA1'
    }), token = {
      public: credentials['access-token'],
      secret: credentials['access-token-secret']
    }

    var request_data = {
          url: 'https://api.twitter.com/1.1/search/tweets.json?q=foobar&count=100',
          method: 'GET'
      };
    $.ajax({
      url: request_data.url,
      type: request_data.method,
      headers: oauth.toHeader(oauth.authorize(request_data, token))
    }).done(function(response) {
      console.log(response);
      var tweets = response.statuses.map(function(item) {
        return JSON.stringify(item);
      })

      // response.search_metadata.next_results
      
      $('#tweets').html(tweets.join(''))
    });
       
  });
  
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-2309405-13', 'auto');
  ga('send', 'pageview');

})(jQuery)