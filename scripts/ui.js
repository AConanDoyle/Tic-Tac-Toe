// ui object contained all UI related methods and attributes
// constructor 
var ui = {};

//holds the state of the intial controls visibility
ui.intialControlsVisible = true;

//holds the current visible view
ui.currentView = "";

// switchs the view on the UI depending on who's turn it switchs
// @param turn [String]: the player to switch the view to

ui.switchViewTo = function(turn) {

	//helper function for async calling
	function _switch(_turn) {
		ui.currentView = "#" + _turn;
		$(ui.currentView).fadeIn("fast");
		if (_turn == "won" || _turn == "lost" || _turn == "draw") {
			$('.restart').fadeIn({
				duration : "slow",
				done : function() {
				}				
			});
		}
	}

	if (ui.intialControlsVisible) {
		//if the game is just starting
		ui.intialControlsVisible = false;
		$('.intial').fadeOut({
			duration : "slow",
			done : function() {
				_switch(turn);
			}
		});
	} else {
		//if the game is in an intermediate state
		$(ui.currentView).fadeOut({
			duration : "fast",
			done : function() {
				_switch(turn);
			}
		});
	}
};

// places X or O in the specifed place on the board
// @param index determines the cell
// @param symbol [String]: X or O

ui.insertAt = function(indx, symbol) {
	var board = $('.cell');
	var targetCell = $(board[indx]);

	if (!targetCell.hasClass('occupied')) {
		targetCell.html(symbol);
		targetCell.css({
			color : symbol == "X" ? "green" : "red"
		});
		targetCell.addClass('occupied');
	}
};

// updates the view to an older history state
// @param index determoines the cell
// @param symbol [String]: X or O

ui.updateBoard= function(indx, symbol) {
	var board = $('.cell');
	var targetCell = $(board[indx]);
	if (targetCell.hasClass('occupied') && symbol == "E") {
		targetCell.html(" ");
		targetCell.removeClass('occupied');
	}	
};
