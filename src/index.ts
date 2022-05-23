"use strict";

const canvasSize = 600;
const boardContainer = document.getElementById('chess-board-container') as HTMLElement;
const lightColorInput = document.getElementById('lightColor') as HTMLInputElement;
const darkColorInput = document.getElementById('darkColor') as HTMLInputElement;
const imgDirPath = '../images';

class Piece{
    static typeID: {[piece: string]: number} = {'pawn': 0, 'rook': 1, 'knight': 2, 'bishop': 3, 'queen': 4, 'king': 5};
    static images: {[piece: string]: HTMLImageElement} | null = null;

    static getNames(): string[] {
        const names: string[] = [];
        ['white_', 'black_'].forEach(color => {
            Object.keys(Piece.typeID).forEach(piece => names.push(color + piece));
        });
        return names;
    }

    static loadImages(dirPath: string): void{
        const names = Piece.getNames();
        var images: {[name: string]: HTMLImageElement} = {};
        names.forEach(name => {
            const img = new Image();
            img.src = `${dirPath}/${name}.svg`;
            images[name] = img;
        })
        Piece.images = images;
    }

    private color: boolean;
    private type: number;

    constructor(color: boolean, type: string){
        this.color = color;
        this.type = Piece.typeID[type];
        if (Piece.images == null){
            Piece.loadImages(imgDirPath);
        }
    }

    getType(): string{
        return Object.keys(Piece.typeID)[this.type];
    }
    getName(): string{
        return ((this.color)?'white_':'black_') + this.getType();
    }
    getImage(): HTMLImageElement{
        if (Piece.images == null){
            Piece.loadImages(imgDirPath);
        }else
            return Piece.images[this.getName()];
    }
}

class Board{
    static defautSize = 8;
    static lightColor = lightColorInput.value as string;
    static darkColor = darkColorInput.value as string;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private size: number;
    private pieces: {[index: number]: Piece} = {};

    constructor(container: HTMLElement, width: number, size?: number){
        this.width = width;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.width;
        this.canvas.id = 'board';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.size = size ?? Board.defautSize;
        this.pieces[1] = new Piece(true, 'king')
        this.drawBoard();
        this.drawPieces();
    }

    drawBoard(): void{
        let squareSize = this.width / this.size;
        for (let column = 0; column < this.size;column++){
            for (let row = 0;row < this.size;row++){
                this.ctx.fillStyle = ((row + column) % 2 == 0)?Board.lightColor:Board.darkColor;
                this.ctx.fillRect(column * squareSize, row * squareSize, squareSize, squareSize);
            }
        }
    }

    drawPieces(): void{
        Object.keys(this.pieces).forEach(index => {
            var squareSize = this.width / this.size;
            var row: number, column: number;
            [row, column] = this.indexToCoord(parseInt(index));
            const piece = this.pieces[parseInt(index)];
            const img = piece.getImage();
            this.ctx.drawImage(img, column * squareSize, row * squareSize, squareSize, squareSize);
        })
    }

    indexToCoord(index: number): [number, number]{
        const row = Math.floor(index / this.size);
        const column = index % this.size;
        return [row, column];
    }

    update(): void{

        Board.lightColor = lightColorInput.value as string;
        Board.darkColor = darkColorInput.value as string;
        this.drawBoard();
        this.drawPieces();
    }
}

const board = new Board(boardContainer, canvasSize);
lightColorInput.addEventListener('change', board.update);
darkColorInput.addEventListener('input', board.update);