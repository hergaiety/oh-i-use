Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

let defaultWordThemes = ['candy', 'coffee', 'speed', 'liquor', 'facial hair'];
let defaultHowManyWords = 3;

let suffixes = ['', 'JS', 'Script', '.js', '.io', 'DB'];

let stackPhrases = {
  intros: [
    'My prefered tech stack is a',
    'I feel the best way to build ambitious apps is with a',
    'An ideal stack would be a',
    'I start off with a'
  ],
  toolVarieties: [
    '',
    'engine',
    'generator',
    'framework',
    'setup',
    'frontend',
    'backend',
    'library',
    'plugin'
  ],
  toolConnections: [
    'powered by a',
    'controlling a',
    'alongside a',
    'integrated with a',
    'plugged into a',
    'synced to a'
  ],
  outros: [
    'to build ambitious web apps.',
    'to innovate to the best of my ability.',
    'to inspire the Open Source community of makers.'
  ]
};

let app = new Vue({
  el: '#app',
  data: {
    loading: true,
    stack: '',
    defaultWordThemes,
    wordThemes: defaultWordThemes,
    howManyWords: defaultHowManyWords
  },
  computed: {
    stackMarkdown() {
      return marked(this.stack, { sanitize: true });
    },
    validSettings() {
      return this.wordThemes.length && this.howManyWords > 0;
    }
  },
  methods: {
    newStack() {
      ga('send', 'event', 'UI', 'button', 'Generate Stack');
      this.loading = true;
      this.stack = generateStack()
        .then(stack => {
          this.loading = false;
          this.stack = stack;
        })
        .catch(e => {
          this.loading = false;
          this.stack = 'Uhoh! There was a problem generating a silly tech stack. Most likely we have hit our API limit for the month. Hang in there!';
        });
    }
  }
});

app.newStack(); // Fire off a new stack request on load

function generateStack() {
  return Promise.all(app.wordThemes.map(w => getWordsRelatedTo(w)))
    .then(data => {
      data = data.map(d => d.hasTypes);
      return [].concat.apply([], data);
    })
    .then(wordsToStack);
}

function getWordsRelatedTo(word) {
  return fetch('https://wt-sharpshark28-gmail_com-0.run.webtask.io/oh-i-use-backend?word=' + word)
    .then(r => r.json());
}

function wordsToStack(allWords) {
  let stack = stackPhrases.intros.random();

  for (let i = 1; i <= app.howManyWords; i++) {
    let techWord = wordToTechTerm(allWords.random());
    let variety = stackPhrases.toolVarieties.random();
    let connection = stackPhrases.toolConnections.random();
    let outro = stackPhrases.outros.random();
    let end = i < app.howManyWords ? connection : outro;
    stack += ` **${techWord}** ${variety} ${end}`;
  }

  return stack;
}

function wordToTechTerm(word) {
  word = word.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize each word
  return word.join('') + suffixes.random();
}
