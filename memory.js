//The code is executed when everything is loaded on the html
$(document).ready(function() {

//Number of rounds a gamboard is played.
var totalTrials = 12;

//Object storing the player info.
var player = {  
  score: 0,
  level:1,
  numberHighlighted:3,
  trial:1
};

//Resets the player object to the baseline properties.
function resetPLayer(playerObj) {
  playerObj.score = 0;
  playerObj.level = 1;
  playerObj.numberHighlighted = 3;
  playerObj.trial = 1; 

  return playerObj;
}

//Increments the player objects properties. 
function incrementPlayer(playerObj) {
  playerObj.level++;
  playerObj.numberHighlighted++;
  //playerObj.trial++;

  return playerObj;
}

//This function takes a nested gameboard array of objects and returns a flat array.
function makeFlatArr(gameBoardArr) {
  var flatArr = [];
  
  //Iterating through the gameboard then using reduce to create a flat array of all the square objects.
  y.each(gameBoardArr,function(rowArr) {
    y.reduce(rowArr, function(memo,current) {
      flatArr.push(current); 
    }
    ,flatArr)
  });

  return flatArr;
}

//This function creates an array of unique random numbers between 0 and the number of squares on the gameBoard.
function makeRandomNumArr(amountofNumbers) {
  var uniqueNumArr = [];
  var randomNum;
  var numberOfSquares = gameBoard.length * gameBoard.length;

  while (uniqueNumArr.length < amountofNumbers) {

    //Generating a random number between 0 and the number of squares in the gameboard.
    randomNum = (Math.floor((Math.random() * numberOfSquares) + 0));
    
    //The random number is pushed to the array if it doesn't already exist in the array.
    if (uniqueNumArr.indexOf(randomNum) == -1) { 
      uniqueNumArr.push(randomNum);
    }
  } 
  return uniqueNumArr;
}

//This function changes all the squares back to the initial brown color.
function unhighlightBoard() {
 
  //Iterates through a flat gameboard array and changes all the squares brown.
  y.each(makeFlatArr(gameBoard), function(sqObj) {
    sqObj.color = memBrown;
  });

  //Rendering the changes to the screen.
  showBoard(gameBoard);
}

//This function takes an input of the number of squares to display and randomly highlights them on the gameboard.
function highlightSquares(numberOfSquares) {
   
  //This variable references an array of random numbers in the amount specified from the argument.
  var randomNumArr = makeRandomNumArr(numberOfSquares);
  var flatArr = makeFlatArr(gameBoard);
  player.numberHighlighted = numberOfSquares;  

  //Highlights the square object at the index corresponding to each number in the random number array.  
  y.map(randomNumArr, function(number) {
    flatArr[number].color = memBlue;
    flatArr[number].randomHighlight = true;
  });

  //Creating an array of only highlighted sqaure objects.
  var randomHighlightArr = y.filter(flatArr, function(sqObj) {
    return sqObj.randomHighlight === true;
  });  

}

/*This function shows all the squares that were highlighted by the game.
 *Used to show the player the correct highlighted squares display after guessing wrong.
 *TODO - Figure out a way to make this action more intuitive for the player.
 *Currently using a different sound when these squares are shown so the user doesn't confuse this display with a new level.
 */  
function showHighlighted() {
  unhighlightBoard();

  //Invoking on a delay to space out showing the highlighted squares .5s after the board is cleared.
  setTimeout(function() {

    //Iterate through the flat gameboard and highlight all the squares that have the randomHighlight property true.
    y.each(makeFlatArr(gameBoard), function(sqObj) {
      if ((sqObj.randomHighlight === true)) {
        $("#showSquares")[0].play();
        sqObj.color = memBlue;
      }

    //Rendering changes to the screen;  
    showBoard(gameBoard);
  })},500);
}

//This function takes creates the appropriate size gameBoard and highlighted squares from the values passed in through the player object. 
function gameBoardLevel(playerObj) {

  //This creates the appropriate board size for a given level.
  switch (playerObj.level) {
    case 0:
      gameBoard=makeBoard(2,2);
      break;

    case 1:
      gameBoard=makeBoard(3,3);
      break;    
   
    case 2:
      gameBoard=makeBoard(3,4);
      break;

    case 3:
      gameBoard=makeBoard(4,4);
      break;

    case 4:
      gameBoard=makeBoard(4,5);
      break; 

    case 5:
      gameBoard=makeBoard(5,5);
      break;

    case 6:
      gameBoard=makeBoard(5,6);
      break;

    case 7:
      gameBoard=makeBoard(6,6);
     break;

    case 8:
      gameBoard=makeBoard(6,7);
      break;

    case 9:
      gameBoard=makeBoard(7,7);
     break;

    case 10:
      gameBoard=makeBoard(7,8);
      break;

    case 11:
      gameBoard=makeBoard(8,8);
      break;

    case 12:
      gameBoard=makeBoard(8,9);
      break;

    case 13:
      gameBoard=makeBoard(9,9);
      break;

    case 14:
      gameBoard=makeBoard(9,10);
      break; 

    case 15:
      gameBoard=makeBoard(9,10);
      break;    

    default:
      gameBoard=makeBoard(3,3);
  }

  //First clears the gameboard for the cases when the next level is on the same size gameboard.
  unhighlightBoard();

  //This displays the number of highlighted squares and trials left.
  $('#squareNumDisplay #square').text(playerObj.numberHighlighted);
  $('#trialDisplay #trial').text(playerObj.trial + ' of ' + totalTrials);
  
  //This highlights the amount of squares on the gameboard appropriate to the given level and renders the changes to the screen.
  highlightSquares(playerObj.numberHighlighted);
  showBoard(gameBoard);

  /*Unhighlighting the squares on a delay to to give a player a chance to memorize where they were.
   *You can make the game easier or harder by increasing or decreasing the delay 
   *TODO - vary the delaytime for each level.
   */
  setTimeout(function() {unhighlightBoard();},1200);
};//closes out the gameBoardLevel function


//This function holds the game logic.
function gamePlay() {
  
  //Initializing the click variables.
  var clickCount = 0;
  var wrongClickCount = 0;

  //This array holds the number of squares achieved after each level. Will be used in the stats prompt
  
  var levelsAchieved = [];

  //This function is invoked when a square is clicked with the position array of the clicked square as an argument.
  window.clickHandler = function(positionArr) {
    var row = positionArr[0];
    var column = positionArr[1];   
    
    //This references the number of squares highilighted.
    var squareCount = y.filter(makeFlatArr(gameBoard), function(sqObj) {
      return sqObj.randomHighlight === true;
    }).length;
   
    //This iterates through the flat array of gameboard square objects after every click.
    y.each(makeFlatArr(gameBoard), function(sqObj) {
        
      //This determines if the square clicked by the user was previously highilghted by the game.
      if (sqObj.position[0] === row && sqObj.position[1] === column && sqObj.randomHighlight === true) {
        
        //If the clicked square was prevously randomly highlighted, the square is highlghted and the user highlight property is changed to true.
        sqObj.color = memBlue;
        sqObj.userHighlight = true;
        
        //This conditional prevents the score and the clickCount to increment if the same square is clicked twice.
        if (sqObj.scored === false) {
          clickCount ++;
          player.score += 250;
          sqObj.scored = true;
          
          //This references the number of guesses the user has in a given level.
          var guessesLeft = (player.numberHighlighted - clickCount); 
         
          if (guessesLeft >= 2) {

            //Displays the number of guesses left on the bottom of the screen. 
            $('body').find('#clickPrompt').text('Keep clicking. You can uncover ' +guessesLeft +' more squares.').show();
          }

          else if (guessesLeft === 1) {
            $('body').find('#clickPrompt').text('Keep clicking. You can uncover ' +guessesLeft +' more square.').show();
          }
        }

        //This plays a sound every time a correct square is clicked.
        $('#correctClick')[0].play();
       
        //This displays the updated score in the upper lefthand corner of the screen.
        $('#scoreDisplay #score').text(player.score);
      }        
          
      //This conditinal test if the clicked square was not previosly highlighted. 
      else if (sqObj.position[0] === row && sqObj.position[1] === column && sqObj.randomHighlight === false) {
        sqObj.userHighlight = true;
        sqObj.color = memOrange;
        
        //This conditional prevents the clickCount and wrongClick count from incrementing more than once if a user clicks the same wrong square multiple times.
        if (sqObj.scored == false) {
          sqObj.color = memOrange;
          clickCount++;
          wrongClickCount++;
          sqObj.scored = true;

          var guessesLeft = (player.numberHighlighted - clickCount); 
         
          if (guessesLeft >= 2) {
            $('body').find('#clickPrompt').text('Keep clicking. You can uncover ' +guessesLeft +' more squares.').show();
          }

          else if (guessesLeft === 1) {
            $('body').find('#clickPrompt').text('Keep clicking. You can uncover ' +guessesLeft +' more square.').show();
          }
        }

        //This plays a sound when a bonus is awarded after the last user click of a perfect level       
       $('#wrongClick')[0].play()

       //This pauses the clip sound after 0.5s and rewinds the clip for the next play
       setTimeout(function() {
        $('#wrongClick')[0].pause();
        $('#wrongClick')[0].currentTime = 0;
       },500);     
      }
    });//closes out the each. 
    
    //This renders the changes from the above logic on to the screen.
    showBoard(gameBoard);  

  
    //creating a flat array of square objects that are randomly highlighted.    
    var flatHighlightedGameboard= _.filter(makeFlatArr(gameBoard), function(sqObj,index) {
        return sqObj.randomHighlight === true;
    });
    
    //Checks if player has used all their guesses.
    if (clickCount === player.numberHighlighted) {
      
      //Pushing the square amount for the level into an array for the stats at the end of the game.
      levelsAchieved.push(player.numberHighlighted);
      //This hides the prompt that shows number of guesses left.
      $('body').find('#clickPrompt').hide();
    

      //This determines if the user guessed every square correctly by using every to compare the user highlighted object to the randomHighlighted object.
      var winBonus = y.every(makeFlatArr(gameBoard), function(sqObj) {
        return sqObj.randomHighlight === sqObj.userHighlight
      });

      //If the player guesses everything right. 
      if (winBonus) {
       
        //This gives the player a score bonus = to the current level x 100 after the level is completed.
        var bonus = player.numberHighlighted*100;
        clickCount = 0;
        player.trial++; 
       

        //This plays a sound when a bonus is awarded after the last user click of a perfect level.       
        $('#bonusClip')[0].play()

        //This pauses the clip sound after 1.5s and rewinds the clip for the next play.
        setTimeout(function() {$('#bonusClip')[0].pause();
          $('#bonusClip')[0].currentTime = 0;
        },1500);

        //This quickly shows the player the amount of bonus points underneath the score display. 
        $('body').find('#bonus').text('+ BONUS ' +bonus ).slideDown(); 
        $('body').find('#bonus').text('+ BONUS ' +bonus ).slideUp(); 

        player.score+=bonus  

        //This applies the added bonus to the displayed score.
        $('#scoreDisplay #score').text(player.score); 

        //This quickly flashes +LEVEL underneath the score display. 
        $('body').find('#levelUp').text('+ LEVEL').slideDown(); 
        $('body').find('#levelUp').text('+ LEVEL').slideUp();
        
        //Invoking with a delay to makes sure last clicked square shows on the screen.
        setTimeout(function() {gameBoardLevel(incrementPlayer(player))},2000);     
      
      } // this closes out the if winBonus.
      
      //If the user only misses one square, the level is repeated.
      else if (wrongClickCount === 1) {

        player.trial++;
        clickCount = 0;

        //This quickly displays the correct array of highlighted squares after guessing wrong.
        setTimeout(function() {showHighlighted()},800);

        //Invoking the new level with a delay to ensure the last incorrect clicked square shows on the the screen.
        setTimeout(function() {gameBoardLevel(player)},4000); 
      }
      
      //This executes if the user clicks more than one wrong square.
      //The level and number of squares to be highlighted decreases by one.
      else {
        player.trial++;
        clickCount = 0; 
        setTimeout(function() {showHighlighted()},800);

        //This flashes -LEVEL under the score display unless on level 0
        if(player.level > 0) {
          $('body').find('#levelDown').text('- LEVEL').slideDown(); 
          $('body').find('#levelDown').text('- LEVEL').slideUp();
        }  

        //Decreasing the level and squares to be highlighted by one unless the player is on level zero.
        (player.level === 0) ? (player.level = 0) : (player.level--);
        (player.numberHighlighted === 2) ? (player.numberHighlighted = 2) : (player.numberHighlighted--);
        
        setTimeout(function() {gameBoardLevel(player)},4000);
      }
    }//this closes the if clickcount == highlighted squares.

    //This conditional tests if the player has reached the end of the game.
    if (player.trial === totalTrials) {

      var maxSquare = y.max(levelsAchieved);
      console.log("levelsAchieved, ", levelsAchieved, "maxSquare, ", maxSquare);
   
      //This hides the gameBoard and displays the players stats with a prompt to play again.  
      //Set on delay to make sure the last clicked square is shown on the screen.
      setTimeout(function() {
        $('body').find('.gameBoard').hide();
        $('body').css('background-image','url("images/trumpYourCat.jpg")');
        $('body').find('#stats').show();
        $('#stats #finalScore').text(player.score);
        $('#stats #highestSquare').text(maxSquare);
        $('body').find('.allDisplays').hide();
        $('#outro')[0].play();
      },1500);

      //This executes if the player clicks the yes button on the stats page.
      $(document).on('click', '#reStartYes', function() {
       
        //Stops the music, hides the stats and reshows the gamboard class.
        $('#outro')[0].pause();
        $('#outro')[0].currentTime = 0;
        $('body').find('#stats').hide();
        $('body').find('.allDisplays').show();
        $('body').find('.gameBoard').show();
        $('body').css('background-image','url("images/brownBackground.jpg")')

        //Creates and displays the starting level with the reset playerObject as an argument.
        gameBoardLevel(resetPLayer(player));        
      });

      //Executes if the user clicks no on the stats page.
      $(document).on('click', '#reStartNo', function() {
        
        //Pauses the music, plays a sound and displays a different image.
        $('#outro')[0].pause();
        $('#outro')[0].currentTime = 0;
        $('#soreLoser')[0].play();
        $('body').css('background-image','url("images/catGiphy.gif")')
      })

    }//this closes out if player.trial = x  
  }//this closes clickHandler 
};//this closes out the gamePlay function

//This prompts the user to start the game.
function startGame() {

  //Hides the gameboard, displays, and prompts the user to start the game.
  $('body').find('.gameBoard').hide();
  $('body').find('.allDisplays').hide();
  $('body').find('#intro')[0].play();
  $('body').find('#start').show();

  //This executes if the player clicks yes.
  $(document).on('click', '#startYes', function() {

    //Intro music is paused, the background image changes and the gameboard is shown.
    $('#intro')[0].pause();
    $('#intro')[0].currentTime = 0;
    $('body').find('#start').hide();
    $('body').css('background-image','url("images/brownBackground.jpg")');
    $('body').find('.allDisplays').show();
    $('body').find('.gameBoard').show();

    gamePlay();
    gameBoardLevel(player);
  }); 

  //If player clicks no.
  $(document).on('click','#startNo',function(){
    
    //The background image changes and a sound is played.
    $('#intro')[0].pause();
    $('#intro')[0].currentTime = 0;
    $('#soreLoser')[0].play();
    $('body').find('.gameBoard').hide();
    $('body').find('.allDisplays').hide();
    $('body').css('background-image','url("images/catGiphy.gif")');
    $('body').find('#start').show();
  }) 
}

startGame();  

});

