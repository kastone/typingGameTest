// const quotes = ['It does not do well to dwell on dreams and forget to live. Albus Dumbledore',
//                 'Yer a wizard Harry. Rubeus Hagrid',
//                 'Ah, music,’ he said, wiping his eyes. ‘A magic beyond all we do here! Albus Dumbledore',
//                 'Fear of a name only increases fear of the thing itself. Hermione Granger',
//                'It is our choices, Harry, that show what we truly are, far more than our abilities. Albus Dumbledore',
//                'Dobby is free. Dobby',
//                'Don’t let the muggles get you down. Ron Weasley'];

const quotes = getQuotes();
console.log("quote is ", quotes);

const scores = [
    {name: "awesome opposum", milliseconds: 2000}
]




const quote = document.getElementById("quote");
const input = document.getElementById("typed-value");
const start = document.getElementById("start");
const message = document.getElementById("message");
const gamerName = document.getElementById("gamer-name");
const scoresUnorderedList = document.getElementById("scores-unordered-list");

let wordQueue;
let highlightPosition;
let startTime;

function startGame(){
  console.log("Game started!");
  console.log(quotes);

  const scoreItem = {name: gamerName.value, milliseconds: 0};
  scores.push(scoreItem);
  console.log("The scores array is now", scores);
  
  document.body.className = "";
  start.className = "started";
  
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quoteText = quotes[quoteIndex];
  console.log(quoteText);
  
  wordQueue = removeSpecialChars(quoteText).split(' ');
  
  console.log(wordQueue);
  
  quote.innerHTML = wordQueue.map(word =>(`<span>${word}</span>`)).join('');
  highlightPosition = 0;
  quote.childNodes[highlightPosition].className = "highlight";
  
  startTime = new Date().getTime();
  
  document.body.className = "";
  start.className = "started";
  setTimeout(() => {start.className = "button";}, 2000);
}

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function checkInput(){
  const currentWord = wordQueue[0].replaceAll(".", "").replaceAll(",", "").replaceAll("'", "");
  const typedValue = input.value.trim();
  
  if(currentWord !== typedValue) {
    input.className = currentWord.startsWith(typedValue) ? "" : "error";
    return;
  }
  wordQueue.shift();
  input.value="";
  
  if (wordQueue.length === 0)
  {
    gameOver();
    return;
  }
  
  quote.childNodes[highlightPosition].className = "";
  highlightPosition++;
  quote.childNodes[highlightPosition].className = "highlight";
  

}

function gameOver() {
  const elapsedTime = new Date().getTime() - startTime;
  document.body.className = "winner";
  message.innerHTML = `<span class="congrats">Congratulations!</span><br/>
  You finished in ${elapsedTime / 1000} seconds.`;

  const lastScoreItem = scores.pop();
  lastScoreItem.milliseconds = elapsedTime;
  scores.push(lastScoreItem);
  console.log("the scores array at end of game is ", scores);
  saveScores();

  for (let score of getScores()) {
    const li = createElementForScore(score);
    console.log("li is "+ li);
    //clear out old list
    // while (scoresUnorderedList.firstChild){
    //     scoresUnorderedList.removeChild(scoresUnorderedList.firstChild);
    // }
    //rebuild list with new score
    scoresUnorderedList.appendChild(li);
}

}

start.addEventListener("click", startGame);
input.addEventListener("input", checkInput);

async function getQuotes() {
    const response = await fetch("http://goquotes-api.herokuapp.com/api/v1/random?count=5");
    let quoteData = await response.json();
    
    console.log("Quote Data from api is", quoteData);
    return JSON.parse(quoteData);
}

function getScores(){
    const noScoresFound = "[]";
    const scoresJSON = localStorage.getItem('scores') || noScoresFound;
    console.log("scores from local storage", scoresJSON);
    return JSON.parse(scoresJSON);
}

function saveScores(){
    const data = JSON.stringify(scores);
    localStorage.setItem('scores', data);
    //pipe dream - challenge build an api and save - fetch scores from it.
}

function createElementForScore(score){
    const template = document.getElementById("score-item-template");
    const newListItem = template.content.cloneNode(true);

    const text = newListItem.querySelector(".score-text");
    text.innerHTML = score.name + " in " + score.milliseconds/1000 + " seconds.";
    console.log("newListItem is " + newListItem);
    return newListItem;

}