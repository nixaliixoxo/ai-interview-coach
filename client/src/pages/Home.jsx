import React, { useState } from 'react'
import Navbar from "../components/Navbar"
import { useSelector } from 'react-redux'
import {motion} from "motion/react"
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs"
import { HiSparkles } from 'react-icons/hi'
import evalImg from "../assets/ai-ans.png"
import hrImg from "../assets/HR.png"
import techImg from "../assets/tech.png"
import confidenceImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import analyticsImg from "../assets/history.png"
import { useNavigate } from 'react-router-dom'
import AuthModel from '../components/AuthModel'
import Footer from '../components/Footer'

function Home() {
  
  const {userData} = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />

      <div className='flex-1 px-6 py-14 md:py-16'>
        <div className='max-w-6xl mx-auto'>

          <div className='flex justify-center mb-5'>
            <div className='bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2'>
              <HiSparkles size={16} className='bg-green-50 text-green-600'/>
              AI Powered Smart Interview Platform
            </div>
          </div>

          <div className='text-center mb-20'>
            <motion.h1
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className='text-4xl md:text-5xl font-semibold leading-tight max-w-4xl mx-auto'
            >
              Practice Interviews with{" "}
              <span className='relative inline-block'>
                <span className='bg-green-100 text-green-600 px-5 py-1 rounded-full'>
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{duration: 0.8}}
              className='text-gray-500 mt-5 max-w-2xl mx-auto text-base md:text-lg whitespace-pre-line'
            >
              {`Personalised & Role-based Mock Interviews with smart follow-ups,
    adaptive difficulty and real time performance evaluation.`}
            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 mt-8'>
              <motion.button
                onClick={()=>{
                  if(!userData){
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{opacity: 0.9, scale:1.03}}
                whileTap={{opacity: 1, scale: 0.98}}
                className='bg-black text-white px-8 py-3 rounded-full shadow-md'
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={()=>{
                  if(!userData){
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{opacity: 0.9, scale:1.03}}
                whileTap={{opacity: 1, scale: 0.98}}
                className='border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-100 transition'
              >
                View History
              </motion.button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-6 mb-20'>
            {
              [
                {
                  icon: <BsRobot size={24}/>,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role."
                },
                {
                  icon: <BsMic size={24}/>,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers."
                },
                {
                  icon: <BsClock size={24}/>,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking."
                }
              ].map((item, index)=>{
                return(
                  <motion.div
                    key={index}
                    initial={{opacity:0, y: 60}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6 + index * 0.2}}
                    whileHover={{rotate: 0, scale: 1.04}}
                    className={`relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-300 p-6 w-72 max-w-[90%] shadow-md hover:shadow-xl transition-all duration-300
                    ${index === 0 ? "rotate-[-3deg]" : ""}
                    ${index === 1 ? "rotate-[2deg] md:-mt-4 shadow-lg" : ""}
                    ${index === 2 ? "rotate-[-2deg]" : ""}`}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                      {item.icon}
                    </div>

                    <div className='pt-8 text-center'>
                      <div className='text-xs text-green-600 font-semibold mb-2 tracking-wider'>
                        {item.step}
                      </div>

                      <h3 className='font-semibold mb-3 text-lg'>
                        {item.title}
                      </h3>

                      <p className='text-sm text-gray-500 leading-relaxed'>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })
            }
          </div>

          <div className='mb-20'>
            <motion.h2
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className='text-3xl md:text-4xl font-semibold text-center mb-12'
            >
              Advanced <span className='text-green-600'>AI Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-6'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20}/>,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20}/>,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20}/>,
                    title: "Downloadable PDF Report",
                    desc: "Detailed feedback report including strengths and improvements."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20}/>,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ].map((item, index)=>{
                  return(
                    <motion.div
                      key={index}
                      initial={{opacity:0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      transition={{duration: 0.5, delay: index * 0.1}}
                      whileHover={{scale: 1.02}}
                      className='bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all'
                    >
                      <div className='flex flex-col md:flex-row items-center gap-5'>

                        <div className='w-full md:w-1/2 flex justify-center'>
                          <img
                            src={item.image}
                            alt={item.title}
                            className='w-full h-auto object-contain max-h-48'
                          />
                        </div>

                        <div className='w-full md:w-1/2'>
                          <div className='flex items-center gap-4 mb-4'>
                            <div className='bg-green-50 text-green-600 w-11 h-11 rounded-xl flex items-center justify-center shrink-0'>
                              {item.icon}
                            </div>

                            <h3 className='font-semibold text-lg leading-snug'>
                              {item.title}
                            </h3>
                          </div>

                          <p className='text-gray-500 text-sm leading-relaxed'>
                            {item.desc}
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )
                })
              }
            </div>
          </div>

          <div className='mb-20'>
            <motion.h2
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className='text-3xl md:text-4xl font-semibold text-center mb-12'
            >
              Multiple <span className='text-green-600'>Interview Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-6'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioural and communication based evaluation."
                  },
                  {
                    img: techImg,
                    title: "Technical Interview Mode",
                    desc: "Deep technical questioning based on selected role and domain."
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights."
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions."
                  }
                ].map((mode, index)=>{
                  return(
                    <motion.div
                      key={index}
                      initial={{opacity:0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      transition={{duration: 0.5, delay: index * 0.1}}
                      whileHover={{scale: 1.02}}
                      className='bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all'
                    >
                      <div className='flex items-center justify-between gap-5'>

                        <div className='w-1/2'>
                          <h3 className='font-semibold text-lg mb-3'>
                            {mode.title}
                          </h3>

                          <p className='text-gray-500 text-sm leading-relaxed'>
                            {mode.desc}
                          </p>
                        </div>

                        <div className='w-1/2 flex justify-end'>
                          <img
                            src={mode.img}
                            alt={mode.title}
                            className='w-24 h-24 object-contain'
                          />
                        </div>

                      </div>
                    </motion.div>
                  )
                })
              }
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)}/>}

      <Footer/>
    </div>
  )
}

export default Home;