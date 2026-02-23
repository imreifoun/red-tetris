import { useSelector } from "react-redux"

function PlayersUI() {
	const { players = [], started } = useSelector(state => state.game)

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
				Players 
			</h2>

			<div className="flex flex-col gap-3">
				{players.map((plyr) => (
					<div
						key={plyr.id}
						className="flex items-center justify-between  border-2 bg-gray-50 hover:bg-gray-100 transition"
					>
						<div className="flex flex-col py-2 px-2">
							<span className="font-semibold text-gray-800 ">
								{plyr.username}
                                <span className=" px-2 text-xs text-gray-500">
								   ID : [{plyr.id}]
							    </span>
                             
							</span>
							<span className="text-xs text-black font-bold">
								SCORE: 0
							</span>
                            
						</div>

						<div className='border bg-black flex justify-center items-center'>
                            <img src="/player.svg" alt="game icon" className="w-16 p-2" />
                        </div>
					</div>
				))}
			</div>
            <div className="flex border justify-center items-center my-4">
                {!started && true && (
                    <div className="bg-white flex flex-row  border-2 shadow-lg w-full">  
                        <div className='w-16 border bg-black flex justify-center items-center'>
                            <img src="/start.svg" alt="game icon" className="w-8 h-8 p-1" />
                        </div>
                        <div className="hover:bg-black flex justify-center hover:text-white hover:border-l-2 w-full hover:border-white">
                            <button className="px-6 py-2 font-bold hover:cursor-pointer text-center" onClick={() => 0}>Start Game</button>
                        </div>
                    </div>
                )}
            </div>
            

		</div>
	)
}

// players.find(p => p.username === username)?.host

export default PlayersUI;
