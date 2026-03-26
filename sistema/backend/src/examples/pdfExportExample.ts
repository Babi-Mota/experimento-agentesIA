import { pdfExportService } from '../services/pdfExportService';
import type { ExamVersion } from '../types/index';

/**
 * Example: Generate a PDF from an exam version
 */

// Example ExamVersion
const exampleExamVersion: ExamVersion = {
    examId: 'exam-001',
    title: 'Mathematics - Algebra Fundamentals',
    answerFormat: 'letters',
    answerKey: {
        'q-1': 'B',
        'q-2': 'A',
        'q-3': 'C',
    },
    questions: [
        {
            id: 'q-1',
            statement: 'What is the value of x in the equation 2x + 5 = 13?',
            alternatives: [
                { id: 'alt-1', text: 'x = 3', isCorrect: false },
                { id: 'alt-2', text: 'x = 4', isCorrect: true },
                { id: 'alt-3', text: 'x = 5', isCorrect: false },
                { id: 'alt-4', text: 'x = 6', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'q-2',
            statement: 'Solve for y: 3y - 7 = 2',
            alternatives: [
                { id: 'alt-5', text: 'y = 3', isCorrect: true },
                { id: 'alt-6', text: 'y = 2', isCorrect: false },
                { id: 'alt-7', text: 'y = 1', isCorrect: false },
                { id: 'alt-8', text: 'y = 4', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'q-3',
            statement: 'Simplify: (x + 2)(x - 3)',
            alternatives: [
                { id: 'alt-9', text: 'x² - x - 6', isCorrect: true },
                { id: 'alt-10', text: 'x² + x + 6', isCorrect: false },
                { id: 'alt-11', text: 'x² - 5x - 6', isCorrect: false },
                { id: 'alt-12', text: 'x² + 5x + 6', isCorrect: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
};

/**
 * Generate and save PDF example
 */
async function generatePdfExample(): Promise<void> {
    try {
        console.log('Generating PDF for exam:', exampleExamVersion.title);

        const pdfBuffer = await pdfExportService.generateExamPdf(exampleExamVersion);

        console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

        // In a real application, you would save this to a file or send it in an HTTP response
        // Example: fs.writeFileSync('exam.pdf', pdfBuffer);
        // Or in a route: res.setHeader('Content-Type', 'application/pdf');
        //                 res.send(pdfBuffer);

        return;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error generating PDF:', message);
        throw error;
    }
}

// Run example (uncomment to test)
// generatePdfExample().catch(console.error);

export { generatePdfExample, exampleExamVersion };
