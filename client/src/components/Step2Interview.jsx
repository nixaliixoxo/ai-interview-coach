// Mount -> Load Voice -> Intro Speak -> Question Speak -> Mic On -> Timer Running -> Submit -> 
// Feedback Speak -> Next Question -> Repeat -> Finish 

import React, { useState, useRef, useEffect } from 'react';
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from './Timer';
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { ServerUrl } from '../App';
import axios from "axios";
import { BsArrowRight } from 'react-icons/bs';

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, username } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const isMicOnRef = useRef(true); // ref to avoid stale closures
  const isAIPlayingRef = useRef(false);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // Keep refs in sync
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );
      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Setup speech recognition once
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognition.abort();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const stopMic = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const startMic = () => {
    if (recognitionRef.current && !isAIPlayingRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const toggleMic = () => {
    const next = !isMicOnRef.current;
    setIsMicOn(next);
    isMicOnRef.current = next;
    if (next) {
      startMic();
    } else {
      stopMic();
    }
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        isAIPlayingRef.current = true;
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        isAIPlayingRef.current = false;
        if (isMicOnRef.current) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        isAIPlayingRef.current = false;
        resolve();
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  // Start timer only when not in intro and not showing feedback
  const startTimer = (duration) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Run intro once voices are ready
  useEffect(() => {
    if (!selectedVoice || !isIntroPhase) return;

    const runIntro = async () => {
      await speakText(`Hi ${username? username: "candidate"}, it's great to see you. I hope you're feeling confident and ready.`);
      await speakText(`I'll ask you a few questions. Just answer naturally and take your time. Let's begin.`);
      setIsIntroPhase(false);
    };

    runIntro();

  }, [selectedVoice]);

  // Ask question whenever currentIndex changes (and not in intro)
  useEffect(() => {
    if (isIntroPhase || !selectedVoice) return;
    if (!currentQuestion) return;

    const askQuestion = async () => {
      stopTimer();
      await new Promise(r => setTimeout(r, 800));
      if (currentIndex === 0) {
        await speakText("Alright, here is your first question.");
      } else {
        await speakText("So here is the next question.");
      }
      await speakText(currentQuestion.question);
      startTimer(currentQuestion.timeLimit || 60);
      if (isMicOnRef.current) startMic();
    };

    askQuestion();
  
  }, [isIntroPhase, currentIndex, selectedVoice]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      handleSubmitAnswer();
    }

  }, [timeLeft]);

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    stopTimer();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );
      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      await finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex((prev) => prev + 1);
  };

  const finishInterview = async () => {
    stopMic();
    stopTimer();
    setIsMicOn(false);
    setIsFinishing(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish-interview",
        { interviewId },
        { withCredentials: true }
      );
      onFinish(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* Video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>

          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload='auto'
              className='w-full h-auto object-cover'
            />
          </div>

          {/* subtitle area */}
          {subtitle && (
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>
                {subtitle}
              </p>
            </div>
          )} 

          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>Interview Status</span>
              {isAIPlaying && (
                <span className='text-sm font-semibold text-emerald-600'>AI Speaking</span>
              )}
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div className='flex flex-col'>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-sm text-gray-400'>Current Question</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-sm text-gray-400'>Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text section */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>

          <div className='bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full'>
            {!isIntroPhase && currentQuestion && (
              <div>
                <p className='text-xs sm:text-sm text-gray-400 mb-2'>
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed mb-6'>
                  {currentQuestion.question}
                </div>
              </div>
            )}

            <textarea
              placeholder='Type your answer here...'
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              className='w-full min-h-[220px] bg-white p-4 sm:p-5 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 placeholder:text-gray-400'
            />

            {!feedback && !isFinishing ? (
              <div className='flex items-center gap-4 mt-6'>
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                  className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'
                >
                  {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                </motion.button>

                <motion.button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || isIntroPhase}
                  whileTap={{ scale: 0.95 }}
                  className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'
              >
                <p className='text-emerald-700 font-medium mb-4'>
                  {feedback}
                </p>
                <button
                  onClick={handleNextQuestion}
                  disabled={isFinishing}
                  className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 disabled:bg-gray-500'>
                  {isFinishing
                    ? "Finishing..."
                    : currentIndex + 1 >= questions.length
                      ? "Finish Interview"
                      : "Next Question"}

                  <BsArrowRight size={18} />
              </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;