import { useSelector } from "react-redux"

export default function NextShapeUI() {
	const { stack, piece } = useSelector(state => state.game)

	const currentPiece = stack[piece + 1]
	if (!currentPiece?.shape) 
		return <></>

	return (
		<div className='w-24 h-24 bg-black border border-white/10 mx-auto rounded flex items-center justify-center'>
			<div>
				{currentPiece.shape.map((row, y) => (
					<div key={y} className='flex justify-center items-center'>
						{row.map((cell, x) => {
							const color = cell === 0 ? 'black' : currentPiece.color
							return (
								<div
									key={x}
									style={{ backgroundColor: color }}
									className='w-4 h-4 border border-black'
								/>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}