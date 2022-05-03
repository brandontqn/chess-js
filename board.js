import { masterConfig } from './config/master.config.js'
import { playerTypes, gameSetupType, gameSetups } from './config/gameSetups.config.js';
import { pieceImages } from './config/pieceImages.config.js';

export class Board {
    constructor() { };

    render() {
        let setupType = masterConfig.useInitialGame ? gameSetupType.initialGame : gameSetupType.otherGame;
        let setup = gameSetups[setupType];

        this.placePieceBoxNumbers();
        this.placePiecesInPosition(setup);
    };

    placePieceBoxNumbers() {
        const cells = document.getElementsByClassName('cell');
        for (let cell of cells) {
            const spanElement = document.createElement('span');
            spanElement.classList.add('cell-text');
            spanElement.innerHTML = cell.getAttribute('id');

            cell.append(spanElement);
        }
    };

    placePiecesInPosition(gameSetup) {
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
            const srcElement = document.getElementById('srcPos');
            const dstElement = document.getElementById('dstPos');

            const srcValue = srcElement.value;
            const dstValue = dstElement.value;
            const piece = document.getElementById(srcValue).getAttribute('piece-type');

            this.movePiece(piece, srcValue, dstValue);
        });
    };

    // parseMove(player, move) {
    //     const playerType = playerTypes.white ? player == playerTypes.white : playerTypes.black;
        
    //     if (move.length == 2) {
    //         const piece = `${playerType}_pawn`;
    //         return [piece, move];
    //     }
    //     else {
    //         const piece = `${playerType}_${this.letterToPiece[move[0]]}`;
    //         return [piece, move.substring(1)];
    //     }
    // };

    letterToPiece = {
        "K": "king",
        "Q": "queen",
        "N": "knight",
        "B": "bishop",
        "R": "rook"
    };

    movePiece(piece, srcPos, dstPos) {
        this.clearCell(srcPos);
        this.renderCell(piece, dstPos);
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