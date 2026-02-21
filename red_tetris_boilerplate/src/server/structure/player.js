export class Player{
    constructor(id, name){
        this.id = id
        this.name = name
        this.host = false
        this.lost = false
        this.ready = false
        this.board = null;
        this.spectrum = []
        this.piece = 0
    }
    reset(){
        this.piece = 0
        this.lost = false;
        this.board = null;
        this.spectrum = []
    }
}