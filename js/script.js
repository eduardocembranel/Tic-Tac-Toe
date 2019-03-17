"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const background = new Image();
background.src = 'images/campod.jpg';
var sprites = { playerX: new Image(), playerO: new Image() };
var buttons = [];

var game =
{
  // 0 => empty slot
  // 1 => X
  // 2 => O
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  playing: false,
  player: undefined
};

function Button(xi, xf, yi, yf, index) {
  this.xi = xi;
  this.xf = xf;
  this.yi = yi;
  this.yf = yf;
  this.index = index;

  this.clicked = function(x, y) {
    return (x > xi && x < xf && y > yi && y < yf) ? true : false;
  }
}

(function() {
  buttons.push(new Button(91, 182, 91, 182, 0));
  buttons.push(new Button(187, 278, 91, 182, 1));
  buttons.push(new Button(283, 374, 91, 182, 2));
  buttons.push(new Button(91, 182, 188, 279, 3));
  buttons.push(new Button(187, 278, 188, 279, 4));
  buttons.push(new Button(283, 374, 188, 279, 5));
  buttons.push(new Button(91, 182, 284, 375, 6));
  buttons.push(new Button(187, 278, 284, 375, 7));
  buttons.push(new Button(283, 374, 284, 375, 8));
})();


(function() {
  sprites.playerX.src = 'images/x.jpg';
  sprites.playerO.src = 'images/o.jpg';
})();

window.onload = function() { 
  canvas.width = canvas.height = 464;
  ctx.drawImage(background, 0, 0);
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetCanvas() {
  clear();
  ctx.drawImage(background, 0, 0);
}

function resetBoard() {
  for (var i = 0; i < 3; ++i) {
    for (var j = 0; j < 3; ++j) {
      game.board[i][j] = 0;
    }
  }
}

function reset() {
  resetBoard();
  resetCanvas();
}

function emptySlot(board, i, j) {
  return (board[i][j] === 0) ? true : false;
}

function fullBoard(board) {
  for (var i = 0; i < 3; ++i) {
    for (var j = 0; j < 3; ++j) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}

//1: X
//2: O
//0: draw
//-1: unfinished
function endGame(board) {
  var winner = whoWon(board);
  if (winner !== undefined) {
    return winner;
  }

  return (fullBoard(board)) ? 0 : -1;
}

function updateCanvas() {
  for (var i = 0; i < 3; ++i) {
    for (var j = 0; j < 3; ++j) {
      var cell = game.board[i][j];
      if (cell === 1) {
        var pos = i * 3 + j;
        var x = buttons[pos].xi;
        var y = buttons[pos].yi;
        ctx.drawImage(sprites.playerX, x, y);
      } else if (cell === 2) {
        var pos = i * 3 + j;
        var x = buttons[pos].xi;
        var y = buttons[pos].yi;
        ctx.drawImage(sprites.playerO, x, y);
      }
    }
  }
}

function updateBoard(i, j, player) {
  if (player === true) {
    game.board[i][j] = game.player;
  } else {
    game.board[i][j] = (game.player === 1) ? 2 : 1;
  }
}

//player: 1, opponent (a.i): 2, nobody: undef
function whoWon(board) {
  var i, j;
  for (i = 0; i < 3; ++i) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      if (board[i][0] === 1) {
        return 1;
      } else if (board[i][0] === 2) {
        return 2;
      }
    }
  }
  for (j = 0; j < 3; ++j) {
    if (board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      if (board[0][j] === 1) {
        return 1;
      } else if (board[0][j] === 2) {
        return 2;
      }
    }
  }
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === 1) {
      return 1;
    } else if (board[0][0] === 2) {
      return 2;
    }
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === 1) {
      return 1;
    } else if (board[0][2] === 2) {
      return 2;
    }
  }
  return undefined;
}

function evaluate(board) {
  var winner = whoWon(board);
  if (winner === undefined) {
    return 0;
  } else if (winner === 1) {
    return 10;
  } else if (winner === 2) {
    return -10;
  }
}

function minimax(board, player, isMax, depth) {
  var weight = evaluate(board);

  if (weight === 10) {
    return weight - depth;
  }
  if (weight === -10) {
    return weight + depth;
  }
  if (fullBoard(board)) {
    return 0;
  }

  var bestWeight;

  if (isMax) {
    bestWeight = -2;
    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (emptySlot(board, i, j)) {
          board[i][j] = player;
          if (player === 1) {
            bestWeight = Math.max(bestWeight, minimax(board, 2, !isMax, depth + 1)); 
          } else {
            bestWeight = Math.max(bestWeight, minimax(board, 1, !isMax, depth + 1)); 
          }
          board[i][j] = 0;
        }
      }
    }
  } else {
    bestWeight = 2;
    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (emptySlot(board, i, j)) {
          board[i][j] = player;
          if (player === 1) {
            bestWeight = Math.min(bestWeight, minimax(board, 2, !isMax, depth + 1));
          } else {
            bestWeight = Math.min(bestWeight, minimax(board, 1, !isMax, depth + 1));
          }
          board[i][j] = 0;
        }
      }
    }
  }
  return bestWeight;
}

function generateBestMove(player) {
  var bestIndexes = [];
  var bestWeight = -2;
  var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  if (player === 1) {
    board = game.board;
  }
  else {
    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (game.board[i][j] === 1) {
          board[i][j] = 2;
        } else if (game.board[i][j] === 2) {
          board[i][j] = 1;
        } else {
          board[i][j] = 0;
        }
      }
    }
  }

  for (var i = 0; i < 3; ++i) {
    for (var j = 0; j < 3; ++j) {
      if (emptySlot(board, i, j)) {
        board[i][j] = 1;
        var currentWeight = minimax(board, 2, false, 0);
        board[i][j] = 0;

        if (currentWeight > bestWeight) {
          bestIndexes = [];
          bestIndexes.push(i * 3 + j);
          bestWeight = currentWeight;
        } else if (currentWeight === bestWeight) {
          bestIndexes.push(i * 3 + j);
        }
      }
    }
  }
  var randomIndex = Math.floor(Math.random() * bestIndexes.length);
  return bestIndexes[randomIndex];
}

document.getElementById('btn-left').addEventListener('click', function() {
  reset();
  game.playing = true;
  game.player = 1;
});

document.getElementById('btn-right').addEventListener('click', function() {
  reset();
  game.playing = true;
  game.player = 2;
  var nextMove = generateBestMove(1);
  var i = Math.floor(nextMove / 3);
  var j = nextMove % 3;  
  updateBoard(i, j, false);
  updateCanvas();
  
});

function showEndGameMessage(gamesState) {
  ctx.font = 'bold 65px courier';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';

  if (gamesState === 0) {
    ctx.fillText('IT\'S A DRAW!', canvas.width/2, canvas.height/2);
  } else {
    ctx.fillText('YOU LOSE!', canvas.width/2, canvas.height/2);
  }
}

canvas.addEventListener('click', function(e) {
  var x = Math.floor(e.offsetX * canvas.width / canvas.offsetWidth);
  var y = Math.floor(e.offsetY * canvas.height / canvas.offsetHeight);
  var clickedButton = undefined;

  function callback(element) {
    return element.clicked(x, y);
  }
  clickedButton = buttons.find(callback);
  if (clickedButton != undefined) {
    var index = clickedButton.index;
    var i = Math.floor(index / 3);
    var j = index % 3;
  }

  if (clickedButton !== undefined && game.playing === true && emptySlot(game.board, i, j)) {
    updateBoard(i, j, true);
    var gamesState = endGame(game.board);
    if (gamesState === -1) {
      if (game.player === 1) {
        var nextMove = generateBestMove(2);
      } else {
        nextMove = generateBestMove(1);
      }
      i = Math.floor(nextMove / 3);
      j = nextMove % 3;  
      updateBoard(i, j, false);
    } else {
      game.playing = false;
      updateCanvas();
      showEndGameMessage(gamesState);
    }
    gamesState = endGame(game.board);
    if (gamesState !== -1) {
      game.playing = false;
      updateCanvas();
      showEndGameMessage(gamesState);
    } else {
      updateCanvas();
    }
  }
});

//debug
canvas.addEventListener('mousemove', function(e) {
  // clear();
  // var x = Math.floor(e.offsetX * canvas.width / canvas.offsetWidth);
  // var y = Math.floor(e.offsetY * canvas.height / canvas.offsetHeight);

  // ctx.font = 'bold 30px courier';
  // ctx.textAlign = 'center';

  // var str = x + ' ' + y;

  // ctx.fillText(str, canvas.width/2, canvas.height/2); 


   ////ctx.fillText('x=' + x + '  y=' + y, canvas.width/2, canvas.height/2); 
});
