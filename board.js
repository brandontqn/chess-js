import { masterConfig } from './config/master.config.js'
import { playerTypes, gameSetupType, gameSetups } from './config/gameSetups.config.js';
import { pieceImages } from './config/pieceImages.config.js';

export class Board {
    constructor() {
        this.state = {
            currentPlayer: playerTypes.white
        };
    };

    render() {
        let setupType = masterConfig.useInitialGame ? gameSetupType.initialGame : gameSetupType.otherGame;
        let setup = gameSetups[setupType];
        this.state.pieceCoordinates = this.findPieceCoordinates(setup);

        this.placePieceBoxNumbers();
        this.placePiecesInCoordinates(setup);
    };

    findPieceCoordinates(setup) {
        const pieceCoordinates = {};
        for (let coordinate in setup) {
            const piece = setup[coordinate];
            if (!pieceCoordinates[piece]) {
                pieceCoordinates[piece] = [coordinate];
            }
            else {
                pieceCoordinates[piece].push(coordinate);
            }
        }
        return pieceCoordinates;
    }

    placePieceBoxNumbers() {
        const cells = document.getElementsByClassName('cell');
        for (let cell of cells) {
            const spanElement = document.createElement('span');
            spanElement.classList.add('cell-text');
            spanElement.innerHTML = cell.getAttribute('id');

            cell.append(spanElement);
        }
    };

    placePiecesInCoordinates(gameSetup) {
        for (const coordinate in gameSetup) {
            this.renderCell(gameSetup[coordinate], coordinate);
        }
    };

    addEventListeners() {
        this.addMoveSubmitButtonListener();
    };

    addMoveSubmitButtonListener() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.addEventListener('click', () => {
            this.handleMoveSubmission();
        });
    };

    handleMoveSubmission() {
        this.makeMove();
        this.prepareForNextMove();
    }

    makeMove() {
        const move = document.getElementById('move').value;
        const [pieceType, dstCoordinate] = this.parseMove(move);

        const srcCoordinate = this.findSrcCoordinate(this.state.currentPlayer, pieceType, dstCoordinate);
        const fullPieceName = `${this.state.currentPlayer}_${pieceType}`;

        this.clearCell(srcCoordinate);
        this.renderCell(fullPieceName, dstCoordinate);
    };

    prepareForNextMove() {
        this.clearMoveInput();
        this.changePlayer();
    }

    clearMoveInput() {
        const move = document.getElementById('move');
        move.value = "";
    }

    changePlayer() {
        this.state.currentPlayer = this.state.currentPlayer == playerTypes.white ? playerTypes.black : playerTypes.white;
    }

    findSrcCoordinate(currPlayer, pieceType, dstCoordinate) {
        const fullPieceName = `${currPlayer}_${pieceType}`;
        const candidateSrcCoordinates = this.state.pieceCoordinates[fullPieceName];
        return this.findValidSrcCoordinate(candidateSrcCoordinates, dstCoordinate, pieceType);
    }

    findValidSrcCoordinate(candidateSrcCoordinates, dstCoordinate, pieceType) {
        for (let candidateSrcCoordinate of candidateSrcCoordinates) {
            const possibleMoves = this.findPossibleMoves(this.state.currentPlayer, pieceType, candidateSrcCoordinate);
            for (let move of possibleMoves) {
                if (move == dstCoordinate) {
                    return candidateSrcCoordinate;
                }
            }
        }
        return -1
    }

    findPossibleMoves(playerType, pieceType, srcCoordinate) {
        switch(pieceType) {
            case 'bishop':
                return this.findPossibleBishopMoves(srcCoordinate);
            case 'knight':
                return this.findPossibleKnightMoves(srcCoordinate);
            case 'rook':
                return this.findPossibleRookMoves(srcCoordinate);
            case 'queen':
                return this.findPossibleQueenMoves(srcCoordinate);
            case 'king':
                return this.findPossibleKingMoves(srcCoordinate);
            default:
                return this.findPossiblePawnMoves(playerType, srcCoordinate);
        };
    }

    findPossibleBishopMoves(srcCoordinate) {}

    findPossibleKnightMoves(srcCoordinate) {}

    findPossibleRookMoves(srcCoordinate) {}

    findPossibleQueenMoves(srcCoordinate) {}

    findPossibleKingMoves(srcCoordinate) {}
    
    findPossiblePawnMoves(playerType, srcCoordinate) {
        const file = srcCoordinate[0];
        let rank = srcCoordinate[1];
        
        let count = 2
        const possibleMoves = [];
        while (count > 0 && rank < masterConfig.boardSize && rank > 0) {
            if (playerType == playerTypes.white) {
                rank++;
            }
            else {
                rank--;
            }
            count--;
            possibleMoves.push(`${file}${rank}`);
        }
        return possibleMoves;
    }

    parseMove(move) {
        return move.length == 2 
            ? ['pawn', move]
            : [this.letterToPiece[move[0]], move.substring(1)];
    };

    letterToPiece = {
        "K": "king",
        "Q": "queen",
        "N": "knight",
        "B": "bishop",
        "R": "rook"
    };

    clearCell(position) {
        const cellElement = document.getElementById(position);
        const imgElement = cellElement.getElementsByTagName('img');
        
        cellElement.removeChild(imgElement[0]);
        cellElement.removeAttribute('piece-type');
    };

    renderCell(piece, position) {
        const imgPath = pieceImages[piece]
        
        const imgElement = document.createElement('img');
        imgElement.src = imgPath;
        imgElement.classList.add('piece');
        
        const cellElement = document.getElementById(position);
        cellElement.appendChild(imgElement);
        cellElement.setAttribute('piece-type', piece);
    };
};