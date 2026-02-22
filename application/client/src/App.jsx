import { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { setup } from './redux/slice'
import SetupUI from './components/SetupUI'
import PlayersUI from './components/PlayersUI'

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

function BoarderUI (){
	const {board} = useSelector(state => state.game)
	return (
		<div className='board'>
			{board.map((rows, y) => (
				<div key={y} className='flex justify-center items-center'>
					{rows.map((col, x) => (
						<div key={x} className={`h-6 w-6 bg-white border`}>

						</div>
					))}
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
		return <BoarderUI />
	
	
	return (
		<div className="p-4">
			<h1>ROOM ID: {room}</h1>
			<h1>PLAYER ID: {username}</h1>
			<PlayersUI/>
			
		</div>
	)
}

//http://localhost:5173/#123@areifoun

export default App
