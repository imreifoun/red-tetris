import { useSelector } from "react-redux"

function PlayersUI() {
	const { players = [] } = useSelector(state => state.game)

	if (players.length === 0) {
		return (
			<div className="flex items-center justify-center p-6">
				<p className="text-gray-500 text-lg">No players yet...</p>
			</div>
		)
	}

	return (
		<div className="p-6 max-w-md mx-auto bg-white shadow-xl rounded-2xl">
			
			<h2 className="text-2xl font-bold mb-4 text-center">
				Players Lobby
			</h2>

			<div className="flex flex-col gap-3">
				{players.map((plyr) => (
					<div
						key={plyr.id}
						className="flex items-center justify-between p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
					>
						<div className="flex flex-col">
							<span className="font-semibold text-gray-800">
								{plyr.username}
							</span>
							<span className="text-xs text-gray-500">
								ID: {plyr.id}
							</span>
						</div>

						<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
					</div>
				))}
			</div>
		</div>
	)
}

export default PlayersUI;
