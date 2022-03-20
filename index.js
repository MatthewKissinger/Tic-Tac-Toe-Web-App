
// Player Factory Function
const playerFactory = (name, token) => {
    let moveArray = [];

    let isTurn = false;

    const addToMoves = (tile) => {
        moveArray.push(tile);
        console.log(moveArray);
    }

    return {
        name, token, moveArray, isTurn, addToMoves
    }
};

// Create 2 players
const player1 = playerFactory('player1', 'X');
const player2 = playerFactory('player2', 'O');

// Gameboard Module: displays tiles that are clickable
const gameBoard = (function() {
    // variables
    let gameTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // cache DOM
    let gameBoard = document.getElementById('game-board');

    _render();
    // Bind Events
    gameBoard.addEventListener('click', checkTile);

    // Methods

    function _render() {
        let array = gameTiles;
        
        array.forEach((item) => {
            let tile = document.createElement('div');

            tile.setAttribute('data-tile', item);
            tile.classList.add('flex-center');

            // hash tag gameboard border styling
            if (item === 1 || item === 2 || item === 3) {
                tile.style.borderTop = 'none';
                tile.style.borderBottom = 'none';
            } 
            if (item === 1 || item === 4 || item === 7) {
                tile.style.borderLeft = 'none';
                tile.style.borderRight = 'none';
            }
            if (item === 3 || item === 6 || item === 9) {
                tile.style.borderRight = 'none';
                tile.style.borderLeft = 'none';
            }
            if (item === 7 || item === 8 || item === 9) {
                tile.style.borderTop = 'none';
                tile.style.borderBottom = 'none';
            }
            gameBoard.appendChild(tile);
        });
    }

    function checkTile(e) {
        if (e.target.classList.contains('checked')) {
            return;
        }

        e.target.classList.add('checked');

        // link function that uses the active player 
        e.target.innerText = gameController.returnMarker();
        player1.addToMoves(e.target.getAttribute('data-tile'));

        gameController.setPlayerTurn();
    }
})();

// Module that displays the player tokens and decides the turn order and outcome of the game
const gameController = (function() {
    // variables
    let _marker = '';
    let _activePlayer = '';

    // cache DOM
    let player1Display = document.getElementById('player1');
    let player2Display = document.getElementById('player2');
    let messageDisplay = document.getElementById('messageDisplay');
    
    _render();

    let gameStartBtn = document.getElementById('start-btn');
    let playerTurnMessage = document.getElementById('turn-message');
    
    // Bind Events
    gameStartBtn.addEventListener('click', gameStart);

    // Methods
    function _render() {
        let player1Token = document.createElement('h3');
        player1Token.innerText = player1.token;

        player1Display.appendChild(player1Token);

        let player2Token = document.createElement('h3');
        player2Token.innerText = player2.token;

        player2Display.append(player2Token);

        let gameStartBtn = document.createElement('button');
        gameStartBtn.setAttribute('id', 'start-btn');
        gameStartBtn.innerText = `Start Game`;

        let playerTurnMessage = document.createElement('h3');
        playerTurnMessage.setAttribute('id', 'turn-message');
        playerTurnMessage.classList.add('hide');

        messageDisplay.appendChild(gameStartBtn);
        messageDisplay.appendChild(playerTurnMessage);
    }

    function gameStart() {
        gameStartBtn.classList.add('hide');

        setPlayerTurn();
        playerTurnMessage.classList.remove('hide');
    }
    
    function setPlayerTurn() {
        // sets first move to random
        if (player1.moveArray.length === 0 && player2.moveArray.length === 0) {
            let randomFirstPlay = Math.floor(Math.random() * 10) + 1;

            if (randomFirstPlay <= 5) {
                player1.isTurn = true;
                _marker = player1.token;
            } else {
                player2.isTurn = true;
                _marker = player2.token;
            }
        } else if(_marker === player1.token) {
            player1.isTurn = false;
            _marker = player2.token;
            player2.isTurn = true;
        } else {
            _marker = player1.token;
            player1.isTurn = true;
            player2.isTurn = false;
        }
        displayPlayerTurn();
        console.log(_marker);
    }

    // Display Player Turn method
    function displayPlayerTurn() {
        if (_marker === player1.token) {
            playerTurnMessage.innerText = `Player 1's Turn`;
        } else {
            playerTurnMessage.innerText = `Player 2's Turn`;
        }
    }

    function returnMarker() {
        return _marker;
    }

    // check for win method

    // Display Winner or Draw method

    // reset gameBoard and player moveArrays method -- bring up a button that asks if they want to play another game

    return {
        returnMarker, setPlayerTurn
    }

})();


