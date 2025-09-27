import GoogleIcon2 from '../assets/googleIcon2.jpg'

const GoogleButton = () => {
    return (
        <button
            //   onClick={signInWithGoogle}
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
