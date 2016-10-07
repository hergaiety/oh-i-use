'use strict';

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

var defaultWordThemes = ['candy', 'coffee', 'speed', 'liquor', 'facial hair'];
var defaultHowManyWords = 3;

var suffixes = ['', 'JS', 'Script', '.js', '.io', 'DB'];

var stackPhrases = {
  intros: ['My prefered tech stack is a', 'I feel the best way to build ambitious apps is with a', 'An ideal stack would be a', 'I start off with a'],
  toolVarieties: ['', 'engine', 'generator', 'framework', 'setup', 'frontend', 'backend', 'library', 'plugin'],
  toolConnections: ['powered by a', 'controlling a', 'alongside a', 'integrated with a', 'plugged into a', 'synced to a'],
  outros: ['to build ambitious web apps.', 'to innovate to the best of my ability.', 'to inspire the Open Source community of makers.']
};

var app = new Vue({
  el: '#app',
  data: {
    loading: true,
    stack: '',
    defaultWordThemes: defaultWordThemes,
    wordThemes: defaultWordThemes,
    howManyWords: defaultHowManyWords
  },
  computed: {
    stackMarkdown: function stackMarkdown() {
      return marked(this.stack, { sanitize: true });
    },
    validSettings: function validSettings() {
      return this.wordThemes.length && this.howManyWords > 0;
    }
  },
  methods: {
    newStack: function newStack() {
      var _this = this;

      ga('send', 'event', 'UI', 'button', 'Generate Stack');
      this.loading = true;
      this.stack = generateStack().then(function (stack) {
        _this.loading = false;
        _this.stack = stack;
      }).catch(function (e) {
        _this.loading = false;
        _this.stack = 'Uhoh! There was a problem generating a silly tech stack. Most likely we have hit our API limit for the month. Hang in there!';
      });
    }
  }
});

app.newStack(); // Fire off a new stack request on load

function generateStack() {
  return Promise.all(app.wordThemes.map(function (w) {
    return getWordsRelatedTo(w);
  })).then(function (data) {
    data = data.map(function (d) {
      return d.hasTypes;
    });
    return [].concat.apply([], data);
  }).then(wordsToStack);
}

function getWordsRelatedTo(word) {
  return fetch('https://wt-sharpshark28-gmail_com-0.run.webtask.io/oh-i-use-backend?word=' + word).then(function (r) {
    return r.json();
  });
}

function wordsToStack(allWords) {
  var stack = stackPhrases.intros.random();

  for (var i = 1; i <= app.howManyWords; i++) {
    var techWord = wordToTechTerm(allWords.random());
    var variety = stackPhrases.toolVarieties.random();
    var connection = stackPhrases.toolConnections.random();
    var outro = stackPhrases.outros.random();
    var end = i < app.howManyWords ? connection : outro;
    stack += ' **' + techWord + '** ' + variety + ' ' + end;
  }

  return stack;
}

function wordToTechTerm(word) {
  word = word.split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }); // Capitalize each word
  return word.join('') + suffixes.random();
}