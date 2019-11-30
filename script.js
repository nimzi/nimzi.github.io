var config = {
	position: 'start',
	draggable: true,
	showNotation: false
}


class PGNViewer {
	constructor(pgnText,board) {
		this.pgn = pgnText;
		this.board = board;
		this.chess = new Chess();
		this.chess.load_pgn(pgnText);
		this.history = this.chess.history();
		this.index = -1;
	}

	showAtIndex() {
		this.chess.reset();
			
        for (var i = 0;i<=this.index;i++) {
        	this.chess.move(this.history[i]);
        }

        var fen = this.chess.fen();
        this.board.position(fen);
	}

	next() {
		if (this.index < this.history.length - 1) {
            this.index = this.index + 1;
			this.showAtIndex();
            
			
		}

	}

	prev() {
		if (this.index >= 0) {
            this.index = this.index - 1;
            this.showAtIndex();
		} 
	}

	start() {
		this.index = -1;
		this.board.start();
	}

}


//var board1 = ChessBoard('board1', config);
var board2 = ChessBoard('board2', config);
var board3 = ChessBoard('board3', config);
var board4 = ChessBoard('board4', config);

var board1 = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
	(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	return false
}
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
  	from: source,
  	to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
})

  // illegal move
  if (move === null) return 'snapback'

  	updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
	board.position(game.fen())
}

function updateStatus () {
	var status = ''

	var moveColor = 'White'
	if (game.turn() === 'b') {
		moveColor = 'Black'
	}

  // checkmate?
  if (game.in_checkmate()) {
  	status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
  	status = 'Game over, drawn position'
  }

  // game still on
  else {
  	status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
    	status += ', ' + moveColor + ' is in check'
    }
}

$status.html(status)
$fen.html(game.fen())
$pgn.html(game.pgn())
}

var config2 = {
	showNotation: false,
	draggable: false,
	position: 'start',
	// onDragStart: onDragStart,
	// onDrop: onDrop,
	// onSnapEnd: onSnapEnd
}

board = Chessboard('board1', config2)

updateStatus()



var pgn = ['1. Nf3 Nf6  2. g3 b6  3. Bg2 Bb7 4. d3 d5  5. O-O e6 6. Nc3 Be7',
'7. e4 d4  8. Ne2 c5  9. Nd2 O-O 10. h3 Nc6  11. f4 e5  12. Nf3 Nd7',
'13. f5 f6   14. g4 c4   15. Rf2 cxd3 16. cxd3 Nc5  17. Ne1 a5  18. Ng3 a4',
'19. Bf1 Qe8  20. h4 Qf7  21. Bd2 Na6  22. Rg2 Bb4  23. Bc1 Bxe1 24. Qxe1 Rfc8',
'25. Bd2 Kh8  26. g5 Qe7  27. Nh5 Rg8  28. g6 h6  29. Bxh6 Nc7 30. Bd2 Rgc8',
'31. Ng3 Kg8  32. Rc1 Kf8   33. h5 Ke8   34. h6 gxh6  35. Nh5 Kd7 36. Qh4 Ne8',
'37.Bxh6 Nd8  38.Rxc8 Rxc8  39.g7   1-0'];

var pgn2 = ['1.d4 d5 2.Nc3 Nc6 3.Bg5 Nf6 4.e3 g6 5.Qd2 Bg7 6.O-O-O Bf5 7.h3 Qd6 8.Nf3',
'O-O-O 9.Bf4 a6 *'];


game.load_pgn(pgn.join('\n'));
var h = game.history({ verbose: true });

game.reset();
board.start();


updateStatus();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function cycle(count) {
	sleep(500).then(() => { 
		if (count < h.length) {
			var m = h[count];
			var mm = m.from + "-" + m.to;
			board.move(mm);

			// castling
			if (m.piece == "k") {
				if (m.from == "e1" &&  m.to == "g1") {
					board.move("h1-f1");	
				} else if (m.from == "e8" && m.to == "g8") {
					board.move("h8-f8");	
				} else if (m.from == "e1" && m.to == "c1") {
					board.move("a1-d1");
				} else if (m.from == "e8" && m.to == "c8") {
					board.move("a8-d8");
				}
			}
			
			cycle(count+1);
		} else {
			game.reset();
			board.start();
			cycle(0);
		}
	});

}

//start cycling through moves on the main board
cycle(0);


var text = pgn2.join('\n');
var controllers = [
	new PGNViewer(text,board2), 
	new PGNViewer(text,board3),
	new PGNViewer(text,board4)];

// controlling the little boards
function start(idx) {
	switch (idx) {
		case 2: controllers[0].start(); break;
		case 3: controllers[1].start(); break;
		case 4: controllers[2].start(); break;
	}
	
}

function prev(idx) {
    switch (idx) {
        case 2: controllers[0].prev(); break;
        case 3: controllers[1].prev(); break;
        case 4: controllers[2].prev(); break;
    }
}

function next(idx) {
	switch (idx) {
		case 2: controllers[0].next(); break;
		case 3: controllers[1].next(); break;
		case 4: controllers[2].next(); break;
	}
}

function end(idx) {
	console.log("end" + idx);
}


