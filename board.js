import { masterConfig } from './config/master.config.js'
import { gameSetupType, gameSetups } from './config/gameSetups.config.js';
import { pieceImages as pieceImages } from './config/pieceImages.config.js';

export class Board {
    constructor() { };

    renderPieces() {
        let setupType = masterConfig.useInitialGame ? gameSetupType.initialGame : gameSetupType.otherGame;
        let setup = gameSetups[setupType];

        this.placePiecesInPosition(setup);
    };

    placePiecesInPosition(gameSetup) {
        for (const coordinate in gameSetup) {
            const pieceType = gameSetup[coordinate];
            const pieceImgPath = pieceImages[pieceType];
            
            const imgElement = document.createElement('img');
            imgElement.src = pieceImgPath;
            imgElement.classList.add('piece');

            document.getElementById(coordinate).appendChild(imgElement);
        }
    };
};