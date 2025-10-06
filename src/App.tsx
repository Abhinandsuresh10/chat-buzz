import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import { Toaster } from "react-hot-toast"

function App() {
 
  return (
    <>
    <Toaster />

    {/* Routes are here... */}
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Chat />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
