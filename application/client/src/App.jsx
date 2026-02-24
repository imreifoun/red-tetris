import { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { new_board, setup } from './redux/slice'
import SetupUI from './components/SetupUI'
import PlayersUI from './components/PlayersUI'
import { getNew } from './dev-only/pieces-dev'
import { useRef } from 'react'
import { clearLines, insertPiece, isValidMove } from '../../common/logic'

function TetrisUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">

      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white flex flex-row  border-2 shadow-lg ">  
			<div className='w-16 border bg-black flex justify-center items-center'>
				<img src="/game.svg" alt="game icon" className="w-10 h-10" />
			</div>
			<div>
				<div className="flex items-center gap-4 m-2">
					<h1 className="text-2xl font-semibold tracking-wide">TETRIS</h1>
				</div>

				<p className="text-gray-700 text-sm mx-2 mb-2 text-center">
					ROOM ID : <span className="text-gray-950 font-bold">#367363</span>
				</p>
			</div>
		</div>
      </div>

      {/* Main game area */}
      <div className="flex flex-row gap-8">

        {/* Game board */}
        <div className="bg-white/5 border border-white/20 p-2 rounded-lg shadow-lg">
          <div className="grid grid-rows-20 grid-cols-10 gap-[1px] bg-black rounded">
            {/* Generate Tetris grid dynamically or placeholder */}
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-black border border-white/10"
              />
            ))}
          </div>
        </div>

	
        <div className="flex flex-col gap-6">

			<div className="bg-black border-2 border-black p-4 shadow-md text-center">
				<h2 className="font-bold mb-2 text-white border-2">Next</h2>
				<div className="w-24 h-24 bg-black mx-auto flex justify-center items-center rounded">
				{/* Next piece grid */}
				</div>
			</div>

			<div className="bg-black border-2 border-black p-4 shadow-md text-center">
				<h2 className="font-bold mb-2 text-white border-2">Score</h2>
				<p className="text-xl font-bold text-white">0</p>
			</div>

			<div className="bg-black border-2 border-black text-white p-4 shadow-md text-center">
				<p>Arrow keys → Move</p>
				<p>↑ → Rotate</p>
				<p>↓ → Soft drop</p>
				<p>Space → Hard drop</p>
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

	const Movement = ({ dx, dy }) => {
		const newX = positionRef.current.x + dx
		const newY = positionRef.current.y + dy

		if (isValidMove(board, Pies.shape, newX, newY)) {
			positionRef.current = { x: newX, y: newY }
			setPosition(positionRef.current) 
		} else {
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
				return 
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
		<div className='board'>
			{board.map((rows, y) => (
				<div key={y} className='flex justify-center items-center'>
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
							color = cell // saved block
						}

						if (isPiece) {
							color = Pies.color // falling piece overrides
						}

						return (
							<div
							key={x}
							style={{ backgroundColor: color }}
							className="h-6 w-6 border border-white"
							></div>
						)
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
		<div className="p-4">
			<h1>ROOM ID: {room}</h1>
			<h1>PLAYER ID: {username}</h1>
			<BoarderUI/>
			
		</div>
	)
}

//http://localhost:5173/#123@areifoun

export default App
