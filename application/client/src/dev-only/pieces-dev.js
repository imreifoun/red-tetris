import { Piece } from "../../../server/structure/piece";

export function getNew() { return new Piece(Piece.randomPiece())}
