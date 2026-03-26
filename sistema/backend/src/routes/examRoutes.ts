import { Router, Request, Response } from 'express';
import { examService } from '../services/examService';
import { examGenerationService } from '../services/examGenerationService';
import { csvExportService } from '../services/csvExportService';
import { examCorrectionService } from '../services/examCorrectionService';
import { classReportService } from '../services/classReportService';
import { pdfExportService } from '../services/pdfExportService';
import type { CreateExamRequest, UpdateExamRequest, StudentSubmission } from '../types/index';

const router = Router();

/**
 * Validate that id is a string (Express params can be string | string[])
 */
const validateIdParam = (id: string | string[] | undefined): id is string => {
    return typeof id === 'string' && id.length > 0;
};

/**
 * POST /exams
 * Create a new exam
 */
router.post('/', (req: Request, res: Response) => {
    try {
        const { title, questionIds, answerFormat } = req.body as CreateExamRequest;

        if (!title || !questionIds || !answerFormat) {
            return res.status(400).json({
                error: 'Missing required fields: title, questionIds, and answerFormat',
            });
        }

        const exam = examService.createExam({ title, questionIds, answerFormat });
        return res.status(201).json(exam);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({ error: message });
    }
});

/**
 * GET /exams
 * List all exams
 */
router.get('/', (req: Request, res: Response) => {
    try {
        const exams = examService.listExams();
        return res.status(200).json(exams);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

/**
 * GET /exams/:id
 * Get a specific exam by ID
 */
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const exam = examService.getExam(id);

        if (!exam) {
            return res.status(404).json({ error: `Exam with id ${id} not found` });
        }

        return res.status(200).json(exam);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

/**
 * PUT /exams/:id
 * Update an exam
 */
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body as UpdateExamRequest;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        if (!data.title && !data.questionIds && !data.answerFormat) {
            return res.status(400).json({
                error: 'At least one field must be provided: title, questionIds, or answerFormat',
            });
        }

        const exam = examService.updateExam(id, data);
        return res.status(200).json(exam);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        return res.status(400).json({ error: message });
    }
});

/**
 * DELETE /exams/:id
 * Delete an exam
 */
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const deleted = examService.deleteExam(id);

        if (!deleted) {
            return res.status(404).json({ error: `Exam with id ${id} not found` });
        }

        return res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

/**
 * POST /exams/:id/generate
 * Generate a randomized version of an exam
 */
router.post('/:id/generate', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const examVersion = examGenerationService.generateExamVersion(id);
        return res.status(200).json(examVersion);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        return res.status(400).json({ error: message });
    }
});

/**
 * POST /exams/:id/generate/csv
 * Generate and return answer key as CSV file
 */
router.post('/:id/generate/csv', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const examVersion = examGenerationService.generateExamVersion(id);
        const csv = csvExportService.exportAnswerKeyToCsv(examVersion);

        // Set CSV response headers
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="answer-key-${id}.csv"`);

        return res.status(200).send(csv);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        return res.status(400).json({ error: message });
    }
});

/**
 * POST /exams/:id/generate/pdf
 * Generate and return exam as PDF file
 */
router.post('/:id/generate/pdf', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const examVersion = examGenerationService.generateExamVersion(id);
        const pdfBuffer = await pdfExportService.generateExamPdf(examVersion);

        // Set PDF response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="exam-${id}.pdf"`);

        return res.status(200).send(pdfBuffer);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        return res.status(400).json({ error: message });
    }
});

/**
 * POST /exams/:id/correct
 * Correct student answers from CSV
 * Note: Does NOT generate new answer key - receives both answerKeyCsv and studentAnswersCsv
 * This ensures correction uses the exact answer key from the exam version answered by students
 */
router.post('/:id/correct', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { answerKeyCsv, studentAnswersCsv } = req.body as {
            answerKeyCsv: string;
            studentAnswersCsv: string;
        };

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        if (!answerKeyCsv || !studentAnswersCsv) {
            return res.status(400).json({
                error: 'Missing required fields: answerKeyCsv and studentAnswersCsv',
            });
        }

        // Correct student answers using provided answer key
        const correctionResult = examCorrectionService.correctAnswersRigorous(
            answerKeyCsv,
            studentAnswersCsv
        );

        return res.status(200).json(correctionResult);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({ error: message });
    }
});

/**
 * POST /exams/:id/class-report
 * Generate a class report from multiple student submissions
 * Receives:
 *   - answerKeyCsv: The correct answer key in CSV format
 *   - studentsSubmissions: Array of {studentName, studentAnswersCsv}
 *   - correctionMode: 'rigorous' or 'proportional'
 * Returns: ClassReport with individual results and aggregate statistics
 */
router.post('/:id/class-report', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { answerKeyCsv, studentsSubmissions, correctionMode } = req.body as {
            answerKeyCsv: string;
            studentsSubmissions: StudentSubmission[];
            correctionMode: 'rigorous' | 'proportional';
        };

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        if (!answerKeyCsv || !studentsSubmissions || !correctionMode) {
            return res.status(400).json({
                error: 'Missing required fields: answerKeyCsv, studentsSubmissions, and correctionMode',
            });
        }

        if (!Array.isArray(studentsSubmissions)) {
            return res.status(400).json({
                error: 'studentsSubmissions must be an array',
            });
        }

        if (studentsSubmissions.length === 0) {
            return res.status(400).json({
                error: 'At least one student submission is required',
            });
        }

        // Generate class report
        const classReport = classReportService.generateClassReport(
            answerKeyCsv,
            studentsSubmissions,
            correctionMode
        );

        return res.status(200).json(classReport);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({ error: message });
    }
});

export default router;
