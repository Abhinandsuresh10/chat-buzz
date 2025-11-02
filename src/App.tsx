import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import { Toaster } from "react-hot-toast"
import Profile from "./pages/Profile"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, updateDoc } from "firebase/firestore"
import ProtectedRoute from "./components/ProtectRouts"

function App() {

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { status: "online" });
       
        // Mark offline when window closes
        window.addEventListener("beforeunload", async () => {
          await updateDoc(userRef, { status: "offline" });
        });
        
      } else {
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
    <Toaster />

    {/* Routes are here... */}
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          
          <Route path='/' element={<ProtectedRoute><Chat /></ProtectedRoute>}/>
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
