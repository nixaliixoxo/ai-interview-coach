import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import axios from 'axios'
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Pricing() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for exploring the platform and getting started.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Last 5 Interviews History",
        "Community Support"
      ],
      default: true
    },
    {
      id: "starter",
      name: "Starter Pack",
      price: "₹149",
      credits: 300,
      description: "Ideal for students preparing for internships and placements.",
      features: [
        "300 AI Interview Credits",
        "Detailed Feedback & Scoring",
        "Performance Analytics",
        "Unlimited Interview History",
        "Resume-Based Interviews"
      ]
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹499",
      credits: 1200,
      description: "Designed for serious job seekers aiming for top companies.",
      features: [
        "1200 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Gap Analysis",
        "Priority AI Processing",
        "Custom Interview Generation"
      ],
      badge: "Best Value"
    }
  ];

  const handlePayment = async(plan) => {
    try{
      setLoadingPlan(plan.id);
      const amount = plan.id === "starter"? 149: plan.id === "pro"? 499: 0;
      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits 
        },
        {withCredentials: true}
      );

      console.log(result.data);

      const options = {
        key: import.meta.env.VITE_RAZORRPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id, 
        handler: async function(response){
          const verifyPayment = await axios.post(
            ServerUrl + "/api/payment/verify",
            response,
            {withCredentials: true}
          );
          dispatch(setUserData(verifyPayment.data.user));
          alert("Payment Successful");
          navigate("/");
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);
    }
    catch(error){
      console.log(error);
      setLoadingPlan(null);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-10 px-4 sm:px-6'>
      
      <div className='max-w-5xl mx-auto mb-10 flex items-start gap-3'>
        <button
          onClick={() => navigate("/")}
          className='mt-1 p-2.5 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600 text-sm' />
        </button>

        <div className='text-center w-full'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-800'>
            Choose Your Plan
          </h1>

          <p className='text-gray-500 mt-2 text-sm sm:text-base'>
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto'>

        {plans.map((plan) => {

          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default && { scale: 1.02 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-2xl p-6 transition-all duration-300 border
              ${
                isSelected
                  ? "border-emerald-600 shadow-xl bg-white"
                  : "border-gray-200 bg-white shadow-md"
              }
              ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-4 right-4 bg-gray-200 text-gray-700 text-[10px] px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-semibold text-gray-800">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-3">
                <span className="text-3xl font-bold text-emerald-600">
                  {plan.price}
                </span>

                <p className="text-gray-500 text-sm mt-1">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-500 mt-3 text-xs sm:text-sm leading-relaxed min-h-[48px]">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-5 space-y-2.5 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <FaCheckCircle className="text-emerald-500 text-xs mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button
                disabled={loadingPlan === plan.id}
                  onClick={(e)=>{
                    e.stopPropagation();
                    if(!isSelected){
                      setSelectedPlan(plan.id);
                    } else{
                      handlePayment(plan);
                    }
                  }} 
                  className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                    isSelected
                      ? "bg-emerald-600 text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-50"
                  }`}
                >
                  {loadingPlan === plan.id ?
                    "Processing...":
                    isSelected ? 
                    "Proceed to Pay" : 
                    "Select Plan"}
                </button>
              )}

            </motion.div>
          );
        })}
      </div>
    </div>
  )
}

export default Pricing;