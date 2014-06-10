function makeid(length, extra) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + (extra || '');

  for( var i=0; i < 30; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.createCredentials = function () {
  return {
    username: makeid() + '@example.org',
    password: makeid('!/?%^&')
  };
};