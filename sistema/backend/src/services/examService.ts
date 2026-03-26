import type { Exam, CreateExamRequest, UpdateExamRequest, AnswerFormat } from '../types/index';
import { randomUUID } from 'crypto';

/**
 * In-memory repository for exams
 * This is a temporary solution suitable for development
 * In production, connect to a database
 */
class ExamService {
    private exams: Map<string, Exam> = new Map();

    /**
     * Validates the answer format
     */
    private isValidAnswerFormat(format: string): format is AnswerFormat {
        return format === 'letters' || format === 'powers_of_two';
    }

    /**
     * Create a new exam
     * Validates title, questionIds, and answerFormat
     */
    createExam(data: CreateExamRequest): Exam {
        if (!data.title || data.title.trim().length === 0) {
            throw new Error('Exam title is required and cannot be empty');
        }

        if (!data.questionIds || data.questionIds.length === 0) {
            throw new Error('An exam must have at least one question');
        }

        if (!this.isValidAnswerFormat(data.answerFormat)) {
            throw new Error('Invalid answer format. Must be "letters" or "powers_of_two"');
        }

        const id = this.generateId();
        const now = new Date();

        const exam: Exam = {
            id,
            title: data.title.trim(),
            questionIds: data.questionIds,
            answerFormat: data.answerFormat,
            createdAt: now,
            updatedAt: now,
        };

        this.exams.set(id, exam);
        return exam;
    }

    /**
     * Get an exam by ID
     */
    getExam(id: string): Exam | undefined {
        return this.exams.get(id);
    }

    /**
     * List all exams
     */
    listExams(): Exam[] {
        return Array.from(this.exams.values());
    }

    /**
     * Update an exam
     */
    updateExam(id: string, data: UpdateExamRequest): Exam {
        const exam = this.exams.get(id);
        if (!exam) {
            throw new Error(`Exam with id ${id} not found`);
        }

        if (data.title !== undefined && data.title.trim().length === 0) {
            throw new Error('Exam title cannot be empty');
        }

        if (data.questionIds !== undefined && data.questionIds.length === 0) {
            throw new Error('An exam must have at least one question');
        }

        if (data.answerFormat !== undefined && !this.isValidAnswerFormat(data.answerFormat)) {
            throw new Error('Invalid answer format. Must be "letters" or "powers_of_two"');
        }

        const updatedExam: Exam = {
            ...exam,
            title: data.title !== undefined ? data.title.trim() : exam.title,
            questionIds: data.questionIds ?? exam.questionIds,
            answerFormat: data.answerFormat ?? exam.answerFormat,
            updatedAt: new Date(),
        };

        this.exams.set(id, updatedExam);
        return updatedExam;
    }

    /**
     * Delete an exam
     */
    deleteExam(id: string): boolean {
        return this.exams.delete(id);
    }

    /**
     * Generate a unique ID
     */
    private generateId(): string {
        return randomUUID();
    }

    /**
     * Clear all exams (useful for testing)
     */
    clear(): void {
        this.exams.clear();
    }
}

// Export singleton instance
export const examService = new ExamService();
