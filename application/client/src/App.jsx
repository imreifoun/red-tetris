import { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { new_board, setup } from './redux/slice'
import SetupUI from './components/SetupUI'
import SidePanelUI from './components/PlayersUI'
import { getNew } from './dev-only/pieces-dev'
import { useRef } from 'react'
import { clearLines, insertPiece, isValidMove, rotate } from '../../common/logic'

function TetrisUI() {

	return (
		<div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 ">

		{/* MAIN */}
		<div className="flex gap-10">

			{/* BOARD */}
			<div className="bg-gray-900 border-gray-500 border  shadow-2xl backdrop-blur-md">
				<BoarderUI/>
			</div>

			{/* SIDE PANEL */}
			<div className="flex flex-col gap-6 w-52">

				{/* HEADER */}
				<div className="flex items-center gap-4  border border-white/10 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
					<div className="w-14 h-14 bg-back text-black flex items-center justify-center rounded-lg">
						<img src="/game.svg" alt="game icon" className="w-8 h-8" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-widest">TETRIS</h1>
						<p className="text-xs text-white/50">
							ROOM ID: <span className="text-white font-semibold">#367363</span>
						</p>
					</div>
				</div>


				{/* NEXT */}
				<div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg">
					<h2 className="text-sm uppercase tracking-wider text-white/60 mb-2">Next</h2>
					<div className="w-24 h-24 bg-black border border-white/10 mx-auto rounded flex items-center justify-center" />
				</div>

				{/* SCORE */}
				<div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center backdrop-blur-md shadow-lg">
					<h2 className="text-sm uppercase tracking-wider text-white/60">Score</h2>
					<p className="text-3xl font-bold mt-2">0</p>
				</div>

				{/* CONTROLS */}
				<div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-white/70 backdrop-blur-md shadow-lg space-y-1">
					<p>← → Move</p>
					<p>↑ Rotate</p>
					<p>↓ Soft drop</p>
					<p>Space Hard drop</p>
				</div>

			</div>
		</div>
		</div>
	)
}


const POS_X = 3
const POS_Y = 0

function BoarderUI (){
	const dispatch = useDispatch();
	const started = true
	const {board, stack} = useSelector(state => state.game)
	const [Pies, SetPies] = useState(getNew())

	const positionRef = useRef({ x: POS_X, y: POS_Y })
	const [position, setPosition] = useState({ x: POS_X, y: POS_Y })

	const reInit = () => {
		SetPies(getNew())
		positionRef.current = { x: POS_X, y: POS_Y }
		setPosition(positionRef.current)
	}

	const Movement = ({ dx, dy }) => {
		const newX = positionRef.current.x + dx
		const newY = positionRef.current.y + dy

		if (isValidMove(board, Pies.shape, newX, newY)) {
			positionRef.current = { x: newX, y: newY }
			setPosition(positionRef.current) 
		} else if (isValidMove(board, Pies.shape, positionRef.current.x, newY)){
			positionRef.current = { x: positionRef.current.x, y: newY }
			setPosition(positionRef.current) 
		}
		else{
			const placedBoard = insertPiece(board, Pies.shape, positionRef.current.x, positionRef.current.y, Pies.color)
			const { board: clearedBoard } = clearLines(placedBoard)
			
			dispatch(new_board({ board: clearedBoard }))
			SetPies(getNew())

			positionRef.current = { x: POS_X, y: POS_Y }
			setPosition(positionRef.current)
		}
	}
	
	const handleMovement = (event) => {
		switch(event.key){
			case 'ArrowLeft':
				return Movement({dx: -1, dy: 0})
			case 'ArrowRight':
				return Movement({dx: 1, dy: 0})
			case 'ArrowDown':
				return Movement({dx: 0, dy: 1})
			case 'ArrowUp':
				const rotation = rotate(Pies.shape)
				if (isValidMove(board, rotation, positionRef.current.x, positionRef.current.y))
					SetPies((prev) => ({...prev, shape : rotation}))
				return

			case ' ': 
				while (isValidMove(board, Pies.shape, positionRef.current.x, positionRef.current.y + 1)) {
					positionRef.current.y += 1;
					setPosition(positionRef.current)
				}
				const placedBoard = insertPiece(board, Pies.shape, positionRef.current.x, positionRef.current.y, Pies.color)
				const { board: clearedBoard } = clearLines(placedBoard)
				dispatch(new_board({ board: clearedBoard }))

				return reInit()

		}
	}	
		
	const LOOP = useRef(null)

	const handleMovementRef = useRef(handleMovement)

	useEffect(() => {
		handleMovementRef.current = handleMovement
	})

	useEffect(() => {
		const handler = (e) => handleMovementRef.current(e)

		window.addEventListener('keydown', handler)

		return () => window.removeEventListener('keydown', handler)
	}, [])


	const MovementRef = useRef(Movement)

	useEffect(() => { MovementRef.current = Movement })

	useEffect(() => {
		if (!started) return

		LOOP.current = setInterval(() => {
			MovementRef.current({ dx: 0, dy: 1 })
		}, 1000)

		return () => clearInterval(LOOP.current)
	}, [])

	return (
		<div className=''>
			{board.map((rows, y) => (
				<div key={y} className='flex justify-center items-center '>
					{rows.map((cell, x) => {
						const py = y - position.y
						const px = x - position.x

						const isPiece =
							py >= 0 &&
							px >= 0 &&
							py < Pies.shape.length &&
							px < Pies.shape[0].length &&
							Pies.shape[py][px]

						let color = 'black'

						if (cell !== 0) {
							color = cell
						}

						if (isPiece) {
							color = Pies.color
						}

						return (<div key={x} style={{ backgroundColor: color, border: '1px solid rgba(255,255,255,0.03)' }} className="h-[30px] w-[30px] border-black "></div>)
					})}

				</div>
			))}
		</div>
	)
}

function App() {

	const dispatch = useDispatch()
	const {room, username, board, players, started} = useSelector(state => state.game)

	useEffect(() => {
		const hash = window.location.hash
		const matched = hash.match(/^#(\d+)@([a-zA-Z]+)$/)
		if (matched)
		{
			dispatch(setup({room: matched[1], username: matched[2]}))
			dispatch({type: 'socket/connect'})
			dispatch({type: 'socket/join', payload : {room: matched[1], username: matched[2]}})
			
		}

	}, [dispatch])

	if (!room || ! username)
		return <SetupUI />
	
	
	const handleStart = () => {
		dispatch({ type: 'socket/start', payload: { room } });
	};


	return (
		<div className=''>
			<TetrisUI/>
		</div>	
	)
}

//http://localhost:5173/#123@areifoun
/*
<h1>ROOM ID: {room}</h1>
<h1>PLAYER ID: {username}</h1>
<TetrisUI/>
*/

export default App
