'use latest';
require('isomorphic-fetch');

module.exports = function(ctx, done) {
  if (!ctx.data.word) {
    done(null, 'Please supply a word');
    return;
  }

  fetch(`https://wordsapiv1.p.mashape.com/words/${ctx.data.word}/hasTypes`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accepts': 'application/json',
        'X-Mashape-Key': 'C7TVYyPI9Fmsh61STvYMLm8opXXgp1JB6NOjsn3Tdw5PRqjaTj'
      }
    })
    .then(r => r.json())
    .then(r => done(null, r)) // Return content to the user
    .catch(e => done(null, e.error));
};
