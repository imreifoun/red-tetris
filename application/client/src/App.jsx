import { useEffect } from 'react'
import { setup } from './redux/slice'
import {useDispatch, useSelector} from 'react-redux'

import SetupUI from './components/SetupUI'
import PlayersUI from './components/PlayersUI'
import BoarderUI from './components/BoarderUI'
import GameOverUI from './components/GameOverUI'
import NextShapeUI from './components/NextShapeUI'


function TetrisUI() {

	const {room, game_over, spec, score} = useSelector(state => state.game)

	useEffect(()=> {}, [game_over, spec, score])
	
	return (
		<div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 ">
		
		{game_over && <GameOverUI/>}

		{/* MAIN */}
		<div className="flex gap-12">

			<div className=''>
				<PlayersUI/>
			</div>

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
							ROOM ID: <span className="text-white font-semibold">#{room}</span>
						</p>
					</div>
				</div>


				{/* NEXT */}
				<div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg">
					<h2 className="text-sm uppercase tracking-wider text-white/60 mb-2">Next</h2>
					<NextShapeUI/>
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


function App() {

	const dispatch = useDispatch()
	const {room, username} = useSelector(state => state.game)

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
