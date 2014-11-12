(function($) {

  'use strict';

  chrome.storage.sync.get({
    'api-key': '',
    'api-secret': '',
    'access-token': '',
    'access-token-secret': ''
  }, function(credentials) {
    for (var i in credentials) {
      if ( credentials.hasOwnProperty( i ) ) {
        $('.' + i).val(credentials[i]);
      }
    }
  });

  $('.options-form').on('submit', function(e) {
    e.preventDefault();
    chrome.storage.sync.set({
      'api-key': $('.api-key').val(),
      'api-secret': $('.api-secret').val(),
      'access-token': $('.access-token').val(),
      'access-token-secret': $('.access-token-secret').val()
    }, function() {
      $('.output-message').html('<span class="icon-ok"></span> Settings saved successfully.');
    });
  })

})(jQuery);