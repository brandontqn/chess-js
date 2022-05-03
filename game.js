import { Board } from "./board.js";

export class Game {
    constructor() {
        this.board = new Board();
    };

    start() {
        // once the DOM is loaded (i.e. the board inside index.html is loaded), render the chess pieces
        addEventListener('DOMContentLoaded', () => {
            console.log('Hello World!');
            this.board.renderPieces();
        });
    };
};