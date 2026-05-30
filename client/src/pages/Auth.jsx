import React from 'react'
import {BsRobot} from "react-icons/bs"
import {IoSparkles} from "react-icons/io5"
import {motion} from "motion/react"
import {FcGoogle} from "react-icons/fc"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import axios from "axios";
import { ServerUrl } from '../App'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice'

function Auth({isModel = false}) {

    const dispatch = useDispatch();

    const handleGoogleAuth = async() => {
        try{
            const response = await signInWithPopup(auth, provider);
            let user = response.user;
            let name = user.displayName;
            let email = user.email;
            const result = await axios.post(ServerUrl + "/api/auth/google", 
                {name, email},
                {withCredentials: true}
            );
            dispatch(setUserData(result.data)); 
            // console.log(result.data);
        }
        catch(error){
            console.log(error);
            dispatch(setUserData(null));
        }
    }

  return (
    <div className={`w-full ${isModel? "py-4": "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`}>
        <motion.div 
        initial={{opacity:0, y: -40}}
        animate={{opacity:1, y: 0}}
        transition={{duration: 1.05}}
        className={`w-full bg-white shadow-2xl border border-gray-200 ${
            isModel 
                ? "max-w-md p-8 rounded-3xl" 
                : "max-w-lg p-12 rounded-4xl"
            }`}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className="bg-black text-white p-2 rounded-lg">
                    <BsRobot size={18}/>
                </div>
                <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>
            </div>

            <div className='text-center space-y-4'>
                <h1 className='text-2xl font-semibold leading-snug'>
                    Continue with
                </h1>
                <div className='flex justify-center'>
                    <span className='bg-green-100 text-green-600 text-2xl px-4 py-2 rounded-full inline-flex items-center gap-2 font-medium shadow-sm'>
                        <IoSparkles size={16}/>
                        AI Smart Interviews
                    </span>
                </div>
            </div>
            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mt-5 mb-8 whitespace-pre-line'>
                {`Sign in to start AI-powered MOCK INTERVIEWS, 
                track your interview journey in real time and 
                unlock detailed performance insights.`} 
            </p>
            <motion.button
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.8, scale: 1.03}}
            whileTap={{opacity: 1, scale: 0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md'>
                <FcGoogle size={20}/>
                Continue with Google
            </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth;
