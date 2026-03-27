import { Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1'>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/products' element={<ProductsPage/>}/>
          <Route path='/products/:id' element={<ProductDetailPage/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
