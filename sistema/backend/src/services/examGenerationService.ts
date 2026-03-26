import type { ExamVersion, Question, AnswerFormat } from '../types/index';
import { examService } from './examService';
import { questionService } from './questionService';

/**
 * Service for generating randomized exam versions
 */
class ExamGenerationService {
    /**
     * Generate a randomized version of an exam
     * Shuffles questions and alternatives, generates answer key
     */
    generateExamVersion(examId: string): ExamVersion {
        // Get exam and validate it exists
        const exam = examService.getExam(examId);
        if (!exam) {
            throw new Error(`Exam with id ${examId} not found`);
        }

        // Get all questions
        const allQuestions = questionService.listQuestions();
        const questionMap = new Map(allQuestions.map(q => [q.id, q]));

        // Get questions for this exam
        const examQuestions = exam.questionIds
            .map(id => questionMap.get(id))
            .filter((q): q is Question => q !== undefined);

        if (examQuestions.length === 0) {
            throw new Error('No valid questions found for this exam');
        }

        // Shuffle questions order
        const shuffledQuestions = this.shuffleArray([...examQuestions]);

        // Shuffle alternatives within each question and generate answer key
        const answerKey: Record<string, string> = {};
        const questionsWithShuffledAlterns = shuffledQuestions.map(question => {
            // Shuffle alternatives
            const shuffledAlternatives = this.shuffleArray([...question.alternatives]);

            // Find correct answer index
            const correctAnswerIndex = shuffledAlternatives.findIndex(alt => alt.isCorrect);

            // Generate answer based on format
            const answer = this.generateAnswer(correctAnswerIndex, exam.answerFormat);
            answerKey[question.id] = answer;

            return {
                ...question,
                alternatives: shuffledAlternatives,
            };
        });

        return {
            examId: exam.id,
            title: exam.title,
            questions: questionsWithShuffledAlterns,
            answerFormat: exam.answerFormat,
            answerKey,
        };
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Generate answer representation based on format and index
     * index is 0-based position of correct answer
     */
    private generateAnswer(index: number, format: AnswerFormat): string {
        if (format === 'letters') {
            // A, B, C, D, ...
            return String.fromCharCode(65 + index);
        } else if (format === 'powers_of_two') {
            // 1, 2, 4, 8, 16, ...
            return String(Math.pow(2, index));
        }
        throw new Error(`Unknown answer format: ${format}`);
    }
}

// Export singleton instance
export const examGenerationService = new ExamGenerationService();
