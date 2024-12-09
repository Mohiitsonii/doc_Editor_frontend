import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import PrivateRoutes from './helpers/routes/PrivateRoutes';
import Register from './pages/Register';
import DocumentHome from './pages/DocumentHome';
import EditDocument from './pages/EditDocument';
import Greeting from './components/Greeting';


function App() {

  return (


    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />} />

          <Route path='/register' element={<Register />} />

          <Route path='/' element={<PrivateRoutes />}>
          <Route path='/home' element={<Greeting/>}></Route>
          
            <Route path='/documents' element={<DocumentHome/>} />
            <Route path='/edit/:id' element={<EditDocument/>} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App