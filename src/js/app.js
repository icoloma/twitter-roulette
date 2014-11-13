(function($) {

  // for the documentation about how to use OAuth, go to https://github.com/ddo/oauth-1.0a
  // and search for the jQuery example with OAuth headers

  'use strict';

  var _ = require('lodash')
  , OAuth   = require('oauth-1.0a')
  , template = require('./template').template
  , moment = require('moment')
  , credentials
  , oauth
  , token
  , tweetCount
  , MAX_TWEETS = 10000

  ,  scrollTo = function($element) {
    if ($element.length) {
      $('html, body').stop().animate({
        'scrollTop': Math.max(0, $element.offset().top - (200 + $element.outerHeight() / 2))
      }, 1000, function() {
        $('.tweets').addClass('showtime');
    
      });
    }
  }

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

      // Twitter will return up to 5 - 7 days or 1,500 tweets, whichever comes first
      // on the last page, next_results is undefined
      tweetCount += response.statuses.length
      if (tweetCount < MAX_TWEETS && response.search_metadata.next_results) {
        retrieveTweets(response.search_metadata.next_results)
      } else {
        $('.overlay').addClass('collapsed');
        $('.tweets').addClass('overlay-collapsed');
        $('.showtime-button').toggleClass('hide', !tweetCount);

        $('.results').html(
          !tweetCount? '<span class="icon-frown"></span> No tweets found' : 
            (tweetCount + ' tweets found')
        );

        var tmpl = template($('.tweet-template').html())
        , html = response.statuses.map(function(tweet) {
            return tmpl(_.extend({
              humanizedTime: moment().fromNow()
            }, tweet))
          }).join('')
        $('.tweets').html(html);
      }
      
    }).fail(function(request, error, message) {
      var message = (request && request.responseJSON && request.responseJSON.errors && request.responseJSON.errors.length && request.responseJSON.errors[0].message) || message || 'Undefined error';
      $('.tweets').html('<p data-alert class="alert-box alert">Error message from Twitter: ' + message);
      console.log(e);
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

    $('.showtime-button').toggleClass('hide', !tweetCount);
    $('.showtime').removeClass('showtime');

    // reset the tweet counter
    tweetCount = 0;

    // save the query into localStorage
    var query = $('.query').val();
    localStorage.setItem('query', query);
    query +=
        ($('.include-retweets').prop('checked')? '' : ' -filter:retweets') +
        ($('.include-replies').prop('checked')? '' : ' -filter:replies')
        ;

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
    retrieveTweets('?q=' + encodeURIComponent(query) + '&count=100');

  });

  $(document).on('click', '.showtime-button', function(e) {
    var $tweets = $('.tweet')
    , $randomTweet = $($tweets[~~ ($tweets.length * Math.random())])

    e.preventDefault();
    $('.tweet.selected').removeClass('selected');
    $('.tweets').removeClass('showtime');
    scrollTo($randomTweet.addClass('selected'))
  })

})(jQuery)