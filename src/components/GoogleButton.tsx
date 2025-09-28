import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from "../firebase";
import GoogleIcon2 from '../assets/googleIcon2.jpg'
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const GoogleButton = () => {
    

    const navigate = useNavigate();

    const signInWithGoogle = async() => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User:", user);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            console.log("Access token:", token);
            navigate('/')
        } catch (error: any) {
            console.error("Error signing in:", error.message);
        }
    }

    return (
        <button
              onClick={signInWithGoogle}
            className="flex items-center bg-black px-4 py-2 rounded-lg shadow-2xl text-white"
        >
            <img
                src={GoogleIcon2}
                alt="Google"
                className="w-6 h-6 mr-2"
            />
            Sign in with Google
        </button>
    )
}

export default GoogleButton
