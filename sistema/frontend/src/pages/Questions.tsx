import { useState, useEffect } from 'react';
import './Questions.css';

interface Alternative {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    statement: string;
    alternatives: Alternative[];
    createdAt?: Date;
    updatedAt?: Date;
}

const API_BASE_URL = 'http://127.0.0.1:3001';

export function Questions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [statement, setStatement] = useState('');
    const [alternatives, setAlternatives] = useState<string[]>(['', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch questions on mount
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/questions`);

            if (!response.ok) {
                throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setQuestions(Array.isArray(data) ? data : data.value ?? []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!statement.trim()) {
            alert('Please enter a question statement');
            return;
        }

        if (alternatives.some((alt) => !alt.trim())) {
            alert('Please fill all alternatives');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const requestBody = {
                statement: statement.trim(),
                alternatives: alternatives.map((text, idx) => ({
                    text: text.trim(),
                    isCorrect: idx === 0, // First alternative is correct by default
                })),
            };

            const response = await fetch(`${API_BASE_URL}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to create question: ${response.statusText}`);
            }

            const newQuestion = await response.json();
            setQuestions([...questions, newQuestion]);
            setStatement('');
            setAlternatives(['', '', '']);
            setShowForm(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create question';
            setError(errorMessage);
            console.error('Error creating question:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete question: ${response.statusText}`);
            }

            setQuestions(questions.filter((q) => q.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
            setError(errorMessage);
            console.error('Error deleting question:', err);
        }
    };

    return (
        <div className="questions-container">
            <div className="page-header">
                <h1>Questions</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading || isSubmitting}
                >
                    {showForm ? 'Cancel' : 'Add Question'}
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
                    <p>Loading questions...</p>
                </div>
            ) : (
                <>
                    {showForm && (
                        <div className="form-card">
                            <div className="form-group">
                                <label htmlFor="statement">Question Statement:</label>
                                <textarea
                                    id="statement"
                                    value={statement}
                                    onChange={(e) => setStatement(e.target.value)}
                                    placeholder="Enter the question statement"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>Alternatives (Minimum 2):</label>
                                {alternatives.map((alt, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={alt}
                                        onChange={(e) => {
                                            const newAlts = [...alternatives];
                                            newAlts[idx] = e.target.value;
                                            setAlternatives(newAlts);
                                        }}
                                        placeholder={`Alternative ${String.fromCharCode(65 + idx)}`}
                                        disabled={isSubmitting}
                                    />
                                ))}
                            </div>

                            <button
                                className="btn btn-success"
                                onClick={handleAddQuestion}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Question'}
                            </button>
                        </div>
                    )}

                    <div className="questions-list">
                        {questions.length === 0 ? (
                            <p className="empty-state">No questions yet. Create one to get started!</p>
                        ) : (
                            questions.map((question, index) => (
                                <div key={question.id} className="question-card">
                                    <div className="question-content">
                                        <h3>Question {index + 1}</h3>
                                        <p>{question.statement}</p>

                                        <small style={{ opacity: 0.5 }}>
                                            ID: {question.id.slice(0, 8)}...
                                        </small>

                                        <ul className="alternatives-list">
                                            {question.alternatives.map((alt, idx) => (
                                                <li key={alt.id}>
                                                    <strong>{String.fromCharCode(65 + idx)})</strong>{' '}
                                                    {alt.text}
                                                    {alt.isCorrect && <span className="correct-badge">✓</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        disabled={isSubmitting}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
