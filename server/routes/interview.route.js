import express from "express"
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, generateQuestion, getAllInterviews, getInterviewReport, submitAnswer } from "../controllers/interview.controller.js";
import isAuth from "../middlewares/isAuth.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestion);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish-interview", isAuth, finishInterview);

interviewRouter.get("/get-interviews", isAuth, getAllInterviews);
interviewRouter.get("/report/:id", isAuth, getInterviewReport);

export default interviewRouter;