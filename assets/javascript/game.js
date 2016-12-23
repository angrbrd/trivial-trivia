// ----- Game Variables ----- //

// Total number of trivia questions
var numQuestions = 5;

// The list of all the game questions
var allQuestions;

// The list of all the game answers
var allAnswers;

// The question the user is currently on
var userQuestion = 0;

// The number of questions the user has gotten right
var questionsRight = 0;

// The number of seconds given to answer a question
var secondsGiven = 30;

// The number of seconds left on the timer
var secondsLeft;

// The variable that holds the reference to the countdown timer
var timer;

// Variable that keeps track of answers being double clicked
var clicked = false;

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
  $("#timer").html("Time remaining: " + secondsLeft);

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
    $("#questionNumber").html("Question " + (userQuestion+1) + " out of " + allAnswers.length).show();

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
  // Update the display
  $("#gameImage").attr("src", "./assets/images/fail" + userQuestion + ".gif");
  $("#gameImage").show();

  $(".panelResult").removeClass("resultSuccess").addClass("resultFail");
  if (secondsLeft === 0) {
    $("#result").html("Time is up! The correct answer is " + allAnswers[userQuestion]);
  } else {
    $("#result").html("Womp womp... the correct answer is " + allAnswers[userQuestion]);
  }
  $(".panelResult").show();

  // Advance to the next question after a few seconds
  if (userQuestion < numQuestions-1) {
    setTimeout(nextQuestion, 5000);
  } else {
  // The game is over, ask the user if they would like to play again
    setTimeout(playAgain, 3000);
  }
}

// A function that displays the answer when the user guesses correctly
function displayWeee() {
  // Record the correct answer
  questionsRight++;
  
  // Update the display
  $("#gameImage").attr("src", "./assets/images/success" + userQuestion + ".gif");
  $("#gameImage").show();

  $(".panelResult").removeClass("resultFail").addClass("resultSuccess");
  $("#result").html("Weee! That's right! The answer is " + allAnswers[userQuestion]);
  $(".panelResult").show();

  // Advance to the next question after a few seconds
  if (userQuestion < numQuestions-1) {
    setTimeout(nextQuestion, 5000);
  } else {
  // The game is over, ask the user if they would like to play again
    setTimeout(playAgain, 3000);
  }
}

// A function that advances the game to the next question
function nextQuestion() {
    $("#gameImage").attr("src", "./assets/images/question_mark.png");
    $(".panelResult").hide();

    userQuestion++;
    updateQuestion();

    $("#timer").html("Time remaining: " + secondsGiven);
    secondsLeft = secondsGiven;
    startTimer();
    clicked = false;
}

// A function that displays the "Play Again" button
function playAgain() {
  $(".panelResult").hide();

  $(".panelReset").html("<h2>You answered " + questionsRight + " question correctly. Click here to play again!</h2>");
  $(".panelReset").show();
}

// ----- Main Game Routine ----- //

$(document).ready(function() {

  // Display only the "Start" button on document load
  $("#questionAnswers").hide();
  $("#gifyContainer").hide();
  $("#timer").hide();
  $("#questionNumber").hide();

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
    $(".panelReset").hide();
    $(".startButton").hide();
    $("#instructions").hide();

    // Display the first question
    updateQuestion();
    $("#questionAnswers").show();

    // Start the countdown timer
    $("#timer").html("Time remaining: " + secondsGiven);
    $("#timer").show();
    secondsLeft = secondsGiven;
    startTimer();
  });

  // Whenever one of the answer choices is selected, record the value
  $(".panelAnswer").on("click", function() {
    if (clicked === false) {
      clicked = true;
      $("#gameImage").hide();
      
      console.log($(this).children(".option").html() + " is selected");

      var userGuess = $(this).children(".option").text().trim();
      var answer = allAnswers[userQuestion].trim();

      if (userGuess === answer) {
        console.log("User guessed correctly!");

        stopTimer();
        displayWeee();
      } else {
        console.log("User guessed incorrectly");

        stopTimer();
        displayWompWomp();
      }
    }
  });

  // Whenever the reset button is clicked, the game is reset to the beginning
  $(".panelReset").on("click", function() {
    // Reset the game statistics
    userQuestion = 0;
    questionsRight = 0;
    clicked = false;

    // Update the display to show only the "Start" button
    $("#gameImage").attr("src", "./assets/images/question_mark.png");
    $("#questionAnswers").hide();
    $("#gifyContainer").hide();
    $("#timer").hide();
    $("#questionNumber").hide();
    $("#instructions").show();
    $(".startButton").show();
  });

}); // main game routine