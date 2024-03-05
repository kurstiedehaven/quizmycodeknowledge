// Questions to ask the user
const questions = [
    {
        question: 'Which data type must always be enclosed in quotations?',
        options: ['A. String', 'B. Number', 'C. Boolean', 'D. Undefined'],
        correct: 'A. String'
    },
    {
        question: 'Which method is used to round a number down in Javascript?',
        options: ['A. Math.random', 'B. Math.ceiling', 'C. Math.upDown', 'D. Math.floor'],
        correct: 'D. Math.floor'
    },
    {
        question: 'What does DOM stand for?',
        options: ['A. Dominant Object Method', 'B. Document Object Model', 'C. Distributed Object Model', 'D. Document Open Model'],
        correct: 'B. Document Object Model'
    },
    {
        question: 'Which method is used to retrieve data from local storage?',
        options: ['A. localStorage.setItem()', 'B. localStorage.pushItem()', 'C. localStorage.getItem()', 'D. localStorage.pullItem()'],
        correct: 'C. localStorage.getItem()'
    },
    {
        question: 'Which method selects all elements with the same class type?',
        options: ['A. document.getElementById()', 'B. document.getElementByClassName', 'C. document.getClasses', 'D. document.getElementClasses'],
        correct: 'B. document.getElementByClassName'
    },
    {
        question: 'What does JSON.stringify do?',
        options: ['A. Turns non-string data into a string', 'B. Pulls you into a black hole', 'C. Nothing', 'D. Fires you from your job'],
        correct: 'A. Turns non-string data into a string'
    },
    {
        question: 'What symbol is used for single-line comments in JavaScript?',
        options: ['A. ~', 'B. //', 'C. ---', 'D. &&'],
        correct: 'B. //'
    },
    {
        question: 'Which method is used to add a new element to an array?',
        options: ['A. append()', 'B. add()', 'C. push()', 'D. insert()'],
        correct: 'C. push()'
    },
    {
        question: 'What does the "typeof" operator return for null?',
        options: ['A. object', 'B. null', 'C. undefined', 'D. string'],
        correct: 'A. object'
    },
    {
        question: 'What is the output of 2 + "2" in JavaScript?',
        options: ['A. 22', 'B. 4', 'C. error', 'D. undefined'],
        correct: 'A. 22'
    }
];

// Global variables
const quizDiv = document.getElementById('quiz-title');
const quizHeader = document.getElementById('quiz-header');
const startButton = document.getElementById('start');
const questionElement = document.getElementById('question');
const optionElement = document.getElementById('option');
const scoreSpan = document.getElementById('score');
const timer = document.getElementById('timer');
const submitScore = document.getElementById('score-submit');
const leaderboardButton = document.getElementById('leader-board');
const playerInput = document.getElementById('player-input');
const playAgain = document.getElementById('play-again');

let currentQuestion = 0;
let score = 0;
let answers = [];
let countdownInterval;

const playGame = () => {
    // Function that loads questions onto the page based on questions object
    const loadQuestion = () => {
        const currentQ = questions[currentQuestion];
        questionElement.textContent = currentQ.question;
        optionElement.innerHTML = '';

        currentQ.options.forEach((option, index) => {
            const choice = document.createElement('button');
            choice.type = 'button';
            choice.className = 'btn';
            choice.textContent = option;
            choice.setAttribute('data-index', index);
            optionElement.appendChild(choice);
        });
    };

    // Function to start the countdown timer
    const startTimer = (seconds) => {
        timer.textContent = seconds;
        countdownInterval = setInterval(() => {
            timer.textContent = --seconds;
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                handleTimeout();
            }
        }, 1000);
    };

    // Function to handle when time runs out
    const handleTimeout = () => {
        quizHeader.textContent = 'Time\'s Up!';
        endGame();
    };

    // Function to handle the end of the game
    const endGame = () => {
        questionElement.style.display = 'none';
        optionElement.style.display = 'none';
        timer.style.display = 'none';
        submitScore.style.display = 'block';
        quizDiv.style.display = 'flex';
        startButton.style.display = 'none';
        playAgain.style.display = 'block';
        setScore();
    };

    // Function to set the player's score
    const setScore = () => {
        scoreSpan.textContent = `Your score is ${score}.`;
    };

    // Function to check the answer
    const checkAnswer = (selectedOption) => {
        const currentQ = questions[currentQuestion];
        const correctAnswer = currentQ.correct;

        // Extract the correct answer text without the option label
        const correctAnswerText = correctAnswer.split('. ')[1];

        // Retrieve the selected option text without the option label
        const selectedAnswerText = currentQ.options[selectedOption].split('. ')[1];

        console.log("Selected Answer:", selectedAnswerText);
        console.log("Correct Answer:", correctAnswerText);

        if (selectedAnswerText === correctAnswerText) {
            score += 10;
        } else {
            // Decrease time by 10 seconds for incorrect answer
            timer.textContent -= 10;
        }

        answers.push(selectedAnswerText);

        console.log("Score:", score);
    };
    ;
    // Event listeners for start button
    startButton.addEventListener('click', () => {
        quizDiv.style.display = 'none';
        loadQuestion();
        startTimer(60);
    });

    optionElement.addEventListener('click', (e) => {
        // Check if the clicked element is a button
        if (e.target.matches('button.btn')) {
            const selectedOption = e.target.getAttribute('data-index');
            checkAnswer(selectedOption);
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion();
            } else {
                endGame();
            }
        }
    });

    submitScore.addEventListener('click', () => {
        playerInput.style.display = 'inline-block';
        quizHeader.textContent = 'Enter Your Name To Save Your Score!';
        quizDiv.appendChild(playerInput);
        submitScore.style.display = 'none';
        leaderboardButton.style.display = 'inline-block';
        scoreSpan.style.display = 'none';
        const submissionMessage = document.createElement('span');
        submissionMessage.textContent = '';
        quizDiv.appendChild(submissionMessage);

        leaderboardButton.addEventListener('click', () => {
            const name = playerInput.value.trim();

            // Check if name are provided
            if (name && name.length <= 10) {
                // Create an object to store player's name and score
                const playerScore = {
                    name: name,
                    score: score
                };

                // Retrieve existing leaderboard data from local storage or initialize an empty array
                let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
                leaderboardData.push(playerScore);
                leaderboardData.sort((a, b) => b.score - a.score);
                localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
                playerInput.value = '';
                submissionMessage.textContent = 'Score submitted successfully!';
                submissionMessage.style.color = 'green';
                quizDiv.innerHTML = '';
                displayLeaderboard(leaderboardData);
            } else {
                submissionMessage.textContent = 'Please enter your name to submit your score.';
            }
        });
    });

    // Function to display the leaderboard
    const displayLeaderboard = (leaderboardData) => {
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.className = 'leaderboard-container';
        const leaderboardTitle = document.createElement('h3');
        leaderboardTitle.textContent = 'Leaderboard';

        leaderboardContainer.appendChild(leaderboardTitle);
        const leaderboardList = document.createElement('ol');
        for (let i = 0; i < Math.min(5, leaderboardData.length); i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `${leaderboardData[i].name}: ${leaderboardData[i].score}`;
            leaderboardList.appendChild(listItem);
        }
        // Append leaderboard list to container
        leaderboardContainer.appendChild(leaderboardList);
        // Append leaderboard container to quiz div
        quizDiv.appendChild(leaderboardContainer);
    };

    // Function to clearleaderboard data from local storage
    document.getElementById('clear-leaderboard').addEventListener('click', () => {
        localStorage.removeItem('leaderboard');
});


    // Function to replay game
    const resetGame = () => {
        location.reload();
    };

    playAgain.addEventListener('click', resetGame);
};

playGame();
