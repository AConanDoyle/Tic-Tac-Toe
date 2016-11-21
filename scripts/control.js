// object to contain all items accessable to all control functions
var globals = {};
// varibale for counting the history states
var statecounter = 0;

// start game (onclick div.start) behavior and control
// when start is clicked the game status changes to "running"
// and UI view to swicthed to indicate that it's human's trun to play

$(".start").click(function() {
	var aiPlayer = new AI();
	globals.game = new Game(aiPlayer);
	aiPlayer.plays(globals.game);
	globals.game.start();
});


// click on cell (onclick div.cell) behavior and control
// if an empty cell is clicked when the game is running and its the human player's trun
// get the indecies of the clickd cell, craete the next game state, upadet the UI, and
// advance the game to the new state

$(".cell").each(
		function() {
			var $this = $(this);
			$this.click(function() {
				if (globals.game.status === "running"
						&& globals.game.currentState.turn === "X"
						&& !$this.hasClass('occupied')) {
					var indx = parseInt($this.data("indx"));

					var next = new State(globals.game.currentState);
					next.board[indx] = "X";

					ui.insertAt(indx, "X");

					next.advanceTurn();

					globals.game.advanceTo(next);		
					pushState();
				}
			});
		});

// function for refreshing game
$(".restart").click(function() {
	location.reload();
	var aiPlayer = new AI();
	globals.game = new Game(aiPlayer);
	aiPlayer.plays(globals.game);
	globals.game.start();
});

// function handling the back button
$(window).on('popstate', function() {
	// if the game is finished, there will be no back button support
	if (globals.game.status == "ended") {
		alert("Game over");
	} else {
		// parsing and updating to the state before
		var oldState = JSON.parse(history.state);
		$(globals.game.currentState.result).replaceWith(oldState.result);
		for (var i = 0; i < 9; i++) {
			globals.game.currentState.board.splice(i, i, oldState.board[i]);
			ui.updateBoard(i, globals.game.currentState.board[i]);
		}
	}
	return;
});

//function handling the foreword button
$(window).on('goForward', function() {
	// if the game is finished, there will be no back button support
	if (globals.game.status == "beginning") {
		alert("Das wird schwierig");
	} else {
		// parsing and updating to the new state
		var newState = JSON.parse(history.state);
		$(globals.game.currentState.result).replaceWith(newState.result);
		for (var i = 0; i < 9; i++) {
			globals.game.currentState.board.splice(i, i, newState.board[i]);
			ui.updateBoard(i, globals.game.currentState.board[i]);
		}
	}
	return;
});

// function saving the state in browser history
pushState = function() {
	statecounter++;
	window.history.pushState(JSON.stringify(globals.game.currentState), 
		"TicTacToe", "#" + statecounter);
};
