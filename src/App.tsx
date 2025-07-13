
import './App.css'
import Header from './components/Header'
import Layover from './components/Layover'

function App() {


  return (
    <>
      <Layover />
      <Header />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to NOMNOM</h1>
      </div>
    </>
  )
}

export default App
