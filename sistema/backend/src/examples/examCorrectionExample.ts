import type { CorrectionResult } from '../types/index';
import { examCorrectionService } from '../services/examCorrectionService';

/**
 * Example: How to use the ExamCorrectionService
 * Demonstrates both rigorous and proportional correction modes
 */

// Example answer key CSV (from exam generation)
const answerKeyCSV = `questionId,correctAnswer
q1,A
q2,B
q3,C
q4,B
q5,D`;

// Example student answers CSV (uploaded by teacher)
const studentAnswersCSV = `questionId,studentAnswer
q1,A
q2,B
q3,A
q4,B
q5,`;

console.log('=== RIGOROUS MODE ===');
// Rigorous mode: score = count of correct answers
const rigorousResult = examCorrectionService.correctAnswersRigorous(
    answerKeyCSV,
    studentAnswersCSV
);

console.log('Rigorous Correction Result:');
console.log(rigorousResult);

// Expected output:
// {
//   totalQuestions: 5,
//   correctAnswers: 3,        (q1, q2, q4)
//   incorrectAnswers: 1,      (q3)
//   unansweredQuestions: 1,   (q5)
//   score: 3                  (count)
// }

console.log('\n=== PROPORTIONAL MODE ===');
// Proportional mode: score = correctAnswers / totalQuestions
const proportionalResult = examCorrectionService.correctAnswersProportional(
    answerKeyCSV,
    studentAnswersCSV
);

console.log('Proportional Correction Result:');
console.log(proportionalResult);

// Expected output:
// {
//   totalQuestions: 5,
//   correctAnswers: 3,
//   incorrectAnswers: 1,
//   unansweredQuestions: 1,
//   score: 0.6,               (3/5 = 0.6)
//   normalizedScore: 0.6
// }

// Another example with powers_of_two format
const answerKeyPowersOfTwo = `questionId,correctAnswer
q1,1
q2,2
q3,4`;

const studentAnswersPowersOfTwo = `questionId,studentAnswer
q1,1
q2,4
q3,4`;

console.log('\n=== PROPORTIONAL MODE (powers_of_two) ===');
const proportionalResultPowersOfTwo = examCorrectionService.correctAnswersProportional(
    answerKeyPowersOfTwo,
    studentAnswersPowersOfTwo
);

console.log('Proportional Correction Result (powers_of_two):');
console.log(proportionalResultPowersOfTwo);

// Expected output:
// {
//   totalQuestions: 3,
//   correctAnswers: 2,        (q1, q3)
//   incorrectAnswers: 1,      (q2)
//   unansweredQuestions: 0,
//   score: 0.6666...,         (2/3 ≈ 0.667)
//   normalizedScore: 0.6666...
// }

