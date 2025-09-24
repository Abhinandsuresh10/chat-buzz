import sayHi from '../assets/Say hi.json';
import Lottie from 'lottie-react';
import GoogleButton from '../components/GoogleButton';

const Login = () => {
  return (
<div className="flex items-center justify-center min-h-screen p-4 md:p-20 bg-gray-100">
  {/* Black card */}
  <div className="relative w-full max-w-[640px] bg-black rounded-lg shadow-lg pt-8 pb-62 md:pt-8 md:pb-62">
    
    {/* Heading */}
    <div className="flex justify-center w-full mb-4">
      <p className="text-white font-bold">Login</p>
    </div>

    {/* White card overlapping */}
    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 md:-bottom-20 w-72 md:w-[560px] h-72 md:h-72 bg-white rounded-lg shadow-2xl flex items-center justify-center p-4 md:p-20">
      <div className="flex items-center justify-center flex-col w-full h-full">
      <Lottie animationData={sayHi} loop={true} className="w-36 h-52 md:w-40 md:h-60" />
      <GoogleButton />
      </div>
    </div>

  </div>
</div>

  )
}

export default Login
