import React, { useState } from 'react'
import {motion} from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine
} from "react-icons/fa"
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({onStart}) {

    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const {userData} = useSelector((state)=>state.user);
    const dispatch = useDispatch();

    const handelUploadResume = async() => {
        try{
            if(!resumeFile || analyzing) return;
            setAnalyzing(true);

            const formdata = new FormData();
            formdata.append("resume", resumeFile);

            const result = await axios.post(
                ServerUrl + "/api/interview/resume",
                formdata,
                {withCredentials: true}
            );

            console.log(result.data);

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);
        }
        catch(error){
            console.log(error);
            setAnalyzing(false);
        }
    }

    const handleStart = async() => {
        setLoading(true);
        try{
            const result = await axios.post(
                ServerUrl + "/api/interview/generate-questions", 
                {role, experience, mode, resumeText, projects, skills}, 
                {withCredentials: true}
            );
            console.log("question generation done");
            console.log(result.data);
            if(userData){
                dispatch(setUserData({...userData, credits: result.data.creditsLeft}));
            }
            setLoading(false);
            onStart(result.data);
        }
        catch(error){
            console.log(error);
            setLoading(false);
        }
    }

  return (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.6}}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6">

        <div className='w-full max-w-4xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden'>

            <motion.div
            initial={{x: -60, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.7}}
            className='relative bg-gradient-to-br from-green-50 to-green-100 p-8 flex flex-col justify-center'>

                <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                    Start Your AI Interview
                </h2>

                <p className='text-sm text-gray-600 mb-8 leading-relaxed'>
                    Practice real interview scenarios powered by AI.
                    Improve communication, technical skills and confidence.
                </p>

                <div className='space-y-4'>
                    {
                        [
                            {
                                icon: <FaUserTie className='text-green-600 text-lg'/>,
                                text: "Choose Role & Experience"
                            },
                            {
                                icon: <FaMicrophoneAlt className='text-green-600 text-lg'/>,
                                text: "Smart Voice Interview"
                            },
                            {
                                icon: <FaChartLine className='text-green-600 text-lg'/>,
                                text: "Performance Analytics"
                            },
                        ].map((item, index) => {
                            return (
                                <motion.div
                                key={index}
                                initial={{y: 20, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{delay: 0.3 + index * 0.15}}
                                whileHover={{scale: 1.02}}
                                className='flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm cursor-pointer'>

                                    {item.icon}

                                    <span className='text-sm text-gray-700 font-medium'>
                                        {item.text}
                                    </span>

                                </motion.div>
                            )
                        })
                    }
                </div>
            </motion.div>

            <motion.div
            initial={{x: 60, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.7}}
            className='p-8 bg-white'>

                <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                    Interview Setup
                </h2>

                <div className='space-y-5'>

                    <div className='relative'>
                        <FaUserTie className='absolute top-4 left-4 text-gray-400 text-sm'/>

                        <input
                        type="text"
                        placeholder='Enter role'
                        className='w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition'
                        onChange={(e)=>setRole(e.target.value)}
                        value={role}/>
                    </div>

                    <div className='relative'>
                        <FaBriefcase className='absolute top-4 left-4 text-gray-400 text-sm'/>

                        <input
                        type="text"
                        placeholder='Experience (e.g. 2 years)'
                        className='w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition'
                        onChange={(e)=>setExperience(e.target.value)}
                        value={experience}/>
                    </div>

                    <select
                    onChange={(e)=>setMode(e.target.value)}
                    value={mode}
                    className='w-full py-2.5 px-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition'>

                        <option value="Technical">Technical Interview</option>
                        <option value="HR">HR Interview</option>

                    </select>

                    {
                        !analysisDone && (
                            <motion.div
                            whileHover={{scale: 1.01}}
                            onClick={()=>document.getElementById("resumeUpload").click()}
                            className='border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition'>

                                <FaFileUpload className='text-3xl mx-auto text-green-600 mb-3'/>

                                <input
                                type="file"
                                id='resumeUpload'
                                accept='application/pdf'
                                className='hidden'
                                onChange={(e)=>setResumeFile(e.target.files[0])}/>

                                <p className='text-sm text-gray-600 font-medium'>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {
                                    resumeFile && (
                                        <motion.button
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handelUploadResume();
                                        }}
                                        whileHover={{scale: 1.02}}
                                        className='mt-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition'>

                                            {analyzing ? "Analyzing..." : "Analyze Resume"}

                                        </motion.button>
                                    )
                                }

                            </motion.div>
                        )
                    }

                    {
                        analysisDone && (
                            <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">

                                <h3 className='text-base font-semibold text-gray-800'>
                                    Resume Analysis Result
                                </h3>

                                {
                                    projects.length > 0 && (
                                        <div>
                                            <p className='text-sm font-medium text-gray-700 mb-1'>
                                                Projects:
                                            </p>

                                            <ul className='list-disc list-inside text-sm text-gray-600 space-y-1'>
                                                {
                                                    projects.map((project, index) => {
                                                        return (
                                                            <li key={index}>
                                                                {project}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    )
                                }

                                {
                                    skills.length > 0 && (
                                        <div>
                                            <p className='text-sm font-medium text-gray-700 mb-2'>
                                                Skills:
                                            </p>

                                            <div className='flex flex-wrap gap-2'>
                                                {
                                                    skills.map((skill, index) => {
                                                        return (
                                                            <span
                                                            key={index}
                                                            className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs'>

                                                                {skill}

                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                            </motion.div>
                        )
                    }

                    <motion.button
                    onClick={handleStart}
                    disabled={!role || !experience || loading} 
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.95}}
                    className='w-full disabled:bg-gray-500 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-full text-base font-semibold transition duration-300 shadow-md'>

                        {loading? "Starting...": "Start Interview"}

                    </motion.button>

                </div>
            </motion.div>
        </div>
    </motion.div>
  )
}

export default Step1SetUp;