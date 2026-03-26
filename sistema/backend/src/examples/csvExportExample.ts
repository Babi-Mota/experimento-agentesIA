import type { ExamVersion } from '../types/index';
import { csvExportService } from '../services/csvExportService';

/**
 * Example: How to use the CSV export service
 * This file demonstrates the structure for testing and documentation purposes
 */

// Example ExamVersion
const exampleExamVersion: ExamVersion = {
    examId: '456e7890-f01c-34e5-b567-528725285111',
    title: 'Mathematics Test - Chapter 1',
    questions: [],
    answerFormat: 'letters',
    answerKey: {
        'question-001': 'A',
        'question-002': 'B',
        'question-003': 'C',
        'question-004': 'B',
        'question-005': 'D',
    },
};

// Export to CSV
const csvContent = csvExportService.exportAnswerKeyToCsv(exampleExamVersion);

console.log('Generated CSV:');
console.log(csvContent);

// Output would be:
// questionId,correctAnswer
// question-001,A
// question-002,B
// question-003,C
// question-004,B
// question-005,D

// Example with powers_of_two format
const exampleExamVersionPowersOfTwo: ExamVersion = {
    examId: '567f8901-g12d-45f6-e890-649947518222',
    title: 'Physics Exam',
    questions: [],
    answerFormat: 'powers_of_two',
    answerKey: {
        'q-1': '1',
        'q-2': '2',
        'q-3': '4',
    },
};

const csvContentPowersOfTwo = csvExportService.exportAnswerKeyToCsv(exampleExamVersionPowersOfTwo);

console.log('Generated CSV (powers_of_two):');
console.log(csvContentPowersOfTwo);

// Output would be:
// questionId,correctAnswer
// q-1,1
// q-2,2
// q-3,4
