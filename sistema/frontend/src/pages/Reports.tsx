import { useState, useEffect } from 'react';
import './Reports.css';

interface StudentResult {
    studentName: string;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    score: number;
    normalizedScore?: number;
}

interface ClassReportResponse {
    totalStudents: number;
    averageScore: number;
    averageNormalizedScore?: number;
    studentsResults: StudentResult[];
}

interface StudentSubmission {
    studentName: string;
    studentAnswersCsv: string; // Converted format with question IDs (for backend)
    displayAnswers: string; // Original format with question numbers (for UI)
}

interface ExamData {
    id: string;
    title: string;
    questionIds?: string[];
}

const API_BASE_URL = 'http://127.0.0.1:3001';

export function Reports() {
    const [exams, setExams] = useState<ExamData[]>([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
    const [answerKeyCsv, setAnswerKeyCsv] = useState('');
    const [correctionMode, setCorrectionMode] = useState<'rigorous' | 'proportional'>('rigorous');
    const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
    const [currentStudentName, setCurrentStudentName] = useState('');
    const [currentAnswersCsv, setCurrentAnswersCsv] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [report, setReport] = useState<ClassReportResponse | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Fetch exams on mount
    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/exams`);
            if (!response.ok) {
                throw new Error(`Failed to fetch exams: ${response.statusText}`);
            }
            const data = await response.json();
            const examsList = Array.isArray(data) ? data : data.value || [];
            setExams(examsList);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exams';
            setError(errorMessage);
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle exam selection and fetch full exam details
    const handleExamSelection = async (examId: string) => {
        setSelectedExamId(examId);
        setValidationError(null);

        if (!examId) {
            setSelectedExam(null);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exams/${examId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch exam details');
            }

            const examData = await response.json();
            setSelectedExam(examData);

        } catch (err) {
            console.error(err);
            setValidationError('Failed to load exam details');
            setSelectedExam(null);
        }

        // reset form
        setAnswerKeyCsv('');
        setStudentSubmissions([]);
        setCurrentStudentName('');
        setCurrentAnswersCsv('');
    };

    // Convert CSV with question numbers to CSV with question IDs
    const convertQuestionNumbersToIds = (
        csvInput: string,
        questionIds: string[] | undefined
    ): { converted: string; error: string | null } => {
        if (!questionIds || questionIds.length === 0) {
            return { converted: '', error: 'No questions found in selected exam' };
        }

        const lines = csvInput
            .trim()
            .split('\n')
            .filter((line) => line.trim());

        if (lines.length === 0) {
            return { converted: '', error: 'CSV is empty' };
        }

        const convertedLines: string[] = [];

        for (const line of lines) {
            const parts = line.split(',').map((p) => p.trim());

            if (parts.length !== 2) {
                return {
                    converted: '',
                    error: `Invalid format: "${line}". Expected: questionNumber,answer`,
                };
            }

            const [questionNumberStr, answer] = parts;
            const questionNumber = parseInt(questionNumberStr, 10);

            if (isNaN(questionNumber) || questionNumber < 1) {
                return {
                    converted: '',
                    error: `Invalid question number: "${questionNumberStr}". Must be a positive integer.`,
                };
            }

            if (questionNumber > questionIds.length) {
                return {
                    converted: '',
                    error: `Question number ${questionNumber} exceeds total questions (${questionIds.length})`,
                };
            }

            const questionId = questionIds[questionNumber - 1];
            convertedLines.push(`${questionId},${answer}`);
        }

        return { converted: convertedLines.join('\n'), error: null };
    };

    const addStudentSubmission = () => {
        setValidationError(null);

        if (!currentStudentName.trim()) {
            setValidationError('Please enter student name');
            return;
        }

        if (!currentAnswersCsv.trim()) {
            setValidationError('Please enter student answers (CSV format)');
            return;
        }

        // Validate and convert question numbers to IDs
        const { converted, error } = convertQuestionNumbersToIds(
            currentAnswersCsv,
            selectedExam?.questionIds
        );

        if (error) {
            setValidationError(`Invalid student answers: ${error}`);
            return;
        }

        const newSubmission: StudentSubmission = {
            studentName: currentStudentName.trim(),
            studentAnswersCsv: converted,
            displayAnswers: currentAnswersCsv.trim(),
        };

        setStudentSubmissions([...studentSubmissions, newSubmission]);
        setCurrentStudentName('');
        setCurrentAnswersCsv('');
    };

    const removeStudentSubmission = (index: number) => {
        setStudentSubmissions(studentSubmissions.filter((_, i) => i !== index));
    };

    const handleGenerateReport = async () => {
        setValidationError(null);

        if (!selectedExamId.trim()) {
            setValidationError('Please select an exam');
            return;
        }

        if (!answerKeyCsv.trim()) {
            setValidationError('Please enter the answer key (CSV format)');
            return;
        }

        if (studentSubmissions.length === 0) {
            setValidationError('Please add at least one student submission');
            return;
        }

        // Convert answer key from question numbers to question IDs
        const { converted: convertedAnswerKey, error: answerKeyError } = convertQuestionNumbersToIds(
            answerKeyCsv,
            selectedExam?.questionIds
        );

        if (answerKeyError) {
            setValidationError(`Invalid answer key: ${answerKeyError}`);
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const requestBody = {
                answerKeyCsv: convertedAnswerKey,
                studentsSubmissions: studentSubmissions,
                correctionMode,
            };

            const response = await fetch(`${API_BASE_URL}/exams/${selectedExamId}/class-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate report: ${response.statusText}`);
            }

            const reportData = await response.json();

            const normalizedStudentsResults = (reportData.studentsResults ?? reportData.studentResults ?? []).map((item: any) => {
                if (item.correction) {
                    return {
                        studentName: item.studentName,
                        correctAnswers: item.correction.correctAnswers ?? 0,
                        incorrectAnswers: item.correction.incorrectAnswers ?? 0,
                        unansweredQuestions: item.correction.unansweredQuestions ?? 0,
                        score: item.correction.score ?? 0,
                        normalizedScore: item.correction.normalizedScore,
                    };
                }

                return {
                    studentName: item.studentName,
                    correctAnswers: item.correctAnswers ?? 0,
                    incorrectAnswers: item.incorrectAnswers ?? 0,
                    unansweredQuestions: item.unansweredQuestions ?? 0,
                    score: item.score ?? 0,
                    normalizedScore: item.normalizedScore,
                };
            });

            setReport({
                totalStudents: reportData.totalStudents ?? 0,
                averageScore: reportData.averageScore ?? 0,
                averageNormalizedScore: reportData.averageNormalizedScore,
                studentsResults: normalizedStudentsResults,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
            setError(errorMessage);
            console.error('Error generating report:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetReport = () => {
        setReport(null);
        setSelectedExamId('');
        setSelectedExam(null);
        setAnswerKeyCsv('');
        setStudentSubmissions([]);
        setCurrentStudentName('');
        setCurrentAnswersCsv('');
        setCorrectionMode('rigorous');
        setValidationError(null);
    };

    return (
        <div className="reports-container">
            <div className="page-header">
                <h1>Reports</h1>
                {report && (
                    <button
                        className="btn btn-primary"
                        onClick={handleResetReport}
                        disabled={loading || isSubmitting}
                    >
                        Generate New Report
                    </button>
                )}
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

            {validationError && (
                <div className="error-alert">
                    <strong>Validation Error:</strong> {validationError}
                    <button
                        className="close-btn"
                        onClick={() => setValidationError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <p>Loading exams...</p>
                </div>
            ) : report ? (
                // Display report
                <div className="report-view">
                    <div className="stats-cards">
                        <div className="stat-card">
                            <h4>Total Students</h4>
                            <p className="stat-value">{report.totalStudents}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Average Score</h4>
                            <p className="stat-value">{report.averageScore.toFixed(2)}</p>
                        </div>
                        {report.averageNormalizedScore !== undefined && (
                            <div className="stat-card">
                                <h4>Average Normalized Score</h4>
                                <p className="stat-value">{(report.averageNormalizedScore * 100).toFixed(1)}%</p>
                            </div>
                        )}
                    </div>

                    <div className="results-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Correct</th>
                                    <th>Incorrect</th>
                                    <th>Unanswered</th>
                                    <th>Score</th>
                                    {report.studentsResults?.[0]?.normalizedScore !== undefined && (
                                        <th>Normalized</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {report.studentsResults.map((result, idx) => (
                                    <tr key={idx}>
                                        <td>{result.studentName}</td>
                                        <td className="correct">{result.correctAnswers}</td>
                                        <td className="incorrect">{result.incorrectAnswers}</td>
                                        <td className="unanswered">{result.unansweredQuestions}</td>
                                        <td>{result.score.toFixed(2)}</td>
                                        {result.normalizedScore !== undefined && (
                                            <td>{(result.normalizedScore * 100).toFixed(1)}%</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Display form
                <div className="form-container">
                    <div className="form-card">
                        <h2>Generate Class Report</h2>

                        <div className="form-group">
                            <label htmlFor="exam">Exam:</label>
                            <select
                                id="exam"
                                value={selectedExamId}
                                onChange={(e) => handleExamSelection(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select an exam --</option>
                                {exams.map((exam) => (
                                    <option key={exam.id} value={exam.id}>
                                        {exam.title}
                                    </option>
                                ))}
                            </select>
                            {selectedExam?.questionIds && (
                                <p className="help-text">
                                    This exam has {selectedExam.questionIds.length} question(s)
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="answerKey">Answer Key (CSV):</label>
                            <p className="help-text">Format: questionNumber,correctAnswer (one per line). Example: 1,A then 2,B</p>
                            <textarea
                                id="answerKey"
                                value={answerKeyCsv}
                                onChange={(e) => setAnswerKeyCsv(e.target.value)}
                                placeholder="1,A&#10;2,B&#10;3,C"
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="correctionMode">Correction Mode:</label>
                            <select
                                id="correctionMode"
                                value={correctionMode}
                                onChange={(e) =>
                                    setCorrectionMode(e.target.value as 'rigorous' | 'proportional')
                                }
                                disabled={isSubmitting}
                            >
                                <option value="rigorous">Rigorous (count of correct answers)</option>
                                <option value="proportional">Proportional (score normalized to 0-1)</option>
                            </select>
                        </div>

                        <div className="students-section">
                            <h3>Student Submissions</h3>

                            <div className="add-student">
                                <div className="form-group">
                                    <label htmlFor="studentName">Student Name:</label>
                                    <input
                                        id="studentName"
                                        type="text"
                                        value={currentStudentName}
                                        onChange={(e) => setCurrentStudentName(e.target.value)}
                                        placeholder="Enter student name"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="studentAnswers">Student Answers (CSV):</label>
                                    <p className="help-text">Format: questionNumber,studentAnswer (one per line). Example: 1,A then 2,B</p>
                                    <textarea
                                        id="studentAnswers"
                                        value={currentAnswersCsv}
                                        onChange={(e) => setCurrentAnswersCsv(e.target.value)}
                                        placeholder="1,A&#10;2,B&#10;3,C"
                                        rows={4}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button
                                    className="btn btn-info"
                                    onClick={addStudentSubmission}
                                    disabled={isSubmitting}
                                >
                                    Add Student
                                </button>
                            </div>

                            <div className="students-list">
                                {studentSubmissions.length === 0 ? (
                                    <p className="no-students">No students added yet</p>
                                ) : (
                                    studentSubmissions.map((submission, idx) => (
                                        <div key={idx} className="student-item">
                                            <div className="student-info">
                                                <strong>{submission.studentName}</strong>
                                                <span className="student-answers">{submission.displayAnswers}</span>
                                            </div>
                                            <button
                                                className="btn btn-danger btn-small"
                                                onClick={() => removeStudentSubmission(idx)}
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button
                            className="btn btn-success"
                            onClick={handleGenerateReport}
                            disabled={
                                isSubmitting ||
                                !selectedExamId ||
                                !answerKeyCsv.trim() ||
                                studentSubmissions.length === 0
                            }
                        >
                            {isSubmitting ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
