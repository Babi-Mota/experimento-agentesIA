import type { StudentSubmission } from '../types/index';
import { classReportService } from '../services/classReportService';

/**
 * Example: Generate a class report from multiple student submissions
 */

// Example answer key
const answerKeyCsv = `questionId,correctAnswer
q1,A
q2,B
q3,C
q4,A
q5,B`;

// Example student submissions
const studentSubmissions: StudentSubmission[] = [
    {
        studentName: 'Alice Silva',
        studentAnswersCsv: `questionId,studentAnswer
q1,A
q2,B
q3,C
q4,A
q5,B`,
    },
    {
        studentName: 'Bob Santos',
        studentAnswersCsv: `questionId,studentAnswer
q1,A
q2,B
q3,A
q4,B
q5,B`,
    },
    {
        studentName: 'Carol Costa',
        studentAnswersCsv: `questionId,studentAnswer
q1,A
q2,A
q3,C
q4,A
q5,`,
    },
];

// Generate report in rigorous mode (absolute scoring)
console.log('=== Rigorous Mode Report (Absolute Scoring) ===\n');
const rigorousReport = classReportService.generateClassReport(
    answerKeyCsv,
    studentSubmissions,
    'rigorous'
);

console.log(`Total Students: ${rigorousReport.totalStudents}`);
console.log(`Correction Mode: ${rigorousReport.correctionMode}`);
console.log(`Average Score: ${rigorousReport.averageScore.toFixed(2)}\n`);

console.log('Student Results:');
rigorousReport.studentsResults.forEach((result: { studentName: string; correction: { score: number; totalQuestions: number; correctAnswers: number; incorrectAnswers: number; unansweredQuestions: number } }) => {
    console.log(`  ${result.studentName}:`);
    console.log(`    Score: ${result.correction.score}/${result.correction.totalQuestions}`);
    console.log(`    Correct: ${result.correction.correctAnswers}`);
    console.log(`    Incorrect: ${result.correction.incorrectAnswers}`);
    console.log(`    Unanswered: ${result.correction.unansweredQuestions}`);
});

// Generate report in proportional mode (0-1 ratio)
console.log('\n=== Proportional Mode Report (0-1 Ratio) ===\n');
const proportionalReport = classReportService.generateClassReport(
    answerKeyCsv,
    studentSubmissions,
    'proportional'
);

console.log(`Total Students: ${proportionalReport.totalStudents}`);
console.log(`Correction Mode: ${proportionalReport.correctionMode}`);
console.log(`Average Score: ${proportionalReport.averageScore.toFixed(3)}`);
console.log(`Average Normalized Score: ${proportionalReport.averageNormalizedScore?.toFixed(3)}\n`);

console.log('Student Results:');
proportionalReport.studentsResults.forEach((result: { studentName: string; correction: { score: number; correctAnswers: number; totalQuestions: number; incorrectAnswers: number; unansweredQuestions: number } }) => {
    console.log(`  ${result.studentName}:`);
    console.log(`    Normalized Score: ${result.correction.score.toFixed(3)}`);
    console.log(`    Correct: ${result.correction.correctAnswers}/${result.correction.totalQuestions}`);
    console.log(`    Incorrect: ${result.correction.incorrectAnswers}`);
    console.log(`    Unanswered: ${result.correction.unansweredQuestions}`);
});

export { rigorousReport, proportionalReport };
