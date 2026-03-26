import type { Exam } from '../types/index';

/**
 * Example: How to use the Exam data model
 * This file demonstrates the structure for testing and documentation purposes
 */

// Example of an Exam with questions in letter format
const exampleExam: Exam = {
    id: '456e7890-f01c-34e5-b567-528725285111',
    title: 'Mathematics Test - Chapter 1',
    questionIds: [
        '123e4567-e89b-12d3-a456-426614174000',
        '234e5678-f90c-23e4-c678-537725396000',
        '345e6789-f01d-34e5-d789-638836407000',
    ],
    answerFormat: 'letters',
    createdAt: new Date('2026-03-26T10:00:00Z'),
    updatedAt: new Date('2026-03-26T10:00:00Z'),
};

// Example of an Exam with questions in powers of 2 format
const exampleExamPowersOfTwo: Exam = {
    id: '567f8901-g12d-45f6-e890-649947518222',
    title: 'Physics Exam - Final',
    questionIds: [
        '456f6789-e90b-23d4-b567-426614174111',
        '567g7890-f01c-34e5-c678-537725285222',
    ],
    answerFormat: 'powers_of_two',
    createdAt: new Date('2026-03-26T11:00:00Z'),
    updatedAt: new Date('2026-03-26T11:00:00Z'),
};

console.log('Example Exam (letters):', exampleExam);
console.log('Example Exam (powers_of_two):', exampleExamPowersOfTwo);
