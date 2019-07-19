var winConditions = [ [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6] ]; //variable for the eight possible winning condition, each element of the array is a list of 3 square
var squareCount = 9; // total number of the board's squares
var squares = document.getElementsByClassName("square");
var difficulty = "moron" ; 
var gameOver = false ;

// Fucntion to set the value of the message box dynamicly 
var setMessageBox = function (caption){
    var messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = caption;
};

// Fucntion to find the square with marker 
var findClaimedSquares = function (marker){
    var claimedSquares = [];
    var value;

    for (var id = 0; id < squareCount; id++){
        value = document.getElementById(id).innerHTML;
        if( value === marker ){
            claimedSquares.push(id);
        }  
    }
    return claimedSquares;
}

// Fucntion to reset the Game
var resetGame = function(){
    gameOver = false;
    setMessageBox("Pick a square!");

    for( var id = 0; id< squareCount; id++){
        var square = document.getElementById(id);
        square.innerHTML = "";
        square.style.background = "#8080ff";
    }
}

// Function to check for the winning conditions 
var checkForWinConditions = function (marker){
    var claimedSquares = findClaimedSquares (marker);
    for ( var i =0; i< winConditions.length; i++){
        win = winConditions[i].every(element => claimedSquares.indexOf(element) > -1);
        if ( win ){
            win = winConditions[i];
            break;
        }
    }
    return win;
};

var secureWin = function (){
    return makeMove("O");
}

var preventDefeat = function (){
    return makeMove("X");
}

//Function make move, the idea here is to loop on the winConditions variable
//to get every square id, if it's equal to the marker given to this fucntion, then we incremente
//the variable count, when the variable is equal to 2 then we enter the second block of this function
//we check if every square in a fixed list of the winConditions array, if this one is still emty
var makeMove = function ( marker ){
    var moveMade = false;
    for( var i = 0; i<winConditions.length; i++ ){
        var count = 0;
        for( var j = 0; j< winConditions[i].length; j++){
            if(marker === document.getElementById(winConditions[i][j]).innerHTML){
                count++;
            }
        }
        if (count === 2 ){
            for( var j = 0; j< winConditions[i].length; j++){
                var square = document.getElementById(winConditions[i][j])
                if( squareIsOpen( square ) ){
                    square.innerHTML="O";
                    moveMade= true;
                    break;
                }
            }
        }
        if ( moveMade ){
            break;
        }
    }
    return moveMade;
}

//
var opponentMove = function ()
{
        if( difficulty === "moron")
        {
            makeMoveAtFisrtAvailableSquare();
        }
        else{
            var moveMade = secureWin();
            if( !moveMade)
            {
                moveMade = preventDefeat();
                if( !moveMade)
                {
                    var center = document.getElementById(4);
                    if( squareIsOpen( center ))
                    {
                        center.innerHTML = "O";
                    }
                    else
                    {
                        makeMoveAtFisrtAvailableSquare();
                    }
                }
            }
        }
}

var makeMoveAtFisrtAvailableSquare = function ()
{
    for( var id=0 ; id<squareCount; id++)
    {
        square = document.getElementById(id);
        if(squareIsOpen(square))
        {
            square.innerHTML = "O";
            break;
        }
    }
}

var squareIsOpen = function(square){
    return ( square.innerHTML!=="X" && square.innerHTML !=="O");
}

var highlightWinningSquares = function( winningSquares, color ){
    for ( var i = 0; i<winningSquares.length; i++)
    {
        document.getElementById( winningSquares[i] ).style.backgroundColor = color;
    }
}

var checkForDraw = function ()
{
    var draw = true;
    for( var id=0; id<squareCount; id++)
    {
        if(squareIsOpen(document.getElementById(id)))
        {
            draw = false;
            break;
        }
    }
    return draw;
}

var chooseSquare = function(){
    difficulty = document.getElementById("difficulty").value;
    if( !gameOver){
        setMessageBox("Pick a Square!");
        var id = this.getAttribute("id");
        var square = document.getElementById(id);
        if( squareIsOpen( square ) )
        {
            square.innerHTML = "X";
            /*
            Then we check to see if we won by calling checkForWinCondition.
            If we won we are returned an array containing the winning combination. 
            If lost we are simply returned false. 
            This is possible because JavaScript is not type safe.
            */ 
            var win = checkForWinConditions( "X" );
            if( !win )
            {
                opponentMove();
                var lost = checkForWinConditions( "O");
                if( !lost )
                {
                    var draw = checkForDraw();
                    if(draw){
                        gameOver= true;
                        setMessageBox("It's a draw");
                    }
                }
                else
                {
                    gameOver= true;
                    highlightWinningSquares(lost,"rgb(229,55,55)");
                    setMessageBox( "You lost!" );
                }
            }
            else{
                gameOver = true;
                highlightWinningSquares(win, "rgb(42, 178, 72)");
                setMessageBox( "You Won!" );
            }
        }
        else{
            setMessageBox( "That square is already taken!" );
        }
    }
};

for (var i=0; i< squares.length; i++){
    squares[i].addEventListener('click', chooseSquare, false);
}