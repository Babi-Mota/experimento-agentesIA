import type { ExamVersion } from '../types/index';

/**
 * Service for exporting exam data as CSV
 */
class CsvExportService {
    /**
     * Export answer key from exam version as CSV string
     * Returns a CSV with columns: questionId,correctAnswer
     */
    exportAnswerKeyToCsv(examVersion: ExamVersion): string {
        const rows: string[] = [];

        // Add header
        rows.push('questionId,correctAnswer');

        // Add data rows
        for (const [questionId, answer] of Object.entries(examVersion.answerKey)) {
            const escapedQuestionId = this.escapeCSVValue(questionId);
            const escapedAnswer = this.escapeCSVValue(answer);
            rows.push(`${escapedQuestionId},${escapedAnswer}`);
        }

        return rows.join('\n');
    }

    /**
     * Escape CSV value if it contains special characters
     * Wraps in quotes and escapes internal quotes
     */
    private escapeCSVValue(value: string): string {
        // If value contains comma, newline, or quote, wrap in quotes and escape quotes
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
}

// Export singleton instance
export const csvExportService = new CsvExportService();
