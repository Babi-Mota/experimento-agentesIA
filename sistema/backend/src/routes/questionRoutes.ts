import { Router, Request, Response } from 'express';
import { questionService } from '../services/questionService';
import type { CreateQuestionRequest, UpdateQuestionRequest } from '../types/index';

const router = Router();

/**
 * Validate that id is a string (Express params can be string | string[])
 */
const validateIdParam = (id: string | string[] | undefined): id is string => {
    return typeof id === 'string' && id.length > 0;
};

/**
 * POST /questions
 * Create a new question
 */
router.post('/', (req: Request, res: Response) => {
    try {
        const { statement, alternatives } = req.body as CreateQuestionRequest;

        if (!statement || !alternatives) {
            return res.status(400).json({
                error: 'Missing required fields: statement and alternatives',
            });
        }

        const question = questionService.createQuestion({ statement, alternatives });
        return res.status(201).json(question);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({ error: message });
    }
});

/**
 * GET /questions
 * List all questions
 */
router.get('/', (req: Request, res: Response) => {
    try {
        const questions = questionService.listQuestions();
        return res.status(200).json(questions);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

/**
 * GET /questions/:id
 * Get a specific question by ID
 */
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        const question = questionService.getQuestion(id);

        if (!question) {
            return res.status(404).json({ error: `Question with id ${id} not found` });
        }

        return res.status(200).json(question);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

/**
 * PUT /questions/:id
 * Update a question
 */
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body as UpdateQuestionRequest;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        if (!data.statement && !data.alternatives) {
            return res.status(400).json({
                error: 'At least one field must be provided: statement or alternatives',
            });
        }

        const question = questionService.updateQuestion(id, data);
        return res.status(200).json(question);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        return res.status(400).json({ error: message });
    }
});

/**
 * DELETE /questions/:id
 * Delete a question
 */
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!validateIdParam(id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        const deleted = questionService.deleteQuestion(id);

        if (!deleted) {
            return res.status(404).json({ error: `Question with id ${id} not found` });
        }

        return res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
});

export default router;
