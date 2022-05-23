"use strict";
const canvasSize = 600;
const boardContainer = document.getElementById('chess-board-container');
const lightColorInput = document.getElementById('lightColor');
const darkColorInput = document.getElementById('darkColor');
const imgDirPath = '../images';
class Piece {
    constructor(color, type) {
        this.color = color;
        this.type = Piece.typeID[type];
        if (Piece.images == null) {
            Piece.loadImages(imgDirPath);
        }
    }
    static getNames() {
        const names = [];
        ['white_', 'black_'].forEach(color => {
            Object.keys(Piece.typeID).forEach(piece => names.push(color + piece));
        });
        return names;
    }
    static loadImages(dirPath) {
        const names = Piece.getNames();
        var images = {};
        names.forEach(name => {
            const img = new Image();
            img.src = `${dirPath}/${name}.svg`;
            images[name] = img;
        });
        Piece.images = images;
    }
    getType() {
        return Object.keys(Piece.typeID)[this.type];
    }
    getName() {
        return ((this.color) ? 'white_' : 'black_') + this.getType();
    }
    getImage() {
        if (Piece.images == null) {
            Piece.loadImages(imgDirPath);
        }
        else
            return Piece.images[this.getName()];
    }
}
Piece.typeID = { 'pawn': 0, 'rook': 1, 'knight': 2, 'bishop': 3, 'queen': 4, 'king': 5 };
Piece.images = null;
class Board {
    constructor(container, width, size) {
        this.pieces = {};
        this.width = width;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.width;
        this.canvas.id = 'board';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.size = size !== null && size !== void 0 ? size : Board.defautSize;
        this.pieces[1] = new Piece(true, 'king');
        this.drawBoard();
        this.drawPieces();
    }
    drawBoard() {
        let squareSize = this.width / this.size;
        for (let column = 0; column < this.size; column++) {
            for (let row = 0; row < this.size; row++) {
                this.ctx.fillStyle = ((row + column) % 2 == 0) ? Board.lightColor : Board.darkColor;
                this.ctx.fillRect(column * squareSize, row * squareSize, squareSize, squareSize);
            }
        }
    }
    drawPieces() {
        Object.keys(this.pieces).forEach(index => {
            var squareSize = this.width / this.size;
            var row, column;
            [row, column] = this.indexToCoord(parseInt(index));
            const piece = this.pieces[parseInt(index)];
            const img = piece.getImage();
            this.ctx.drawImage(img, column * squareSize, row * squareSize, squareSize, squareSize);
        });
    }
    indexToCoord(index) {
        const row = Math.floor(index / this.size);
        const column = index % this.size;
        return [row, column];
    }
    update() {
        Board.lightColor = lightColorInput.value;
        Board.darkColor = darkColorInput.value;
        this.drawBoard();
        this.drawPieces();
    }
}
Board.defautSize = 8;
Board.lightColor = lightColorInput.value;
Board.darkColor = darkColorInput.value;
const board = new Board(boardContainer, canvasSize);
lightColorInput.addEventListener('change', board.update);
darkColorInput.addEventListener('input', board.update);
