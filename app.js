import { Game } from './game.js';

// main driver code for our application, this is run in the GLOBAL SCOPE
main();

function main() {
    // create a Game and start it
    const game = new Game();
    game.start();
}