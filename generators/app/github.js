var url = require('url');
var api = require('github');

var options = {
  version: '3.0.0'
};

var proxy = process.env.http_proxy ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.HTTPS_PROXY ||
  null;

if (proxy) {
  var proxyUrl = url.parse(proxy);

  options.proxy = {
    host: proxyUrl.hostname,
    port: proxyUrl.port
  };
}

var github = new api(options);

if (process.env.GITHUB_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
}

module.exports = function(username, cb, log) {
  github.user.getFrom(
    { user: username }, 
    function (error, user) {
      if (error) {
        log.error('Cannot fetch your github profile. Make sure you\'ve typed it correctly.');
        
        user = {
          name: '',
          email: '',
          html_url: '',
        };
      }
  
      cb(JSON.parse(JSON.stringify(user)));
    }
  );
};