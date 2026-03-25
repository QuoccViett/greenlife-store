import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <HomePage/>
      <Footer/>
    </div>
  )
}

export default App
