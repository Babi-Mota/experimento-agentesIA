/**
 * Example: POST /exams/:id/generate/pdf
 * Generate and download exam as PDF file
 */

// Example request: POST /exams/exam-123/generate/pdf
// Body: {} (empty - just generate from exam with ID)

// The server will:
// 1. Generate shuffled exam version from exam-123
// 2. Create PDF with:
//    - Exam title
//    - Total number of questions
//    - Each question with statement
//    - All alternatives labeled (A, B, C, ...)
//    - Automatic page breaks if needed
// 3. Return as attachment with filename: exam-exam-123.pdf

// Example response headers (HTTP 200):
// Content-Type: application/pdf
// Content-Disposition: attachment; filename="exam-exam-123.pdf"
// [Binary PDF data]

// Success response:
// Returns PDF file directly as binary data
// Client browser will download it as "exam-exam-123.pdf"

// Error responses:

// Invalid exam ID (HTTP 400)
const invalidIdError = {
    error: 'Invalid exam ID',
};

// Exam not found (HTTP 404)
const notFoundError = {
    error: 'Exam with id exam-999 not found',
};

// Invalid exam data (HTTP 400)
const invalidExamError = {
    error: 'Exam must contain at least one question',
};

// Example usage with fetch:
/*
async function downloadExamPdf(examId: string): Promise<void> {
    try {
        const response = await fetch(`/exams/${examId}/generate/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', error.error);
            return;
        }

        // Get PDF as blob
        const pdfBlob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `exam-${examId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('PDF downloaded successfully');
    } catch (error) {
        console.error('Download failed:', error);
    }
}

// Usage:
// downloadExamPdf('exam-123');
*/

// Example usage with curl:
/*
curl -X POST http://localhost:3001/exams/exam-123/generate/pdf \
  -H "Content-Type: application/json" \
  -o exam.pdf

# The PDF will be saved as exam.pdf in current directory
*/

export { invalidIdError, notFoundError, invalidExamError };
