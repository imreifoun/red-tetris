import { PIECES } from "../../common/logic";

export class Piece{
    constructor(type){
        this.type = type
        this.shape = PIECES[type].shape
        this.color = PIECES[type].color
        let flip = Math.floor(Math.random() * 2)
        if (flip){
            let range =  Math.floor(Math.random() * 5)
            for (let i = 0; i < range; i++){
                this.shape = rotate(this.shape)
            }
        }

    }
    static randomPiece(){
        const types = Object.keys(PIECES)
        return types[Math.floor(Math.random() * types.length)]
    }
}