import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function Step3Report({ report }) {

  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>
          Loading Report...
        </p>
      </div>
    );
  }

  const navigate = useNavigate();

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    allQuestionsData = []
  } = report;

  const questionWiseData = allQuestionsData.map((q, index) => ({
    name: `Q${index + 1}`,
    score: q.score || 0,
    question: q.question,
    feedback: q.feedback
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness }
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  }
  else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  }
  else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work rigorously to attain more clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPdf = () => {

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 20, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("AI Interview Performance Report", pageWidth / 2, 13, {
      align: "center"
    });

    // Score Card
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(12, 28, 186, 20, 4, 4, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(15);
    doc.text(`Final Score: ${finalScore}/10`, 18, 40);

    // Skills
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);

    doc.text(`Confidence: ${confidence}/10`, 18, 58);
    doc.text(`Communication: ${communication}/10`, 78, 58);
    doc.text(`Correctness: ${correctness}/10`, 148, 58);

    // Advice
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure while continuing to strengthen real-world examples.";
    }
    else if (finalScore >= 5) {
      advice =
        "Good foundation. Improve clarity, answer structure and provide stronger supporting examples.";
    }
    else {
      advice =
        "Focus on structured thinking, communication clarity and confident delivery through regular practice.";
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(12, 66, 186, 22, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Professional Advice", 16, 75);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const adviceText = doc.splitTextToSize(advice, 175);
    doc.text(adviceText, 16, 82);

    // Compact Question Table
    autoTable(doc, {
      startY: 95,
      margin: { left: 10, right: 10 },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseData.map((q, i) => [
        `${i + 1}`,
        q.question?.slice(0, 55) || "-",
        `${q.score}/10`,
        q.feedback?.slice(0, 90) || "-"
      ]),
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        halign: "center"
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 58 },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: "auto" }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-3 sm:px-5 lg:px-8 py-5'>
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>

        <div className='w-full flex items-start gap-3'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-2.5 rounded-full bg-white shadow hover:shadow-md transition'>
            <FaArrowLeft className='text-gray-600 text-sm' />
          </button>

          <div>
            <h1 className='text-2xl font-bold text-gray-800'>
              Interview Analytics Dashboard
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button
          onClick={downloadPdf}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm text-nowrap'>
          Download PDF
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

        <div className='space-y-5'>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl shadow-md p-5 text-center'>

            <h3 className='text-gray-500 mb-4 text-sm'>
              Overall Performance
            </h3>

            <div className='relative w-24 h-24 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#10b981",
                  textColor: "#ef4444",
                  trailColor: "#e5e7eb"
                })}
              />
            </div>

            <p className='text-gray-400 mt-2 text-xs'>
              Out of 10
            </p>

            <div className='mt-3'>
              <p className='font-semibold text-gray-800 text-sm'>
                {performanceText}
              </p>

              <p className='text-gray-500 text-xs mt-1'>
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl shadow-md p-5'>

            <h3 className='text-base font-semibold text-gray-700 mb-5'>
              Skill Evaluation
            </h3>

            <div className='space-y-4'>
              {
                skills.map((s, i) => (
                  <div key={i}>
                    <div className='flex justify-between mb-2 text-sm'>
                      <span>{s.label}</span>
                      <span className='font-semibold text-green-600'>
                        {s.value}
                      </span>
                    </div>

                    <div className='bg-gray-200 h-2 rounded-full'>
                      <div
                        style={{ width: `${s.value * 10}%` }}
                        className='bg-green-500 h-full rounded-full'
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          </motion.div>
        </div>

        <div className='lg:col-span-2 space-y-5'>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl shadow-md p-5'>

            <h3 className='text-base font-semibold text-gray-700 mb-4'>
              Performance Trend
            </h3>

            <div className='h-56'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl shadow-md p-5'>

            <h3 className='text-base font-semibold text-gray-700 mb-5'>
              Question Breakdown
            </h3>

            <div className='space-y-4'>
              {
                questionWiseData.map((q, i) => (
                  <div
                    key={i}
                    className='bg-gray-50 p-4 rounded-xl border border-gray-200'>

                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3'>

                      <div>
                        <p className='text-xs text-gray-400'>
                          Question {i + 1}
                        </p>

                        <p className='font-semibold text-gray-800 text-sm leading-relaxed'>
                          {q.question || "Question not available"}
                        </p>
                      </div>

                      <div className='bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs w-fit'>
                        {q.score || 0}/10
                      </div>
                    </div>

                    <div className='bg-green-50 border border-green-200 p-3 rounded-lg'>
                      <p className='text-xs text-green-600 font-semibold mb-1'>
                        AI Feedback
                      </p>

                      <p className='text-sm text-gray-700 leading-relaxed'>
                        {(q.feedback && q.feedback.trim() !== "")
                          ? q.feedback
                          : "No feedback available for this question."}
                      </p>
                    </div>

                  </div>
                ))
              }
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;