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

// A function that determines if two arrays of the same length are equal
function arraysEqual(arrA, arrB) {
  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

// The Game object
function Game(list) {
  // Store the list of all cat breeds
  this.allBreedsList = list;

  // Total number of user wins, initially zero
  this.totalWins = 0;

  // Total number of user losses, initially zero
  this.totalLosses = 0;

  // Set up a new game
  this.setupNewGame = function() {
    // Select a random cat breed from the list
    var randomNum = getRandomIntInclusive(0, list.length - 1);
    this.breed = this.allBreedsList[randomNum].toLowerCase();

    // Create a list of characters for the breed string
    this.breedList = this.breed.split('');

    // Create the letters guessed list, initially containing dashes
    var guessList = [];
    var lettersTotal = 0;
    for (var i = 0; i < this.breedList.length; i++) {
      if (this.breedList[i] !== " ") { // if letter, put dash
        guessList.push("_");
        lettersTotal ++; // keep track of how many letters the breed has
      } else { // if space, put " "
        guessList.push(" ");
      }
    }
    this.guessList = guessList;

    // Set the number of guesses to twice the number of letters
    this.numGuesses = lettersTotal * 2;

    // Set the original list of letters guessed to empty
    this.lettersGuessed = [];

    // Trigger to start a new game
    this.gameOver = false;

    // Reset the display for a new game
    this.printStats();
  }

  // Update the user guess list with the incoming letter
  this.updateGuess = function(letter) {
    // Variable keeping track of whether or not a letter appears in the word
    var inWord = false;

    // Check if the given letter has already been guessed
    if (this.lettersGuessed.indexOf(letter) !== -1) {
      // Letter has already been guessed, do nothing
      console.log("Letter has alredy been guessed!");
      return
    } else {
      // Letter has not been guessed
      this.lettersGuessed.push(letter);

      // Check if the letter appears in the word
      for (var i = 0; i < this.breedList.length; i++) {
        if (this.breedList[i] === letter) { // if it matches, record it
            this.guessList[i] = letter;
            inWord = true;
        }
      }

      // Letter is not in the word, decrement the number of guesses
      if (!inWord) {
        this.numGuesses --;
      }
    }
  }

  // Format a given list in order to display it nicely in HTML
  this.printList = function(list) {
    var myList = "";

    for (var i = 0; i < list.length; i++) {
      if (list[i] !== " ") { // if not a space, insert the character
        myList += list[i];
        myList += " "; // add space so several _ characters do not look like a line
      } else { // if space, put | to separate the words
        myList += "| ";
      }
    }

    return myList
  }

  // Print the game stats such as letters guessed and win/loss numbers
  this.printStats = function() {
    $("#userGuess").html(this.printList(this.guessList));
    $("#lettersGuessed").html(this.printList(this.lettersGuessed));
    $("#triesLeft").html(this.numGuesses);
    $("#totalWins").html(this.totalWins);
    $("#totalLosses").html(this.totalLosses);
  }

  // Check if the user has won or lost
  this.checkWin = function() {
    if (arraysEqual(this.guessList, this.breedList) && (this.numGuesses >= 0)) {
      // User has won the game
      $("#userWinMessage").html("<strong>You have guessed " + this.guessList.join('') + " correctly!<strong>");
      this.totalWins ++;
      this.gameOver = true;
    } else if (!arraysEqual(this.guessList, this.breedList) && (this.numGuesses <= 0)) {
      // User has lost the game
      $("#userLossMessage").html("<strong>You did not guess " + this.breedList.join('') + "!<strong>");
      this.totalLosses ++;
      this.gameOver = true;
    } else {
      // Game continues
      console.log("User is still in the game...");
    }
  }
}

// Run Javascript when the HTML has finished loading
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
  var allQuestions = loadWordList(questionsFile);
  var allAnswers = loadWordList(answersFile);

  // Total number of trivia questions known in advance
  var numQuestions = 3;

  // Print all the questions and answers
  var i, j;
  var questionString = '';
  var option_1 = '';
  var option_2 = '';
  var option_3 = '';
  var option_4 = '';

  for (i = 0; i < numQuestions; i++) {
    j = 5*i;
    questionString = allQuestions[j];
    option_1 = allQuestions[j+1];
    option_2 = allQuestions[j+2];
    option_3 = allQuestions[j+3];
    option_4 = allQuestions[j+4];

    console.log("Question: " + questionString);
    console.log("Answer Options: \n" + option_1 + "\n" + option_2 + "\n" + option_3 + "\n" + option_4);
    console.log("Answer is: " + allAnswers[i]);
  }

  // Begin the game when the "Start" button is pressed
  $(".startButton").on("click", function () {
    console.log("Start button clicked!");

    // Show the question and answer panel and hide the "Start" button
    $("#questionAnswers").show();
    $("#gifyContainer").show();
    $(".panelResult").hide();
    $(".startButton").hide();
    $("#instructions").hide();
    $("#timer").show();
  });

  // Whenever one of the answer choices is selected, record the value
  $(".panelAnswer").on("click", function() {
    console.log($(this).children(".option").html());
  })

}); // main routine