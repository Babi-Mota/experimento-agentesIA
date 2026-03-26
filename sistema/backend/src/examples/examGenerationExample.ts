import type { ExamVersion } from '../types/index';

/**
 * Example: How to use the ExamGenerationService
 * This file demonstrates the structure for testing and documentation purposes
 */

// Example of a generated exam version with letters format
const exampleExamVersionLetters: ExamVersion = {
    examId: '456e7890-f01c-34e5-b567-528725285111',
    title: 'Mathematics Test - Chapter 1',
    questions: [
        {
            id: '345e6789-f01d-34e5-d789-638836407000',
            statement: 'What is 2 + 2?',
            alternatives: [
                { id: 'alt-1', text: '5', isCorrect: false },
                { id: 'alt-2', text: '4', isCorrect: true }, // Correct answer at index 1 -> B
                { id: 'alt-3', text: '3', isCorrect: false },
                { id: 'alt-4', text: '6', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '234e5678-f90c-23e4-c678-537725396000',
            statement: 'What is the capital of France?',
            alternatives: [
                { id: 'alt-10', text: 'Lyon', isCorrect: false },
                { id: 'alt-11', text: 'Paris', isCorrect: true }, // Correct answer at index 1 -> B
                { id: 'alt-12', text: 'Marseille', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    answerFormat: 'letters',
    answerKey: {
        '345e6789-f01d-34e5-d789-638836407000': 'B', // 2+2=4 is at index 1
        '234e5678-f90c-23e4-c678-537725396000': 'B', // Paris is at index 1
    },
};

// Example of a generated exam version with powers of two format
const exampleExamVersionPowersOfTwo: ExamVersion = {
    examId: '567f8901-g12d-45f6-e890-649947518222',
    title: 'Physics Exam - Final',
    questions: [
        {
            id: '456f6789-e90b-23d4-b567-426614174111',
            statement: 'What is velocity?',
            alternatives: [
                { id: 'alt-20', text: 'Speed with direction', isCorrect: true }, // Index 0 -> 2^0 = 1
                { id: 'alt-21', text: 'Distance/time', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '567g7890-f01c-34e5-c678-537725285222',
            statement: 'What is acceleration?',
            alternatives: [
                { id: 'alt-30', text: 'Speed', isCorrect: false },
                { id: 'alt-31', text: 'Change in velocity', isCorrect: true }, // Index 1 -> 2^1 = 2
                { id: 'alt-32', text: 'Distance', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    answerFormat: 'powers_of_two',
    answerKey: {
        '456f6789-e90b-23d4-b567-426614174111': '1', // Correct answer at index 0 -> 2^0
        '567g7890-f01c-34e5-c678-537725285222': '2', // Correct answer at index 1 -> 2^1
    },
};

console.log('Example Exam Version (letters):', exampleExamVersionLetters);
console.log('Example Exam Version (powers_of_two):', exampleExamVersionPowersOfTwo);
