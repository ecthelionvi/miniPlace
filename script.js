const questionContainer = document.getElementById('question-container');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const resultContainer = document.getElementById('result-container');
const loadingSpinner = document.getElementById('loading-spinner');

let questions = [];
let answers = [];

// Function to send a request to the ChatGPT API
async function sendRequest(prompt) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Function to start a new game
async function startNewGame() {
  questions = [];
  answers = [];

  const initialPrompt = 'Let\'s play 20 Questions! I will think of an object, and you can ask me up to 20 yes-or-no questions to guess what it is.';
  const question = await sendRequest(initialPrompt);
  questionContainer.textContent = question;
}

// Function to handle user's answer and get the next question
async function handleAnswer(answer) {
  answers.push(answer);
  const prompt = `Previous questions and answers:\n${questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}\n\nNext question:`;

  // Show the loading spinner
  loadingSpinner.classList.remove('hidden');

  const nextQuestion = await sendRequest(prompt);

  // Hide the loading spinner
  loadingSpinner.classList.add('hidden');

  if (questions.length < 20) {
    questions.push(nextQuestion);
    questionContainer.textContent = nextQuestion;
  } else {
    const guessPrompt = `Based on the following questions and answers:\n${questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}\n\nWhat is your best guess for the object I was thinking of?`;

    // Show the loading spinner
    loadingSpinner.classList.remove('hidden');

    const guess = await sendRequest(guessPrompt);

    // Hide the loading spinner
    loadingSpinner.classList.add('hidden');

    resultContainer.textContent = `I guess the object is: ${guess}`;
  }
}

// Event listeners for answer buttons
yesButton.addEventListener('click', () => handleAnswer('Yes'));
noButton.addEventListener('click', () => handleAnswer('No'));

// Start a new game when the page loads
startNewGame();
