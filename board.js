import { masterConfig } from './config/master.config.js'
import { columnNumberToFile, fileToColumnNumber, letterToPiece, playerTypes, gameSetupType, gameSetups, moveType } from './config/gameSetups.config.js';
import { pieceImages } from './config/pieceImages.config.js';

export class Board {
    constructor() {
        this.state = {
            currentPlayer: null,
            pieceCoordinates: {}
        };
    };

    render() {
        let setupType = masterConfig.useInitialGame 
            ? gameSetupType.initialGame 
            : gameSetupType.otherGame;
        let setup = gameSetups[setupType];
        
        this.placePieceBoxNumbers();
        this.placePiecesInCoordinates(setup);
        
        this.initializeState(setup);
        this.renderPlayerIndicator();
    };

    initializeState(setup) {
        this.state.currentPlayer = playerTypes.white;
        this.state.pieceCoordinates = this.initializePieceCoordinates(setup);
    }

    renderPlayerIndicator() {
        const playerIndicator = document.getElementById('player');
        playerIndicator.innerHTML = `It's ${this.state.currentPlayer.toUpperCase()}'s turn!`;
    }

    initializePieceCoordinates(setup) {
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
        this.addMoveInputListener();
    };

    addMoveSubmitButtonListener() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.addEventListener('click', () => {
            this.handleMoveSubmission();
        });
    };

    addMoveInputListener() {
        const input = document.getElementById('move');
        input.addEventListener('keyup', event => {
            if (event.key == 'Enter') {
                this.handleMoveSubmission();
            }
        });
    }

    handleMoveSubmission() {
        this.makeMove();
        this.prepareForNextMove();
    }

    makeMove() {
        const move = document.getElementById('move').value;
        const [pieceType, dstCoordinate] = this.parseMove(move);

        const srcCoordinate = this.findSrcCoordinate(pieceType, dstCoordinate);
        if (srcCoordinate === -1) {
            window.alert('Invalid move, try again.');
            return;
        }
        const fullPieceName = `${this.state.currentPlayer}_${pieceType}`;

        this.clearCell(srcCoordinate);
        this.clearCell(dstCoordinate);
        this.renderCell(fullPieceName, dstCoordinate);
        this.updateState();
        this.renderPlayerIndicator();
    };

    prepareForNextMove() {
        this.clearMoveInput();
    }

    updateState() {
        this.changeCurrentPlayer();
        this.updatePieceCoordinates();
    }

    clearMoveInput() {
        const move = document.getElementById('move');
        move.value = "";
        move.focus();
    }

    changeCurrentPlayer() {
        this.state.currentPlayer = this.state.currentPlayer == playerTypes.white 
            ? playerTypes.black 
            : playerTypes.white;
    }

    updatePieceCoordinates() {
        const pieceCoordinates = {};
        const cellElements = document.getElementsByClassName('cell');
        for (let cell of cellElements) {
            if (cell.hasAttribute('piece-type')) {
                const pieceType = cell.getAttribute('piece-type');
                const coordinate = cell.getAttribute('id');
                if (!pieceCoordinates[pieceType]) {
                    pieceCoordinates[pieceType] = [coordinate];
                }
                else {
                    pieceCoordinates[pieceType].push(coordinate);
                }
            }
        }
        this.state.pieceCoordinates = pieceCoordinates;
    }

    findSrcCoordinate(pieceType, dstCoordinate) {
        const fullPieceName = `${this.state.currentPlayer}_${pieceType}`;
        const candidateSrcCoordinates = this.state.pieceCoordinates[fullPieceName];
        return this.findValidSrcCoordinate(candidateSrcCoordinates, dstCoordinate, pieceType);
    }

    findValidSrcCoordinate(candidateSrcCoordinates, dstCoordinate, pieceType) {
        for (let candidateSrcCoordinate of candidateSrcCoordinates) {
            const possibleMoves = this.findPossibleMoves(pieceType, candidateSrcCoordinate);
            for (let move of possibleMoves) {
                if (move === dstCoordinate) {
                    return candidateSrcCoordinate;
                }
            }
        }
        return -1
    }

    findPossibleMoves(pieceType, srcCoordinate) {
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
                return this.findPossiblePawnMoves(srcCoordinate);
        };
    }

    findPossibleBishopMoves(srcCoordinate) {
        return this.findDiagonalMoves(srcCoordinate);
    }

    findPossibleKnightMoves(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        const currentRank = srcCoordinate[1];

        const allPossibleMoves = [
            `${columnNumberToFile[fileToColumnNumber[currentFile]-2]}${parseInt(currentRank)+1}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]-1]}${parseInt(currentRank)+2}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]+1]}${parseInt(currentRank)+2}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]+2]}${parseInt(currentRank)+1}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]+2]}${parseInt(currentRank)-1}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]+1]}${parseInt(currentRank)-2}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]-1]}${parseInt(currentRank)-2}`,
            `${columnNumberToFile[fileToColumnNumber[currentFile]-2]}${parseInt(currentRank)-1}`
        ];

        return allPossibleMoves.filter(move => this.isCoordinateOnBoard(move) && (!this.cellContainsPiece(move) || this.cellContainsOpponentPiece(move)));
    }

    findPossibleRookMoves(srcCoordinate) {
        return [...this.findLateralMoves(srcCoordinate), ...this.findVerticalMoves(srcCoordinate)];
    }

    findPossibleQueenMoves(srcCoordinate) {
        return [...this.findLateralMoves(srcCoordinate), ...this.findVerticalMoves(srcCoordinate), ...this.findDiagonalMoves(srcCoordinate)];
    }

    findPossibleKingMoves(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        const currentRank = srcCoordinate[1];

        const possibleMoves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

        for (let [f, r] of directions) {
            const move = this.createCoordinate(columnNumberToFile[fileToColumnNumber[currentFile]+f], parseInt(currentRank)+r);
            if (this.isCoordinateOnBoard(move) && (!this.cellContainsPiece(move) || this.cellContainsOpponentPiece(move))) {
                possibleMoves.push(move);
            }
        }

        return possibleMoves;
    }
    
    findPossiblePawnMoves(srcCoordinate) {
        return this.state.currentPlayer == playerTypes.white 
            ? this.findPossiblePawnMovesForWhite(srcCoordinate)
            : this.findPossiblePawnMovesForBlack(srcCoordinate);
    }

    findPossiblePawnMovesForWhite(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        let currentRank = srcCoordinate[1];

        const possibleMoves = [];

        const oneForward = `${currentFile}${parseInt(currentRank)+1}`;
        const twoForward = `${currentFile}${parseInt(currentRank)+2}`;
        if (this.isValidPawnMove(oneForward)) {
            possibleMoves.push(oneForward);
            if (this.isValidPawnMove(twoForward) && parseInt(currentRank) === 2) {
                possibleMoves.push(twoForward);
            }
        }

        const eatLeft = `${columnNumberToFile[fileToColumnNumber[currentFile]-1]}${parseInt(currentRank)+1}`;
        if (this.isValidPawnTake(eatLeft)) {
            possibleMoves.push(eatLeft)
        }

        const eatRight = `${columnNumberToFile[fileToColumnNumber[currentFile]+1]}${parseInt(currentRank)+1}`;
        if (this.isValidPawnTake(eatRight)) {
            possibleMoves.push(eatRight);
        }

        return possibleMoves;
    }

    findPossiblePawnMovesForBlack(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        let currentRank = srcCoordinate[1];

        const possibleMoves = [];

        const oneForward = `${currentFile}${parseInt(currentRank)-1}`;
        const twoForward = `${currentFile}${parseInt(currentRank)-2}`;
        if (this.isValidPawnMove(oneForward)) {
            possibleMoves.push(oneForward);
            if (this.isValidPawnMove(twoForward) && parseInt(currentRank) === masterConfig.boardSize - 1) {
                possibleMoves.push(twoForward);
            }
        }

        const eatLeft = `${columnNumberToFile[fileToColumnNumber[currentFile]-1]}${parseInt(currentRank)-1}`;
        if (this.isValidPawnTake(eatLeft)) {
            possibleMoves.push(eatLeft)
        }

        const eatRight = `${columnNumberToFile[fileToColumnNumber[currentFile]+1]}${parseInt(currentRank)-1}`;
        if (this.isValidPawnTake(eatRight)) {
            possibleMoves.push(eatRight);
        }

        return possibleMoves;
    }

    isValidPawnMove(coordinate) {
        return this.isCoordinateOnBoard(coordinate) && !this.cellContainsPiece(coordinate);
    }

    isValidPawnTake(coordinate) {
        return this.isCoordinateOnBoard(coordinate) && this.cellContainsPiece(coordinate) && this.cellContainsOpponentPiece(coordinate);
    }

    findLateralMoves(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        const currentRank = srcCoordinate[1];

        const moves = [];
        
        let f = fileToColumnNumber[currentFile] - 1;
        let move = this.createCoordinate(columnNumberToFile[f], currentRank);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[--f], currentRank);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        f = fileToColumnNumber[currentFile] + 1;
        move = this.createCoordinate(columnNumberToFile[f], currentRank);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[++f], currentRank);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        return moves;
    }

    findVerticalMoves(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        const currentRank = srcCoordinate[1];

        const moves = [];

        let r = parseInt(currentRank) - 1;
        let move = this.createCoordinate(currentFile, r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(currentFile, --r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        r = parseInt(currentRank) + 1;
        move = this.createCoordinate(currentFile, r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(currentFile, ++r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        return moves;
    }

    findDiagonalMoves(srcCoordinate) {
        const currentFile = srcCoordinate[0];
        const currentRank = srcCoordinate[1];

        const moves = [];

        let f = fileToColumnNumber[currentFile] - 1;
        let r = parseInt(currentRank) + 1;
        let move = this.createCoordinate(columnNumberToFile[f], r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[--f], ++r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        f = fileToColumnNumber[currentFile] - 1;
        r = parseInt(currentRank) - 1;
        move = this.createCoordinate(columnNumberToFile[f], r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[--f], --r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        f = fileToColumnNumber[currentFile] + 1;
        r = parseInt(currentRank) + 1;
        move = this.createCoordinate(columnNumberToFile[f], r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[++f], ++r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        f = fileToColumnNumber[currentFile] + 1;
        r = parseInt(currentRank) - 1;
        move = this.createCoordinate(columnNumberToFile[f], r);
        while (this.isCoordinateOnBoard(move) && !this.cellContainsPiece(move)) {
            moves.push(move);
            move = this.createCoordinate(columnNumberToFile[++f], --r);
        }

        if (this.isCoordinateOnBoard(move) && this.cellContainsPiece(move) && this.cellContainsOpponentPiece(move)) {
            moves.push(move);
        }

        return moves;
    }

    isCoordinateOnBoard(coordinate) {
        const file = coordinate[0];
        const rank = coordinate[1];
        return fileToColumnNumber[file] && rank >= 1 && rank <= masterConfig.boardSize;
    }

    cellContainsPiece(coordinate) {
        const cell = document.getElementById(coordinate);
        if (cell) {
            return cell.hasAttribute('piece-type');
        }
        return -1;
    }

    cellContainsOpponentPiece(coordinate) {
        const opponentColour = this.state.currentPlayer == playerTypes.white
            ? playerTypes.black
            : playerTypes.white;

        const cell = document.getElementById(coordinate);
        if(cell) {
            return cell.getAttribute('piece-type')[0] == opponentColour[0];
        }
        return -1;
    }

    parseMove(move) {
        return move.length == 2 
            ? ['pawn', move]
            : [letterToPiece[move[0].toUpperCase()], move.substring(1).toLowerCase()];
    };
    
    clearCell(position) {
        const cellElement = document.getElementById(position);
        const imgElement = cellElement.getElementsByTagName('img');
        
        if (imgElement.length > 0) {
            cellElement.removeChild(imgElement[0]);
        }
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

    createCoordinate(file, rank) {
        return `${file}${rank}`;
    }
};