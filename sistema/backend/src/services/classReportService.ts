import type { StudentSubmission, ClassReport } from '../types/index';
import { examCorrectionService } from './examCorrectionService';

/**
 * Service for generating class reports from multiple student submissions
 */
class ClassReportService {
    /**
     * Generate a class report from multiple student submissions
     * @param answerKeyCsv The correct answer key in CSV format
     * @param studentSubmissions List of students with their answer submissions
     * @param correctionMode Either 'rigorous' (absolute count) or 'proportional' (0-1 ratio)
     * @returns ClassReport with individual results and aggregate statistics
     */
    generateClassReport(
        answerKeyCsv: string,
        studentSubmissions: StudentSubmission[],
        correctionMode: 'rigorous' | 'proportional'
    ): ClassReport {
        if (studentSubmissions.length === 0) {
            throw new Error('No student submissions provided');
        }

        if (!['rigorous', 'proportional'].includes(correctionMode)) {
            throw new Error('Invalid correction mode. Use "rigorous" or "proportional"');
        }

        // Process each student's submission
        const studentsResults = studentSubmissions.map((submission) => {
            const correction =
                correctionMode === 'rigorous'
                    ? examCorrectionService.correctAnswersRigorous(
                        answerKeyCsv,
                        submission.studentAnswersCsv
                    )
                    : examCorrectionService.correctAnswersProportional(
                        answerKeyCsv,
                        submission.studentAnswersCsv
                    );

            return {
                studentName: submission.studentName,
                correction,
            };
        });

        // Calculate average scores
        const averageScore = this.calculateAverageScore(studentsResults);
        const averageNormalizedScore =
            correctionMode === 'proportional'
                ? this.calculateAverageNormalizedScore(studentsResults)
                : undefined;

        return {
            totalStudents: studentSubmissions.length,
            correctionMode,
            studentsResults,
            averageScore,
            averageNormalizedScore,
        };
    }

    /**
     * Calculate average score across all students
     */
    private calculateAverageScore(studentsResults: Array<{ correction: { score: number } }>): number {
        if (studentsResults.length === 0) return 0;

        const totalScore = studentsResults.reduce((sum, result) => sum + result.correction.score, 0);
        return totalScore / studentsResults.length;
    }

    /**
     * Calculate average normalized score (for proportional mode)
     */
    private calculateAverageNormalizedScore(
        studentsResults: Array<{ correction: { normalizedScore?: number } }>
    ): number {
        if (studentsResults.length === 0) return 0;

        const totalNormalizedScore = studentsResults.reduce((sum, result) => {
            return sum + (result.correction.normalizedScore || 0);
        }, 0);

        return totalNormalizedScore / studentsResults.length;
    }
}

// Singleton instance
export const classReportService = new ClassReportService();
