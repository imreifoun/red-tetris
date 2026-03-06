import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	in_rotation,
	loser,
	new_board,
	new_piece,
	new_spec
} from "../redux/slice";

import {
	clearLines,
	getSpectrum,
	insertPiece,
	isValidMove,
	rotate
} from "../../../common/logic";

const POS_X = 3;
const POS_Y = 0;

export default function BoarderUI() {

	const dispatch = useDispatch();
	const { loss, score, room, board, stack, piece, started } = useSelector((state) => state.game);

	const [position, setPosition] = useState({ x: POS_X, y: POS_Y });

	const loopRef = useRef(null);
	const movementRef = useRef(null);

	const currentPiece = stack[piece];

	useEffect(() => {
		if (!started || loss || !currentPiece?.shape) return;
		const canSpawn = isValidMove(board, currentPiece.shape, POS_X, POS_Y);
		if (!canSpawn) dispatch(loser());

		const spec = getSpectrum(board);
		dispatch(new_spec({ spec }));
		dispatch({type: "socket/status", payload: { room, spec, score: score }});
	}, [board, started]);

	const reInit = (finalX = position.x, finalY = position.y) => {
		if (!started || loss || !currentPiece?.shape) return;

		const placedBoard = insertPiece(board, currentPiece.shape, finalX, finalY, currentPiece.color);

		const { board: clearedBoard, cleared, score: gainedScore } = clearLines(placedBoard);

		dispatch(new_board({ board: clearedBoard, score: gainedScore }));

		if (gainedScore > 0) {
			const spec = getSpectrum(clearedBoard);

			dispatch(
				{
					type: "socket/status",
					payload: {
						room,
						spec,
						score: score + gainedScore
					}
				}
			);
		}

		if (cleared > 1) {
			dispatch({
				type: "socket/penalty",
				payload: { room, count: cleared - 1 }
			});
		}

		dispatch(new_piece());

		setPosition({ x: POS_X, y: POS_Y });

		dispatch({
			type: "socket/more",
			payload: { room }
		});
	};

	const movement = ({ dx, dy }) => {
		if (!started || loss || !currentPiece?.shape) return;

		const newX = position.x + dx;
		const newY = position.y + dy;

		if (isValidMove(board, currentPiece.shape, newX, newY)) {
			setPosition({ x: newX, y: newY });
		} else if (isValidMove(board, currentPiece.shape, position.x, newY)) {
			setPosition({ x: position.x, y: newY });
		} else {
			reInit();
		}
	};


	movementRef.current = movement;
	
	const handleKey = (event) => {
		if (!started || loss || !currentPiece?.shape) return;
		
		switch (event.key) {
			case "ArrowLeft":
				movementRef.current({ dx: -1, dy: 0 });
				break;

			case "ArrowRight":
				movementRef.current({ dx: 1, dy: 0 });
				break;

			case "ArrowDown":
				movementRef.current({ dx: 0, dy: 1 });
				break;

			case "ArrowUp":
				const rotated = rotate(currentPiece.shape);
				if (isValidMove(board, rotated, position.x, position.y)) {
					dispatch(
						in_rotation({
							shape: rotated,
							current: piece
						})
					);
				}
				break;


			case " ": {
				let finalY = position.y;

				while (isValidMove(board, currentPiece.shape, position.x, finalY + 1)) {
					finalY++;
				}

				reInit(position.x, finalY);

				break;
			}


			default:
				break;
		}
	};

	const keyHandlerRef = useRef(null);
	keyHandlerRef.current = handleKey;

	useEffect(() => {
		if (!started || loss) return;

		const handler = (e) => keyHandlerRef.current(e);

		window.addEventListener("keydown", handler);

		return () => {
			window.removeEventListener("keydown", handler);
		};
	}, [started]);

	useEffect(() => {

		if (!started || loss) return;

		loopRef.current = setInterval(() => {
			movementRef.current?.({ dx: 0, dy: 1 });
		}, 1000);

		return () => {
			if (loopRef.current) {
				clearInterval(loopRef.current);
			}
		};

	}, [started, loss]);


	return (
		<div>
			{board.map((row, y) => (
				<div key={y} className="flex justify-center items-center">
					{row.map((cell, x) => {
						const py = y - position.y;
						const px = x - position.x;

						const shape = currentPiece?.shape;

						const isPiece =
							shape &&
							py >= 0 &&
							px >= 0 &&
							py < shape.length &&
							px < shape[0].length &&
							shape[py][px];

						let color = "black";

						if (cell !== 0) color = cell;
						if (isPiece) color = currentPiece?.color;

						return (<div key={x} style={{ backgroundColor: color }} className="h-8 w-8 border border-white/5" />);
					})}
				</div>
			))}
		</div>
	);
}
