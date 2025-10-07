import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import { Toaster } from "react-hot-toast"
import Profile from "./pages/Profile"

function App() {
 
  return (
    <>
    <Toaster />

    {/* Routes are here... */}
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Chat />}/>
          <Route path='/profile' element={<Profile />}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
