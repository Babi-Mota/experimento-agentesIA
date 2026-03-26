import type { CorrectionResult } from '../types/index';

/**
 * Service for correcting student exam answers
 */
class ExamCorrectionService {
    /**
     * Correct student answers in rigorous mode
     * Returns score as count of correct answers
     */
    correctAnswersRigorous(
        answerKeyCsv: string,
        studentAnswersCsv: string
    ): CorrectionResult {
        const correction = this.calculateCorrection(answerKeyCsv, studentAnswersCsv);

        return {
            totalQuestions: correction.totalQuestions,
            correctAnswers: correction.correctAnswers,
            incorrectAnswers: correction.incorrectAnswers,
            unansweredQuestions: correction.unansweredQuestions,
            score: correction.correctAnswers,
        };
    }

    /**
     * Correct student answers in proportional mode
     * Returns score as proportion (correctAnswers / totalQuestions) with normalizedScore
     */
    correctAnswersProportional(
        answerKeyCsv: string,
        studentAnswersCsv: string
    ): CorrectionResult {
        const correction = this.calculateCorrection(answerKeyCsv, studentAnswersCsv);

        const normalizedScore =
            correction.totalQuestions > 0 ? correction.correctAnswers / correction.totalQuestions : 0;

        return {
            totalQuestions: correction.totalQuestions,
            correctAnswers: correction.correctAnswers,
            incorrectAnswers: correction.incorrectAnswers,
            unansweredQuestions: correction.unansweredQuestions,
            score: normalizedScore,
            normalizedScore,
        };
    }

    /**
     * Calculate correction statistics
     * Internal helper method used by both rigorous and proportional modes
     */
    private calculateCorrection(
        answerKeyCsv: string,
        studentAnswersCsv: string
    ): {
        totalQuestions: number;
        correctAnswers: number;
        incorrectAnswers: number;
        unansweredQuestions: number;
    } {
        // Parse answer key
        const answerKey = this.parseAnswerKeyCsv(answerKeyCsv);
        if (Object.keys(answerKey).length === 0) {
            throw new Error('Invalid answer key CSV');
        }

        // Parse student answers
        const studentAnswers = this.parseStudentAnswersCsv(studentAnswersCsv);

        // Calculate correction statistics
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let unansweredQuestions = 0;

        for (const [questionId, correctAnswer] of Object.entries(answerKey)) {
            const studentAnswer = studentAnswers[questionId];

            if (studentAnswer === undefined || studentAnswer === '') {
                unansweredQuestions++;
            } else if (this.normalizeAnswer(studentAnswer) === this.normalizeAnswer(correctAnswer)) {
                correctAnswers++;
            } else {
                incorrectAnswers++;
            }
        }

        return {
            totalQuestions: Object.keys(answerKey).length,
            correctAnswers,
            incorrectAnswers,
            unansweredQuestions,
        };
    }

    /**
     * Parse answer key CSV format: questionId,correctAnswer
     */
    private parseAnswerKeyCsv(csv: string): Record<string, string> {
        const answerKey: Record<string, string> = {};
        const lines = csv.trim().split('\n');

        // Skip header if present
        const startIndex = lines[0].toLowerCase() === 'questionid,correctanswer' ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [questionId, answer] = this.parseCsvLine(line);
            if (questionId && answer) {
                answerKey[questionId] = answer;
            }
        }

        return answerKey;
    }

    /**
     * Parse student answers CSV format: questionId,studentAnswer
     */
    private parseStudentAnswersCsv(csv: string): Record<string, string> {
        const studentAnswers: Record<string, string> = {};
        const lines = csv.trim().split('\n');

        // Skip header if present
        const startIndex = lines[0].toLowerCase() === 'questionid,studentanswer' ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [questionId, answer] = this.parseCsvLine(line);
            if (questionId) {
                studentAnswers[questionId] = answer || '';
            }
        }

        return studentAnswers;
    }

    /**
     * Parse single CSV line handling quoted values
     */
    private parseCsvLine(line: string): [string, string] {
        const parts: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        parts.push(current.trim());

        return [parts[0] || '', parts[1] || ''];
    }

    /**
     * Normalize answer for comparison (trim and uppercase)
     */
    private normalizeAnswer(answer: string): string {
        return answer.trim().toUpperCase();
    }
}

// Export singleton instance
export const examCorrectionService = new ExamCorrectionService();
