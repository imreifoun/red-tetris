export class Player{
    constructor(id, username){
        this.id = id
        this.username = username
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