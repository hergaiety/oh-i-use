Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

let wordThemes = ['candy', 'beer', 'coffee', 'car', 'liquor', 'mustache'];
let suffixes = ['', 'JS', 'Script', '.js', '.io', 'DB'];
let wordsToUse = 3;

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
    stack: ''
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

// Fire off a new stack request on load
app.newStack();

function generateStack() {
  return Promise.all(wordThemes.map(w => getWordsRelatedTo(w)))
    .then(data => data.reduce((prev, cur) => [].concat(prev.length ? prev : [], cur.hasTypes)))
    .then(wordsToStack);
}

function getWordsRelatedTo(word) {
  return fetch('https://wt-sharpshark28-gmail_com-0.run.webtask.io/oh-i-use-backend?word=' + word)
    .then(r => r.json());
}

function wordsToStack(allWords) {
  let stack = stackPhrases.intros.random();

  for (let i = 1; i <= wordsToUse; i++) {
    let techWord = wordToTechTerm(allWords.random());
    let variety = stackPhrases.toolVarieties.random();
    let connection = stackPhrases.toolConnections.random();
    let outro = stackPhrases.outros.random();
    let end = i < wordsToUse ? connection : outro;
    stack += ` ${techWord} ${variety} ${end}`;
  }

  return stack;
}

function wordToTechTerm(word) {
  word = word.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize each word
  return word.join('') + suffixes.random();
}
