const express = require('express');
const mongoose = require('mongoose');
const Question = require('../models/Questions');
const checkUserAnswer = require('../helpers/checkUserAnswer');
const router = express.Router();

/* Gets random question
optional query params:
set, round, q_num, q_type, subject, ans_type
*/
router.get('/random', async (req, res) => {
    try {
        const { set, round, q_num, q_type, subject, ans_type } = req.query;
        const parsed_set = set ? parseInt(set, 10) : undefined;
        const parsed_round = round ? parseInt(round, 10) : undefined;
        const parsed_q_num = q_num ? parseInt(q_num, 10) : undefined;
       
        const match = {
            ...(parsed_set && { set: parsed_set }),
            ...(parsed_round && { round: parsed_round }),
            ...(parsed_q_num && { q_num: parsed_q_num }),
            ...(q_type && { q_type }),
            ...(subject && { subject }),
            ...(ans_type && { ans_type }),
        };
  
        const pipeline = [
            { $match: match},
            { $sample: { size: 1 } },
        ];
 
        const randomQuestions = await Question.aggregate(pipeline).exec();
        if (randomQuestions.length === 0) {
            res.status(404).json({ error: 'No question found matching the provided parameters.' });
          }
     
        res.json(randomQuestions[0]);
       

    } catch (e) {
      res.status(500).json({ error: 'There was an internal server error' });
    }
  });

//for unauthorized users, returns whether answer is correct
router.get("/check/:questionId", async (req, res) => {
    try {
        console.log('test');
        const { questionId } = req.params;
        const { userAnswer } = req.query;
        const question = await Question.findById(questionId);
        if (question === null) {
            res.status(404).json({ error: 'Question not found' });
        }
        const answersList = question.computer_ans;   //return [] with answers
        const isCorrect = checkUserAnswer(userAnswer, answersList, question.ans_type);
        res.json({ isCorrect });
        
    } catch(e) {
        res.status(500).json({ error: 'There was an internal server error' });
    }

});


module.exports = router;

