// Constructs a game object to be played
// @param autoPlayer [AIPlayer] : the AI player to be play the game with
var Game = function(autoPlayer) {

	//public : initialize the ai player for this game
	this.ai = autoPlayer;

	// public : initialize the game current state to empty board configuration
	this.currentState = new State();

	//"E" stands for empty board cell;
	this.currentState.board = [ "E", "E", "E", "E", "E", "E", "E", "E", "E" ];

	this.currentState.turn = "X"; //X plays first
	
	// initialize game status to beginning
	this.status = "beginning";

	// starts the game
	this.start = function() {
		if (this.status = "beginning") {
			//invoke advanceTo with the intial state
			this.advanceTo(this.currentState);
			this.status = "running";
			pushState();			
		}
	};

	// public function that advances the game to a new state
	// @param _state [State]: the new state to advance the game to
	this.advanceTo = function(_state) {
		this.currentState = _state;
		if (_state.isTerminal()) {
			this.status = "ended";

			if (_state.result === "X-won")
				//X won
				ui.switchViewTo("won");
			else if (_state.result === "O-won")
				//X lost
				ui.switchViewTo("lost");
			else
				//it's a draw
				ui.switchViewTo("draw");
		} else {
			//the game is still running
			if (this.currentState.turn === "X") {
				ui.switchViewTo("human");
			} else {
				ui.switchViewTo("robot");

				//notify the AI player its turn has come up
				this.ai.notify("O");
			}
		}
	};
};

// Represents a state in the game
// @param old [State]: old state to intialize the new state
var State = function(old) {

	// player who has the turn to player     
	this.turn = "";
	// number of moves of the AI player
	this.oMovesCount = 0;

	// the result of the game in this State
	// Could be: still running, X-Won, O-Won or a draw
	this.result = "still running";
	// the board configuration in this state
	// simple Array with a length of 9
	this.board = [];	

	// constructor for the game board
	if (typeof old !== "undefined") {
		// if the state is constructed using a copy of another state
		var len = old.board.length;
		this.board = new Array(len);
		for ( var itr = 0; itr < len; itr++) {
			this.board[itr] = old.board[itr];
		}

		this.oMovesCountAI = old.oMovesCount;
		this.result = old.result;
		this.turn = old.turn;
	}
		
	// advances the turn in a the state
	this.advanceTurn = function() {
		this.turn = this.turn === "X" ? "O" : "X";
	};

	// public function that enumerates the empty cells in state
	// @return [Array]: indices of all empty cells
	this.emptyCells = function() {
		var indxs = [];
		for ( var itr = 0; itr < 9; itr++) {
			// if there is an empty cell, it puts it in new index
			if (this.board[itr] === "E") {
				indxs.push(itr);
			}
		}
		return indxs;
	};


	// function that checks if the state is a terminal state or not
	// @returns [Boolean]: true if the game is over, false otherwise
	this.isTerminal = function() {
		var B = this.board;

		//checks the rows
		for ( var i = 0; i <= 6; i = i + 3) {
			if (B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
				this.result = B[i] + "-won"; //update the state result
				return true;
			}
		}

		//checks columns
		for ( var i = 0; i <= 2; i++) {
			if (B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
				this.result = B[i] + "-won"; //update the state result
				return true;
			}
		}

		//checks diagonals
		for ( var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
			if (B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
				this.result = B[i] + "-won"; //update the state result
				return true;
			}
		}

		// Checks the empty cells, and if yes, puts the ruslt on draw
		var available = this.emptyCells();
		if (available.length == 0) {
			//the game is draw
			this.result = "draw"; //update the state result
			return true;
		} else {
			return false;
		}
	};
};	


// public static function that calculates the score of the x player in a given terminal state
// @param _state [State]: the state in which the score is calculated
// @return [Number]: the score calculated for the human player

Game.score = function(_state) {
	if (_state.result === "X-won") {
		// the x player won
		return 10 - _state.oMovesCount;
	} else if (_state.result === "O-won") {
		// the x player lost
		return -10 + _state.oMovesCount;
	} else {
		// it's a draw
		return 0;
	}
};
