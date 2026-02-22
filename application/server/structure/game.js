import { Piece } from "./piece";

const IN_STACK = 20

export class Game{

    constructor(name){
        this.name = name
        this.stack = [];
        this.players = [];
        this.full = false;
        this.started = false;
    }

    newPlayer(player){
        if (this.players.length == 0) player.host = true
        this.players.push(player)
    }

    winnerPlayer() {
        const winner = this.players.filter(plyr => !plyr.lost)
        if (winner.length > 1) return winner[0]
        return null
    }

    deletePlayer(player){
        if (this.players.length > 0)
        {
            const position = this.players.findIndex(ply => ply.id === player)
            if (position !== -1)
            {
                const host = this.players[position].host
                if (host && this.players.length > 0) this.players[0].host = true
                this.players.splice(position, 1)
            }
        }
        return this.players.length
    }

    start(){
        this.stack = []
        this.generated(IN_STACK)
        this.players.forEach(plyr => plyr.reset())
        this.started = true
    }

    more() { while (IN_STACK >= this.stack.length){ this.generated(IN_STACK) } } 

    findPiece(index) { this.more(); return this.stack[index]}

    generated(seq) { for(let i = 0; i < seq; i++) { this.stack.push(new Piece(Piece.randomPiece()))} }
}