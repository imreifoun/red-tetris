import { rotate } from "../../common/logic";
import { Piece } from "./piece";

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
        this.generated(5)
        this.players.forEach(plyr => plyr.reset())
        this.started = true
    }


    generated(seq){
        let i = 0;
        while (i < seq){
            this.stack.push(new Piece(Piece.randomPiece()))
            i++;
        } 
    }
}