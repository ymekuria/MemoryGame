//This function creates a gameboard from a given column size and row size input
function makeBoard(columnSize, rowSize) {
  var board = [];

 //Puting the board color variables on the global scope for access in other modules.
  window.memBrown = '#714A43'; //Default square color
  window.memBlue = '#56BBB6'; //Highlight color
  window.memOrange = '#F60'; //Incorrect guess color
 
  for(var i = 0; i < columnSize; i++) {
  	var row = [];

	for(var j = 0; j < rowSize; j++) {
    
    //Creating an object for every square.
   	var square = {
      position: [i, j], //This property holds a the position array of each square in relation to the gameboard
      color: memBrown, 
      randomHighlight: false, // This property keeps track if the square was randomly highlighted 
      userHighlight: false, //This property keeps track if the user highlighted a square
      scored: false //This proprty keeps track if a score was given for clicking on a square
          
    };

    //Creating each row by pushing the square objects into the row array
    row.push(square);
  }

    //Creating the board by pushing eac row array of squares into the board array
    board.push(row);
  }

  return board;
}

//This function wipes out the existing gameboard and renders a new one to the screen.
function showBoard(gameBoard) {
  
  //Creating a gamboard node.
  $('.gameBoard').html('');
  var boardSize = gameBoard.length;
  
  //Scalling the gameBoard to the screen size.
  var browserSize = Math.min($(window).height(), $(window).width());
  $('.gameBoard').width(browserSize - 450);

  // Calculating how big the squares will be to fit in the window leaving a little room on the sides and bottom.
  var squareSize = (browserSize - 450) / boardSize - 10;
  
  //Using a nested each to iterate through the gameBoard array of object arrays.
  y.each(gameBoard, function(rowArr,rowIndex) {
  	y.each(rowArr, function(squareObj,columnIndex) {
      
      //Creating a html div for each square.    
      var squareHtml = '<div class="gameSquare" "front" "back" "flip" style="background-color:' + squareObj.color + '; height:' + squareSize + 'px; width:' + squareSize + 'px" data-position="[' + rowIndex + ',' + columnIndex + ']"></div>';
      
      //Adding each unique square div to the gameboard class.
      $('.gameBoard').append(squareHtml);
    });
  });
}

//This invokes the clickHandler function defined in memory.js, passing the position array of the clicked square as an argment.
$(document).on('click', '.gameSquare', function() {
  clickHandler($(this).data('position'));
});
