import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import type { ExamVersion } from '../types/index';

/**
 * Service for generating PDF documents from exam versions
 */
class PdfExportService {
    /**
     * Generate a PDF document from an exam version
     * @param examVersion The exam version to convert to PDF
     * @returns Promise<Buffer> containing the PDF data
     */
    async generateExamPdf(examVersion: ExamVersion): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 40,
                    size: 'A4',
                });

                const chunks: Buffer[] = [];

                // Capture PDF data
                doc.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve(pdfBuffer);
                });

                // Add content to PDF
                this.addExamContent(doc, examVersion);

                // Finalize PDF
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Add exam content to PDF document
     */
    private addExamContent(doc: InstanceType<typeof PDFDocument>, examVersion: ExamVersion): void {
        // Title
        doc.fontSize(20).font('Helvetica-Bold').text(examVersion.title, {
            align: 'center',
        });

        doc.moveDown(0.5);

        // Exam info
        doc.fontSize(10)
            .font('Helvetica')
            .text(`Total Questions: ${examVersion.questions.length}`, {
                align: 'center',
            });

        doc.moveDown(1);

        // Questions
        examVersion.questions.forEach((question, index) => {
            const questionNumber = index + 1;

            // Question number and statement
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text(`${questionNumber}. ${question.statement}`);

            doc.moveDown(0.3);

            // Alternatives
            question.alternatives.forEach((alternative, altIndex) => {
                const letter = String.fromCharCode(65 + altIndex); // A, B, C, ...
                doc.fontSize(11)
                    .font('Helvetica')
                    .text(`  ${letter}) ${alternative.text}`);
            });

            doc.moveDown(0.5);

            // Add page break if needed (simple check)
            if (index < examVersion.questions.length - 1) {
                const currentY = doc.y;
                if (currentY > 700) {
                    // Near bottom of page
                    doc.addPage();
                }
            }
        });
    }
}

// Singleton instance
export const pdfExportService = new PdfExportService();
