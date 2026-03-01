import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

const PlayersUI = () => {

	const {room, username, players = [], started } = useSelector(state => state.game)

	const dispatch = useDispatch()

	const handleStart = () => {
    	dispatch({ type: 'socket/start', payload: { room } });
  	};

	useEffect(() => {
		//console.log('plyr?.spectrum ', players[0]?.spectrum)
		return;
	}, [started, players])

	return (
		<div className="p-6 max-w-md h-125 flex flex-col justify-between overflow-scroll mx-auto bg-black border shadow-xl ">
			
			<div>
				<h2 className="text-2xl font-bold mb-4 text-center">
					Players 
				</h2>

				<div className="flex flex-col gap-3 ">
					{players.map((plyr) => (
						<div
							key={plyr.id}
							className="flex items-center justify-between  border-2 bg-gray-50 hover:bg-gray-100 transition"
						>
							<div className="flex flex-col py-2 px-2">
								<span className="font-semibold text-gray-800 ">
									{plyr.username}
									
								
								</span>
								<span className="text-xs text-black font-bold">
									SCORE: {plyr.score}
								</span>
								
							</div>

							<div className='border bg-black flex justify-center items-center'>
								<div className="flex flex-col border border-white">
									{Array.from({ length: 20 }, (_, y) => (
									<div key={y} className="flex">
										{plyr?.spectrum?.map((h, x) => (
										<div
											key={x}
											className={`w-2 h-2 
											${20 - y <= h ? 'bg-blue-500' : 'bg-black-100'}
											`}
										/>
										))}
									</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

            <div className=" flex border justify-center items-center my-4">
                {!started && players.find(p => p.username === username)?.host && (
                    <div className="bg-white flex flex-row  border-2 shadow-lg w-full">  
                        <div className='w-16 border bg-black flex justify-center items-center'>
                            <img src="/start.svg" alt="game icon" className="w-8 h-8 p-1" />
                        </div>
                        <div className="hover:bg-black flex justify-center hover:text-white hover:border-l-2 w-full hover:border-white">
                            <button className="px-6 text-black hover:text-white py-2 font-bold hover:cursor-pointer  text-center" onClick={handleStart}>Start Game</button>
                        </div>
                    </div>
                )}
            </div>

		</div>
	)
}


// players.find(p => p.username === username)?.host

/*
 <span className=" px-2 text-xs text-gray-500">
	ID : [{plyr.id}]
</span>
*/

export default PlayersUI;
