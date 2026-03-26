/**
 * Alternative for a multiple-choice question
 */
export interface Alternative {
    id: string;
    text: string;
    isCorrect: boolean;
}

/**
 * Multiple-choice question
 * Must contain at least 2 alternatives
 */
export interface Question {
    id: string;
    statement: string;
    alternatives: Alternative[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Request payload for creating a question
 */
export interface CreateQuestionRequest {
    statement: string;
    alternatives: Omit<Alternative, 'id'>[];
}

/**
 * Request payload for updating a question
 */
export interface UpdateQuestionRequest {
    statement?: string;
    alternatives?: Omit<Alternative, 'id'>[];
}

/**
 * Answer format for exam responses
 */
export type AnswerFormat = 'letters' | 'powers_of_two';

/**
 * Exam (Prova)
 * Contains questions and defines answer format
 */
export interface Exam {
    id: string;
    title: string;
    questionIds: string[];
    answerFormat: AnswerFormat;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Request payload for creating an exam
 */
export interface CreateExamRequest {
    title: string;
    questionIds: string[];
    answerFormat: AnswerFormat;
}

/**
 * Request payload for updating an exam
 */
export interface UpdateExamRequest {
    title?: string;
    questionIds?: string[];
    answerFormat?: AnswerFormat;
}

/**
 * Generated exam version with shuffled questions and answer key
 */
export interface ExamVersion {
    examId: string;
    title: string;
    questions: Question[];
    answerFormat: AnswerFormat;
    answerKey: Record<string, string>; // questionId -> answer (letter or power of 2)
}

/**
 * Correction result from rigorous or proportional mode
 */
export interface CorrectionResult {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    score: number; // rigorous: count of correct answers, proportional: score / totalQuestions
    normalizedScore?: number; // 0-1, present in proportional mode
}

/**
 * Student submission with name and answers
 */
export interface StudentSubmission {
    studentName: string;
    studentAnswersCsv: string;
}

/**
 * Student result with name and correction details
 */
export interface StudentResult {
    studentName: string;
    correction: CorrectionResult;
}

/**
 * Class report for multiple student submissions
 */
export interface ClassReport {
    totalStudents: number;
    correctionMode: 'rigorous' | 'proportional';
    studentsResults: StudentResult[];
    averageScore: number;
    averageNormalizedScore?: number; // present in proportional mode
}
