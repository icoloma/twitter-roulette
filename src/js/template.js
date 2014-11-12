// a CSP-compliant, eval-free implementation of template
var _ = require('lodash')
var template = function(message, data) {

  'use strict';

  var templateReplace = function(s, match) {
    // {{foo.bar.baz}}
    var result = data
    _.each(match.trim().split('.'), function(propertyName) {
      result = result[propertyName]
    })
    return result;
  }


  if (typeof data === 'undefined') {
    return _.partial(template, message);
  } else {
    return message
      .replace(/\{\{\{([^}]+)}}}/g, templateReplace)
      .replace(/\{\{([^}]+)}}/g, function(s, match) {
        return _.escape(templateReplace(s, match))
      })
  }
};

exports.template = template;