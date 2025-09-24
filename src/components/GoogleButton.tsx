import GoogleIcon from '../assets/googleIcon.png'

const GoogleButton = () => {
    return (
        <button
            //   onClick={signInWithGoogle}
            className="flex items-center text-black px-4 py-2 rounded-lg shadow-2xl bg-white"
        >
            <img
                src={GoogleIcon}
                alt="Google"
                className="w-6 h-6 mr-2"
            />
            Sign in with Google
        </button>
    )
}

export default GoogleButton
