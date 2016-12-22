// ----- Game Variables ----- //

// Total number of trivia questions known in advance
var numQuestions = 3;

// The list of all the game questions
var allQuestions;

// The list of all the game answers
var allAnswers;

// The question the user is currently on
var userQuestion = 0;

// The number of questions the user has gotten right and wrong
var questionsRight = 0;
var questionsWrong = 0;

// The number of seconds given to answer a question
var secondsGiven = 10;

// The number of seconds left on the timer
var secondsLeft;

// The variable that holds the reference to the countdown timer
var timer;

// ----- Helper Functions ----- //

// A function that reads in the game data from a file
function loadWordList(file) {
  var dataArray;

  // Setting jQuery ajax setting to async:false in order to allow time for the file to load.
  // This seems pretty ugly, but is the only way I could figure out how to make this work.
  jQuery.ajaxSetup({async:false});

  // Read in the contents of the file using jQuery
  $.get(file, function(data) {
    // Parse the data into an array of stings
    dataArray = data.split("\n");
  }, 'text');

  // Setting jQuery ajax setting back to async:true, which is the default.
  jQuery.ajaxSetup({async:true}); 

  return dataArray
}

// A function that initializes the countdown timer
function startTimer() {
  timer = setInterval(decrementTimer, 1000);
}

// A function that decrements the countdown timer once per second and updates the display
function decrementTimer() {
  // Decrement the number of seconds left by one
  secondsLeft--;

  // Update the timer display
  $("#timer").html(secondsLeft);

  // When the timer runs out, show wrong guess
  if (secondsLeft === 0) {
    stopTimer();
    displayWompWomp();
  }
}

// A function that stops the countdown timer
function stopTimer() {
  clearInterval(timer);
}

// A function that updates the display to the given question number
function updateQuestion() {
    // Variable that helps to find the appropriate question inside the questions array
    var questionOffset = userQuestion * 5;

    var questionString = allQuestions[questionOffset];
    var option_1 = allQuestions[questionOffset + 1];
    var option_2 = allQuestions[questionOffset + 2];
    var option_3 = allQuestions[questionOffset + 3];
    var option_4 = allQuestions[questionOffset + 4];

    // Update the display
    $("#question").html(questionString);
    $("#option_1").html(option_1);
    $("#option_2").html(option_2);
    $("#option_3").html(option_3);
    $("#option_4").html(option_4);
}

// A function that displays the answer when the user runs out of time or guesses incorrectly
function displayWompWomp() {
  // Record the wrong answer
  questionsWrong++;

  // Update the display
  $("#gameImage").attr("src", "./assets/images/fail" + userQuestion + ".gif");
  $(".panelResult").addClass("resultFail");
  $("#result").html("Womp womp... the correct answer is " + allAnswers[userQuestion]);
  $(".panelResult").show();

  // Advance to the next question after a few seconds
  setTimeout(nextQuestion, 5000);
}

// A function that displays the answer when the user guesses correctly
function displayWeee() {
  // Record the correct answer
  questionsRight++;
  
  // Update the display
  $("#gameImage").attr("src", "./assets/images/success" + userQuestion + ".gif");
  $(".panelResult").addClass("resultSuccess");
  $("#result").html("Weee! That's right! The answer is " + allAnswers[userQuestion]);
  $(".panelResult").show();

  // Advance to the next question after a few seconds
  setTimeout(nextQuestion, 5000);
}

// A function that advances the game to the next question
function nextQuestion() {
  if (userQuestion < numQuestions-1) {
    $("#gameImage").hide();
    $(".panelResult").hide();

    userQuestion++;
    updateQuestion();

    $("#timer").html(secondsGiven);
    secondsLeft = secondsGiven;
    startTimer();
  } else {
    // The game is over, ask the user if they would like to play again
    console.log("Game over! Play again?");
  }
}

// ----- Main Game Routine ----- //

$(document).ready(function() {

  console.log("ENTER Javascript");

  // Display only the "Start" button on document load
  $("#questionAnswers").hide();
  $("#gifyContainer").hide();
  $("#timer").hide();

  // Specify the files containing the questions and answers
  var questionsFile = "./assets/questions.txt";
  var answersFile = "./assets/answers.txt";

  // Read in the questions and answers files into a variable
  allQuestions = loadWordList(questionsFile);
  allAnswers = loadWordList(answersFile);

  // Begin the game when the "Start" button is pressed
  $(".startButton").on("click", function () {
    console.log("Start button clicked!");

    // Update the display
    $("#gifyContainer").show();
    $(".panelResult").hide();
    $(".startButton").hide();
    $("#instructions").hide();

    // Display the first question
    updateQuestion();
    $("#questionAnswers").show();

    // Start the countdown timer
    $("#timer").html(secondsGiven);
    $("#timer").show();
    secondsLeft = secondsGiven;
    startTimer();
  });

  // Whenever one of the answer choices is selected, record the value
  $(".panelAnswer").on("click", function() {
    console.log($(this).children(".option").html());


  })

}); // main game routine