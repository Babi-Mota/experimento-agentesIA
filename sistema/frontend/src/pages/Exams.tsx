import { useState, useEffect } from 'react';
import './Exams.css';

interface Alternative {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    statement: string;
    alternatives: Alternative[];
    createdAt?: string;
    updatedAt?: string;
}

interface Exam {
    id: string;
    title: string;
    questionIds: string[];
    answerFormat: 'letters' | 'powers_of_two';
    createdAt: string;
    updatedAt?: string;
}

const API_BASE_URL = 'http://127.0.0.1:3001';

export function Exams() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [answerFormat, setAnswerFormat] = useState<'letters' | 'powers_of_two'>('letters');
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    // Fetch exams and questions on mount
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchExams(), fetchQuestions()]);
        };
        loadData();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/exams`);
            if (!response.ok) {
                throw new Error(`Failed to fetch exams: ${response.statusText}`);
            }
            const data = await response.json();
            setExams(Array.isArray(data) ? data : data.value || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exams';
            setError(errorMessage);
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/questions`);
            if (!response.ok) {
                throw new Error(`Failed to fetch questions: ${response.statusText}`);
            }
            const data = await response.json();
            setQuestions(Array.isArray(data) ? data : data.value || []);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setQuestions([]);
        }
    };

    const handleAddExam = async () => {
        if (!title.trim()) {
            alert('Please enter an exam title');
            return;
        }

        if (selectedQuestionIds.length === 0) {
            alert('Please select at least one question');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const requestBody = {
                title: title.trim(),
                questionIds: selectedQuestionIds,
                answerFormat,
            };

            const response = await fetch(`${API_BASE_URL}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to create exam: ${response.statusText}`);
            }

            const newExam = await response.json();
            setExams([...exams, newExam]);

            // Reset form
            setTitle('');
            setAnswerFormat('letters');
            setSelectedQuestionIds([]);
            setShowForm(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create exam';
            setError(errorMessage);
            console.error('Error creating exam:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteExam = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) {
            return;
        }

        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete exam: ${response.statusText}`);
            }

            setExams(exams.filter((e) => e.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete exam';
            setError(errorMessage);
            console.error('Error deleting exam:', err);
        }
    };

    const handleGeneratePdf = async (id: string) => {
        try {
            setIsGeneratingPdf(id);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/exams/${id}/generate/pdf`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to generate PDF: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `exam-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
            setError(errorMessage);
            console.error('Error generating PDF:', err);
        } finally {
            setIsGeneratingPdf(null);
        }
    };

    const toggleQuestionSelection = (questionId: string) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    return (
        <div className="exams-container">
            <div className="page-header">
                <h1>Exams</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading || isSubmitting}
                >
                    {showForm ? 'Cancel' : 'Add Exam'}
                </button>
            </div>

            {error && (
                <div className="error-alert">
                    <strong>Error:</strong> {error}
                    <button
                        className="close-btn"
                        onClick={() => setError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <p>Loading exams and questions...</p>
                </div>
            ) : (
                <>
                    {showForm && (
                        <div className="form-card">
                            <div className="form-group">
                                <label htmlFor="title">Exam Title:</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter exam title"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="format">Answer Format:</label>
                                <select
                                    id="format"
                                    value={answerFormat}
                                    onChange={(e) =>
                                        setAnswerFormat(e.target.value as 'letters' | 'powers_of_two')
                                    }
                                    disabled={isSubmitting}
                                >
                                    <option value="letters">Letters (A, B, C, ...)</option>
                                    <option value="powers_of_two">Powers of Two (1, 2, 4, 8, ...)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Select Questions:</label>
                                <div className="questions-selector">
                                    {questions.length === 0 ? (
                                        <p className="no-questions">No questions available</p>
                                    ) : (
                                        questions.map((question) => (
                                            <div key={question.id} className="question-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`question-${question.id}`}
                                                    checked={selectedQuestionIds.includes(question.id)}
                                                    onChange={() => toggleQuestionSelection(question.id)}
                                                    disabled={isSubmitting}
                                                />
                                                <label htmlFor={`question-${question.id}`}>
                                                    <span className="question-statement">
                                                        {question.statement}
                                                    </span>
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button
                                className="btn btn-success"
                                onClick={handleAddExam}
                                disabled={isSubmitting || selectedQuestionIds.length === 0}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Exam'}
                            </button>
                        </div>
                    )}

                    <div className="exams-grid">
                        {exams.length === 0 ? (
                            <p className="empty-state">No exams yet. Create one to get started!</p>
                        ) : (
                            exams.map((exam) => (
                                <div key={exam.id} className="exam-card">
                                    <div className="exam-header">
                                        <h3>{exam.title}</h3>
                                        <span className="format-badge">{exam.answerFormat}</span>
                                    </div>
                                    <div className="exam-info">
                                        <p>
                                            <strong>Questions:</strong> {exam.questionIds.length}
                                        </p>
                                        <p>
                                            <strong>Created:</strong> {new Date(exam.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="exam-actions">
                                        <button
                                            className="btn btn-info btn-small"
                                            onClick={() => handleGeneratePdf(exam.id)}
                                            disabled={isGeneratingPdf === exam.id}
                                        >
                                            {isGeneratingPdf === exam.id ? 'Generating...' : 'Generate PDF'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDeleteExam(exam.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
