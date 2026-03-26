import type { Question, CreateQuestionRequest, UpdateQuestionRequest, Alternative } from '../types/index';
import { randomUUID } from 'crypto';

/**
 * In-memory repository for questions
 * This is a temporary solution suitable for development
 * In production, connect to a database
 */
class QuestionService {
    private questions: Map<string, Question> = new Map();

    /**
     * Create a new question
     * Validates that at least 2 alternatives are provided
     */
    createQuestion(data: CreateQuestionRequest): Question {
        if (!data.alternatives || data.alternatives.length < 2) {
            throw new Error('A question must have at least 2 alternatives');
        }

        const id = this.generateId();
        const now = new Date();

        const alternatives: Alternative[] = data.alternatives.map(alt => ({
            id: this.generateId(),
            text: alt.text,
            isCorrect: alt.isCorrect,
        }));

        const question: Question = {
            id,
            statement: data.statement,
            alternatives,
            createdAt: now,
            updatedAt: now,
        };

        this.questions.set(id, question);
        return question;
    }

    /**
     * Get a question by ID
     */
    getQuestion(id: string): Question | undefined {
        return this.questions.get(id);
    }

    /**
     * List all questions
     */
    listQuestions(): Question[] {
        return Array.from(this.questions.values());
    }

    /**
     * Update a question
     */
    updateQuestion(id: string, data: UpdateQuestionRequest): Question {
        const question = this.questions.get(id);
        if (!question) {
            throw new Error(`Question with id ${id} not found`);
        }

        if (data.alternatives && data.alternatives.length < 2) {
            throw new Error('A question must have at least 2 alternatives');
        }

        const updatedQuestion: Question = {
            ...question,
            statement: data.statement ?? question.statement,
            alternatives: data.alternatives
                ? data.alternatives.map(alt => ({
                    id: this.generateId(),
                    text: alt.text,
                    isCorrect: alt.isCorrect,
                }))
                : question.alternatives,
            updatedAt: new Date(),
        };

        this.questions.set(id, updatedQuestion);
        return updatedQuestion;
    }

    /**
     * Delete a question
     */
    deleteQuestion(id: string): boolean {
        return this.questions.delete(id);
    }

    /**
     * Generate a unique ID
     */
    private generateId(): string {
        return randomUUID();
    }

    /**
     * Clear all questions (useful for testing)
     */
    clear(): void {
        this.questions.clear();
    }
}

// Export singleton instance
export const questionService = new QuestionService();
