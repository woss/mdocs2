var $              = require('jquery');
var Auth0Lock      = require('auth0-lock');
var store          = require('store');
var logged_in_tmpl = require('../includes/logged_in.jade');
var anonymator     = require('./anonymator');
var spin = require('./spin');

var auth0_client_id = 'TnzEhJw9ADNWAICY3vRlb7sdj9pMWcQJ';

var widget = new Auth0Lock(
  auth0_client_id,
  'mdocs.auth0.com'
);

if (store.get('firepad_profile')) {
  login_fin(store.get('firepad_profile'));
}

var result = widget.parseHash(location.hash);
if (result) {
  var spinner = spin();

  widget.getProfile(result.id_token, function (err, profile) {
    if (err || !profile) return;

    profile.access_token = result.access_token;

    widget.getClient().getDelegationToken({
      target: auth0_client_id,
      id_token: result.id_token,
      api_type: 'firebase'
    }, function (err, delegationResult) {
      profile.firebase_token = delegationResult.id_token;
      store.set('firepad_profile', profile);
      login_fin(profile);
      spinner.stop();
    });
  });
}

function login_fin(profile) {
  $('#signed-in').html(logged_in_tmpl({
    profile: profile
  }));
  $('#sign-in').hide();
  if (!window.location.hash || window.location.hash.indexOf('#access_token') === 0) {
    var return_url = store.get('return_url_after_login');

    if (return_url) {
      store.remove('return_url_after_login');
      window.location = return_url;
      return;
    }

    window.location.hash = '#/docs';
  }
}

widget.on('signin ready', function() {
  $('.anonymous-login').remove();
  $('<a href="#" style="margin-top: 5px;" class="anonymous-login a0-btn-small">Login anonymously</a>')
    .appendTo('.a0-db-actions')
    .on('click', function (e) {
      e.preventDefault();

      var credentials = anonymator.createCredentials();

      widget.getClient().signup({
        scope: 'openid profile',
        connection: 'anonymous',
        username: credentials.username,
        password: credentials.password
      });

    });
});

function login() {
  widget.show({
    scope: 'openid profile',
    responseType: 'token',
    defaultUserPasswordConnection: 'mdocs.io'
  });
}

function logout () {
  $('#signed-in').hide();
  $('#sign-in').show();
  store.remove('firepad_profile');
  window.location.hash = '#/';
}

function login_on_connection (connection, docId) {
  store.set('return_url_after_login', '#/docs/' + docId);
  widget
    .getClient()
    .signin({
      connection: connection,
      response_type: 'token',
      scope: 'openid profile',
    });
}

module.exports = {
  login: login,
  logout: logout,
  login_on_connection: login_on_connection
};
