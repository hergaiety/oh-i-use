#!/usr/bin/env node
'use strict';

const prompts = require('prompts');
const fetch = require('node-fetch');
let suppliedWordList = process.argv[2];

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}
 
const getWord = async () => {
  let response = await prompts({
    type: 'list',
    name: 'words',
    message: 'What word would you like to base this stack on?'
  });
  return response.words;
};

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

function getWordsRelatedTo(word) {
  return fetch('https://wt-sharpshark28-gmail_com-0.run.webtask.io/oh-i-use-backend?word=' + word)
    .then(r => r.json());
}

async function generateStack(words) {
  return Promise.all(words.map(w => getWordsRelatedTo(w)))
    .then(data => {
      data = data.map(d => d.hasTypes);
      return [].concat.apply([], data);
    })
    .then(wordsToStack);
}

function wordsToStack(allWords) {
  let stack = stackPhrases.intros.random();

  let loopTimes = 3;
  for (let i = 1; i <= loopTimes; i++) { // Add in dynamic loop length for length of stack
    let techWord = wordToTechTerm(allWords.random());
    let variety = stackPhrases.toolVarieties.random();
    let connection = stackPhrases.toolConnections.random();
    let outro = stackPhrases.outros.random();
    let end = i < loopTimes ? connection : outro;
    stack += ` **${techWord}** ${variety} ${end}`;
  }

  return stack;
}

function wordToTechTerm(word) {
  word = word.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize each word
  return word.join('') + suffixes.random();
}

const init = async () => {
  console.log('Welcome');

  suppliedWordList = suppliedWordList ? suppliedWordList.split(',') : await getWord();

  console.log('Chosen word list', suppliedWordList);

  let result = await generateStack(suppliedWordList);
  console.log('Result: ', result);
};

init();

