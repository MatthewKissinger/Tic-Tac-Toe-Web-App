
// Player Factory Function
const playerFactory = (name, token) => {
    let moveArray = [];

    let isTurn = false;

    const addToMoves = (tile) => {
        moveArray.push(tile);
    }

    const clearMoveArray = () => {
        moveArray.length = 0;
    }

    return {
        name, token, moveArray, isTurn, addToMoves, clearMoveArray
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
            tile.classList.add('checked');
            tile.classList.add('tile');

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
        e.target.innerText = gameController.returnMarker();

        gameController.returnActivePlayer().addToMoves(e.target.getAttribute('data-tile'));
        if (gameController.checkForWin(gameController.returnActivePlayer().moveArray)) {
            gameController.displayOutcome(gameController.returnActivePlayer().name);
            return;
        } else if (gameController.checkForDraw()){
            gameController.displayOutcome(`Draw`);
            return;
        }

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
    let outcomeContainer = document.getElementById('outcome-container');
    let outcomeMessage = document.getElementById('outcome-message');
    
    _render();

    let gameStartBtn = document.getElementById('start-btn');
    let gameResetBtn = document.getElementById('reset-btn');
    let playerTurnMessage = document.getElementById('turn-message');
    
    // Bind Events
    gameStartBtn.addEventListener('click', gameStart);
    gameResetBtn.addEventListener('click', resetGameBoard);

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

        let gameResetBtn = document.createElement('button');
        gameResetBtn.setAttribute('id', 'reset-btn');
        gameResetBtn.innerText = `New Game`;
        gameResetBtn.classList.add('hide');

        let playerTurnMessage = document.createElement('h3');
        playerTurnMessage.setAttribute('id', 'turn-message');
        playerTurnMessage.classList.add('hide');

        messageDisplay.appendChild(gameStartBtn);
        messageDisplay.appendChild(gameResetBtn);
        messageDisplay.appendChild(playerTurnMessage);
    }

    function gameStart() {
        let tileNodes = document.querySelectorAll('.tile');
        
        tileNodes.forEach(tile => {
            tile.classList.remove('checked');
        })

        gameStartBtn.classList.add('hide');

        setPlayerTurn();
        playerTurnMessage.classList.remove('hide');
    }
    
    function setPlayerTurn() {

        // sets first move to random
        if (player1.moveArray.length === 0 && player2.moveArray.length === 0) {
            let randomFirstPlay = Math.floor(Math.random() * 10) + 1;

            if (randomFirstPlay <= 5) {     
                _activePlayer = player1;
                _marker = player1.token;
            } else {
                _activePlayer = player2;
                _marker = player2.token;
            }
        } else if(_marker === player1.token) {
            _marker = player2.token;
            _activePlayer = player2;
        } else {
            _marker = player1.token;
            _activePlayer = player1;
        }
        displayPlayerTurn();
    }

    function returnActivePlayer() {
        return _activePlayer;
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

    const multipleExist = function(array, test) {
        return test.every(value => {
            return array.includes(value);
        });    
    }

    // check for win method
    function checkForWin(array) {
        let winTest1 = ['1', '2', '3'];
        let winTest2 = ['1', '4', '7'];
        let winTest3 = ['1', '5', '9'];
        let winTest4 = ['2', '5', '8'];
        let winTest5 = ['3', '6', '9'];
        let winTest6 = ['3', '5', '7'];
        let winTest7 = ['4', '5', '6'];
        let winTest8 = ['7', '8', '9'];

        switch (true) {
            case multipleExist(array, winTest1): 
            case multipleExist(array, winTest2):
            case multipleExist(array, winTest3):
            case multipleExist(array, winTest4):
            case multipleExist(array, winTest5):
            case multipleExist(array, winTest6):
            case multipleExist(array, winTest7):
            case multipleExist(array, winTest8):
            // logic for resetButton to display
            playerTurnMessage.classList.add('hide');
            gameResetBtn.classList.remove('hide');
            return true;
        }
    }

    function checkForDraw() {
        let tileNodes = document.querySelectorAll('.tile');
        let tilesArray = Array.from(tileNodes);

        let check = tilesArray.every((tile) =>
            tile.classList.contains('checked'));
        
        if (check) {
            playerTurnMessage.classList.add('hide');
            gameResetBtn.classList.remove('hide');
        }

        return check;
    }
        
    // Display Winner or Draw method
    function displayOutcome(name) {
        outcomeContainer.classList.remove('hide');
        outcomeContainer.classList.add('flex-center');
        if (name === 'Draw') {
            outcomeMessage.innerText = name;
        } else {
            outcomeMessage.innerText = `${name} wins!`;
        }
        
    }

    // reset gameBoard and player moveArrays method -- bring up a button that asks if they want to play another game
    function resetGameBoard() {
        console.log('reset the game');
        gameResetBtn.classList.add('hide');
        outcomeContainer.classList.remove('flex-center');
        outcomeContainer.classList.add('hide');

        let tileNodes = document.querySelectorAll('.tile');
        
        tileNodes.forEach(tile => {
            tile.classList.remove('checked');
            tile.innerText = '';
        })
        player1.clearMoveArray();
        player2.clearMoveArray();
        playerTurnMessage.classList.remove('hide');
        setPlayerTurn();
    }

    return {
        returnActivePlayer, returnMarker, setPlayerTurn, checkForWin, checkForDraw, displayOutcome
    }
})();


