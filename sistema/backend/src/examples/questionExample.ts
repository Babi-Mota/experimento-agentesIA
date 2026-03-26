import type { Question, Alternative } from '../types/index';

/**
 * Example: How to use the Question data model
 * This file demonstrates the structure for testing and documentation purposes
 */

// Example of a Question with alternatives
const exampleQuestion: Question = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    statement: 'What is the capital of France?',
    alternatives: [
        {
            id: 'alt-1',
            text: 'Paris',
            isCorrect: true,
        },
        {
            id: 'alt-2',
            text: 'Lyon',
            isCorrect: false,
        },
        {
            id: 'alt-3',
            text: 'Marseille',
            isCorrect: false,
        },
        {
            id: 'alt-4',
            text: 'Toulouse',
            isCorrect: false,
        },
    ],
    createdAt: new Date('2026-03-26T10:00:00Z'),
    updatedAt: new Date('2026-03-26T10:00:00Z'),
};

console.log('Example Question:', exampleQuestion);
