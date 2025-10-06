// import { GoogleAuthProvider } from 'firebase/auth/web-extension';
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from "../firebase";
import GoogleIcon2 from '../assets/googleIcon2.jpg'
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const GoogleButton = () => {
    

    const navigate = useNavigate();

    const signInWithGoogle = async() => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            console.log("User:", user);

            // user creation...

           const userRef = doc(db, 'users', user.uid);
           const docSnap = await getDoc(userRef);

           if(!docSnap.exists()) {
            await setDoc(userRef,{
              name: user.displayName,
              email: user.email,
              uid: user.uid,
              createdAt: new Date()
           });
            toast.success("welcome");
           } else {
            console.log("User already exists in Firestore.");
           }

            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential?.accessToken;
            // console.log("Access token:", token);
            navigate('/')
        } catch (error) {
            if(error instanceof FirebaseError) {
                console.error("Firebase Error:",error.code , error.message);
            } else {
                console.log("unknown Error:", error)
            }
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
