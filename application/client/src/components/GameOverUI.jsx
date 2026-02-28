import { useDispatch, useSelector } from "react-redux"
import { on_game_over } from "../redux/slice"

export default function GameOverUI() {
	const dispatch = useDispatch()
	const { room } = useSelector(state => state.game)

	const handleExit = () => {
		window.location.hash = ''
		window.location.reload()
		dispatch(on_game_over({game_over: false}))
	}

	const handleWatch = () => {
		dispatch(on_game_over({game_over: false}))
	}

	return (
		<div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

			{/* CARD */}
			<div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl px-10 py-8 w-[320px] text-center">

				{/* TITLE */}
				<h1 className="text-3xl font-bold tracking-widest text-red-500 mb-2">
					GAME OVER
				</h1>

				<p className="text-white/60 text-sm mb-6">
					You lost. What do you want to do next?
				</p>

				{/* BUTTONS */}
				<div className="flex flex-col gap-3">

					{/* CONTINUE WATCHING */}
					<button
						onClick={handleWatch}
						className="bg-white/10 border border-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition"
					>
						👁 Continue Watching
					</button>

					{/* EXIT */}
					<button
						onClick={handleExit}
						className="text-red-400 border border-red-500/20 py-2 rounded-lg hover:bg-red-500/10 transition"
					>
						🚪 Exit
					</button>

				</div>
			</div>
		</div>
	)
}
