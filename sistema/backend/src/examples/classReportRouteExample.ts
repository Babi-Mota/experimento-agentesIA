/**
 * Example: POST /exams/:id/class-report
 * Generate a class report from multiple student submissions
 */

// Example request body for POST /exams/exam123/class-report

const classReportRequest = {
    answerKeyCsv: `questionId,correctAnswer
q1,A
q2,B
q3,C
q4,A
q5,B`,
    studentsSubmissions: [
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
    ],
    correctionMode: 'proportional',
};

// Example response (HTTP 200):
const exampleResponse = {
    totalStudents: 3,
    correctionMode: 'proportional',
    studentsResults: [
        {
            studentName: 'Alice Silva',
            correction: {
                totalQuestions: 5,
                correctAnswers: 5,
                incorrectAnswers: 0,
                unansweredQuestions: 0,
                score: 1,
                normalizedScore: 1,
            },
        },
        {
            studentName: 'Bob Santos',
            correction: {
                totalQuestions: 5,
                correctAnswers: 3,
                incorrectAnswers: 2,
                unansweredQuestions: 0,
                score: 0.6,
                normalizedScore: 0.6,
            },
        },
        {
            studentName: 'Carol Costa',
            correction: {
                totalQuestions: 5,
                correctAnswers: 4,
                incorrectAnswers: 0,
                unansweredQuestions: 1,
                score: 0.8,
                normalizedScore: 0.8,
            },
        },
    ],
    averageScore: 0.8,
    averageNormalizedScore: 0.8,
};

// Example rigorous mode request:
const rigorousRequest = {
    ...classReportRequest,
    correctionMode: 'rigorous',
};

// Example rigorous mode response:
const rigorousResponse = {
    totalStudents: 3,
    correctionMode: 'rigorous',
    studentsResults: [
        {
            studentName: 'Alice Silva',
            correction: {
                totalQuestions: 5,
                correctAnswers: 5,
                incorrectAnswers: 0,
                unansweredQuestions: 0,
                score: 5,
            },
        },
        {
            studentName: 'Bob Santos',
            correction: {
                totalQuestions: 5,
                correctAnswers: 3,
                incorrectAnswers: 2,
                unansweredQuestions: 0,
                score: 3,
            },
        },
        {
            studentName: 'Carol Costa',
            correction: {
                totalQuestions: 5,
                correctAnswers: 4,
                incorrectAnswers: 0,
                unansweredQuestions: 1,
                score: 4,
            },
        },
    ],
    averageScore: 4,
};

// Error cases:

// Missing required field (HTTP 400)
const missingFieldError = {
    error: 'Missing required fields: answerKeyCsv, studentsSubmissions, and correctionMode',
};

// Invalid exam ID (HTTP 400)
const invalidIdError = {
    error: 'Invalid exam ID',
};

// Invalid correction mode (HTTP 400)
const invalidModeError = {
    error: 'Invalid correction mode. Use "rigorous" or "proportional"',
};

// Empty student submissions (HTTP 400
const emptySubmissionsError = {
    error: 'At least one student submission is required',
};

// studentsSubmissions not an array (HTTP 400)
const notArrayError = {
    error: 'studentsSubmissions must be an array',
};

export {
    classReportRequest,
    exampleResponse,
    rigorousRequest,
    rigorousResponse,
    missingFieldError,
    invalidIdError,
    invalidModeError,
    emptySubmissionsError,
    notArrayError,
};
