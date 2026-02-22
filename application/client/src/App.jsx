import './App.css'

function Setup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      
      <div className="bg-white flex flex-row  border-2 shadow-lg ">  
        <div className='w-16 border bg-black flex justify-center items-center'>
           <img src="/game.svg" alt="game icon" className="w-10 h-10" />
        </div>
        <div>
          <div className="flex items-center gap-4 m-2">
            <h1 className="text-2xl font-semibold tracking-wide">
              Room Not Found !
            </h1>
          </div>

          <p className="text-gray-700 text-sm mx-2 mb-2 text-center">
            Please use <span className="text-gray-950 font-bold">#room[player]</span> in the URL
          </p>
        </div>

      </div>
    </div>
  )

}


function App() {

  return (
    <div>
      <Setup/>
    </div>
  )
}

export default App
