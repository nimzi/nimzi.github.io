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

    end() {
        this.index = this.history.length - 1;
        this.showAtIndex();

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

var operaGamePGN = `
1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 
7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 
12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 
17. Rd8#`

var laskerBauerPGN = `
1.f4 d5 2.e3 Nf6 3.b3 e6 4.Bb2 Be7 5.Bd3 b6 6.Nc3 Bb7 7.Nf3
Nbd7 8.O-O O-O 9.Ne2 c5 10.Ng3 Qc7 11.Ne5 Nxe5 12.Bxe5 Qc6
13.Qe2 a6 14.Nh5 Nxh5 15.Bxh7+ Kxh7 16.Qxh5+ Kg8 17.Bxg7 Kxg7
18.Qg4+ Kh7 19.Rf3 e5 20.Rh3+ Qh6 21.Rxh6+ Kxh6 22.Qd7 Bf6
23.Qxb7 Kg7 24.Rf1 Rab8 25.Qd7 Rfd8 26.Qg4+ Kf8 27.fxe5 Bg7
28.e6 Rb7 29.Qg6 f6 30.Rxf6+ Bxf6 31.Qxf6+ Ke8 32.Qh8+ Ke7
33.Qg7+ Kxe6 34. Qxb7 Rd6 35. Qxa6 d4 36. exd4 cxd4 37. h4 d3
38. Qxd3`

var spasskyFischerBenoniPGN = `
1. d4 Nf6 2. c4 e6 3. Nf3 c5 4. d5 exd5 5. cxd5 d6 6. Nc3 g6
7. Nd2 Nbd7 8. e4 Bg7 9. Be2 O-O 10. O-O Re8 11. Qc2 Nh5
12. Bxh5 gxh5 13. Nc4 Ne5 14. Ne3 Qh4 15. Bd2 Ng4 16. Nxg4
hxg4 17. Bf4 Qf6 18. g3 Bd7 19. a4 b6 20. Rfe1 a6 21. Re2 b5
22. Rae1 Qg6 23. b3 Re7 24. Qd3 Rb8 25. axb5 axb5 26. b4 c4
27. Qd2 Rbe8 28. Re3 h5 29. R3e2 Kh7 30. Re3 Kg8 31. R3e2 Bxc3
32. Qxc3 Rxe4 33. Rxe4 Rxe4 34. Rxe4 Qxe4 35. Bh6 Qg6 36. Bc1
Qb1 37. Kf1 Bf5 38. Ke2 Qe4+ 39. Qe3 Qc2+ 40. Qd2 Qb3 41. Qd4
Bd3+`

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

//start cycling through moves on the main board recursively
cycle(0);


// var text = pgn2.join('\n');

var controllers = [
	new PGNViewer(operaGamePGN,board2), 
	new PGNViewer(laskerBauerPGN,board3),
	new PGNViewer(spasskyFischerBenoniPGN,board4)];

// controlling the little boards
function start(idx) {
    controllers[idx].start();
}

function prev(idx) {
    controllers[idx].prev();
}

function next(idx) {
    controllers[idx].next();
}

function end(idx) {
    controllers[idx].end();
}


