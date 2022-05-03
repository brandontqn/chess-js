export const playerTypes = {
    white: 'white',
    black: 'black'
}

export const gameSetupType = {
    initialGame: 'initialGame',
    otherGame: 'otherGame'
};

export const gameSetups = {
    initialGame: {
        'a8': 'black_rook',
        'b8': 'black_knight',
        'c8': 'black_bishop',
        'd8': 'black_queen',
        'e8': 'black_king',
        'f8': 'black_bishop',
        'g8': 'black_knight',
        'h8': 'black_rook',
        'a7': 'black_pawn',
        'b7': 'black_pawn',
        'c7': 'black_pawn',
        'd7': 'black_pawn',
        'e7': 'black_pawn',
        'f7': 'black_pawn',
        'g7': 'black_pawn',
        'h7': 'black_pawn',
        
        'a1': 'white_rook',
        'b1': 'white_knight',
        'c1': 'white_bishop',
        'd1': 'white_queen',
        'e1': 'white_king',
        'f1': 'white_bishop',
        'g1': 'white_knight',
        'h1': 'white_rook',
        'a2': 'white_pawn',
        'b2': 'white_pawn',
        'c2': 'white_pawn',
        'd2': 'white_pawn',
        'e2': 'white_pawn',
        'f2': 'white_pawn',
        'g2': 'white_pawn',
        'h2': 'white_pawn'
    },
    otherGame: {}
};

export const letterToPiece = {
    'K': 'king',
    'Q': 'queen',
    'N': 'knight',
    'B': 'bishop',
    'R': 'rook'
};

export const fileToColumnNumber = {
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7,
    'h': 8
}

export const columnNumberToFile = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
}

export const moveType = {
    move: 'move',
    take: 'take'
}