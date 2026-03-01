import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { in_rotation, loser, new_board, new_piece, new_spec } from "../redux/slice";
import { clearLines, getSpectrum, insertPiece, isValidMove, rotate } from "../../../common/logic";

const POS_X = 3
const POS_Y = 0

export default function BoarderUI (){
	const dispatch = useDispatch();
	const {loss,score, room, board, stack, piece, started} = useSelector(state => state.game)


	const positionRef = useRef({ x: POS_X, y: POS_Y })
	const [position, setPosition] = useState({ x: POS_X, y: POS_Y })
	const [presistance, setPresistance] = useState(0)

	useEffect(() => {
		
		if (!started || loss) return

		const currentPiece = stack[piece]
		if (!currentPiece?.shape) return

		const canSpawn = isValidMove(board, currentPiece.shape, POS_X, POS_Y)

		if (!canSpawn) {
			dispatch(loser())
		}
	}, [board])


	const reInit = () => {
		if (!loss && started)
		{
			const placedBoard = insertPiece(board, stack[piece]?.shape, positionRef.current.x, positionRef.current.y, stack[piece]?.color)
			const { board: clearedBoard, cleared , score: in_score  } = clearLines(placedBoard)
			dispatch(new_board({ board: clearedBoard, score: in_score }))
			if (in_score > 0)
				dispatch({type: 'socket/status', payload : {room: room, spec: getSpectrum(clearedBoard), score: score + in_score}})
			console.log('cleared : ', cleared)
			if (cleared > 1)
			{
				console.log('cleared 2 : ', cleared)
        		dispatch({ type: 'socket/penalty', payload: { room, count: cleared - 1 }});
			}

			dispatch(new_piece({}))
			positionRef.current = { x: POS_X, y: POS_Y }
			setPosition(positionRef.current)
			dispatch({type: 'socket/more', payload : {room}})
		}

	}

	const Movement = ({ dx, dy }) => {
		if (!loss && started)
		{
			const currentPiece = stack[piece]
			if (!currentPiece?.shape) return
	
			const newX = positionRef.current.x + dx
			const newY = positionRef.current.y + dy
	
			if (isValidMove(board, stack[piece]?.shape, newX, newY)) {
				positionRef.current = { x: newX, y: newY }
				setPosition(positionRef.current) 
			} else if (isValidMove(board, stack[piece]?.shape, positionRef.current.x, newY)){
				positionRef.current = { x: positionRef.current.x, y: newY }
				setPosition(positionRef.current) 
			}
			else{
				reInit()
			}
		}
	}
	
	const handleMovement = (event) => {
		if (!loss && started)
		{

			switch(event.key){
				case 'ArrowLeft':
					return Movement({dx: -1, dy: 0})
				case 'ArrowRight':
					return Movement({dx: 1, dy: 0})
				case 'ArrowDown':
					return Movement({dx: 0, dy: 1})
				case 'ArrowUp': 
					const rotation = rotate(stack[piece]?.shape)
					if (isValidMove(board, rotation, positionRef.current.x, positionRef.current.y))
						dispatch(in_rotation({ shape: rotation, current: piece }))
					return
	
				case ' ': 
					while (isValidMove(board, stack[piece]?.shape, positionRef.current.x, positionRef.current.y + 1)) {
						positionRef.current.y += 1;
						setPosition(positionRef.current)
					}
					return reInit()
	
			}
		}
	}	
		
	const LOOP = useRef(null)

	const handleMovementRef = useRef(handleMovement)

	useEffect(() => {
		if (!loss && started) handleMovementRef.current = handleMovement
	})

	useEffect(() => {
		if (!loss && started)
		{
			const handler = (e) => handleMovementRef.current(e)
			window.addEventListener('keydown', handler)
			return () => window.removeEventListener('keydown', handler)
		}
	}, [started, loss])


	const MovementRef = useRef(Movement)

	useEffect(() => { MovementRef.current = Movement })

	useEffect(() => {
		dispatch(new_spec({spec: getSpectrum(board)}))
		dispatch({type: 'socket/status', payload : {room: room, spec: getSpectrum(board), score: 0}})
	}, [board])

	useEffect(() => {
		if (!loss && started)
		{
			LOOP.current = setInterval(() => {
				MovementRef.current({ dx: 0, dy: 1 })
			}, 1000)
	
			return () => clearInterval(LOOP.current)
		}
	}, [started, loss])

	return (
		<div className=''>
			{board.map((rows, y) => (
				<div key={y} className='flex justify-center items-center '>
					{rows.map((cell, x) => {
						const py = y - position.y
						const px = x - position.x

						const currentPiece = stack[piece]
						const shape = currentPiece?.shape

						const isPiece =
							shape &&
							py >= 0 &&
							px >= 0 &&
							py < stack[piece]?.shape.length &&
							px < stack[piece]?.shape[0].length &&
							stack[piece]?.shape[py][px]

						let color = 'black'

						if (cell !== 0) {
							
							color = cell
						}

						if (isPiece) {
							color = stack[piece]?.color
						}
						

						return (<div key={x} style={{ backgroundColor: color, border: '1px solid rgba(255,255,255,0.03)' }} className="h-[35px] w-[35px] border-black "></div>)
					})}

				</div>
			))}
		</div>
	)
}