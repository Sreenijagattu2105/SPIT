/*
 * SPIT - Resume API Service
 * ------------------------
 * Handles resume uploads, retrieval, deletion, and downloads
 * through the Spring MVC backend.
 */

// Backend API endpoint for student resume operations.
const API_URL =
    "http://localhost:8080/spit-backend/api/student/resume";

/*
 * Uploads a resume file for the currently logged-in student.
 *
 * @param {string} studentEmail - Student email (currently unused).
 * @param {File} file - Resume file selected by the student.
 * @returns {Promise<Object>} Backend response.
 */
export async function saveResumeFile(studentEmail, file) {
    // Prepare multipart form data for the file upload.
    const formData = new FormData();
    formData.append("file", file);

    // Send the resume to the backend using the active session.
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    // Read the backend response.
    const result = await response.json();

    // Report upload failures.
    if (!response.ok) {
        throw new Error(
            result.message || "Unable to upload resume."
        );
    }

    return result;
}

/*
 * Retrieves resume metadata for the currently logged-in student.
 *
 * @param {string} studentEmail - Student email (currently unused).
 * @returns {Promise<Object|null>} Resume metadata, or null if absent.
 */
export async function getResumeFile(studentEmail) {
    // Request resume metadata from the backend.
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();

    // Report retrieval failures.
    if (!response.ok) {
        throw new Error(
            result.message || "Unable to load resume."
        );
    }

    // Return null when the student has no uploaded resume.
    if (!result.resume) {
        return null;
    }

    // Return normalized resume metadata.
    return {
        name: result.resume.name,
        type: result.resume.contentType,
        size: result.resume.size,

        // The actual file must be downloaded separately.
        file: null
    };
}

/*
 * Deletes the resume belonging to the currently logged-in student.
 *
 * @param {string} studentEmail - Student email (currently unused).
 * @returns {Promise<Object>} Backend response.
 */
export async function deleteResumeFile(studentEmail) {
    // Request resume deletion from the backend.
    const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include"
    });

    const result = await response.json();

    // Report deletion failures.
    if (!response.ok) {
        throw new Error(
            result.message || "Unable to delete resume."
        );
    }

    return result;
}

/*
 * Downloads the current student's resume as a Blob.
 *
 * @returns {Promise<Blob>} Downloaded resume file.
 */
export async function downloadResumeFile() {
    // Request the actual resume file.
    const response = await fetch(`${API_URL}/file`, {
        method: "GET",
        credentials: "include"
    });

    // Handle failed download requests.
    if (!response.ok) {
        let message = "Unable to download resume.";

        try {
            // Use the server's error message when available.
            const result = await response.json();
            message = result.message || message;
        } catch {
            // Keep the default message for non-JSON responses.
        }

        throw new Error(message);
    }

    // Return the downloaded file data.
    return response.blob();
}

/*
 * Retrieves resume metadata for a student viewed by a coordinator.
 *
 * @param {number|string} studentId - Student's database ID.
 * @returns {Promise<Object|null>} Resume metadata, or null if absent.
 */
export async function getCoordinatorStudentResume(studentId) {
    // Request the specified student's resume metadata.
    const response = await fetch(
        `${API_URL}/coordinator/${studentId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const result = await response.json();

    // Report retrieval failures.
    if (!response.ok) {
        throw new Error(
            result.message || "Unable to load student resume."
        );
    }

    // Return null if the student has no resume.
    if (!result.resume) {
        return null;
    }

    // Return normalized resume metadata.
    return {
        name: result.resume.name,
        type: result.resume.contentType,
        fileUrl: result.resume.fileUrl,
        size: result.resume.size
    };
}

/*
 * Downloads a student's resume for coordinator access.
 *
 * @param {number|string} studentId - Student's database ID.
 * @returns {Promise<Blob>} Downloaded resume file.
 */
export async function downloadCoordinatorStudentResume(studentId) {
    // Request the specified student's actual resume file.
    const response = await fetch(
        `${API_URL}/coordinator/${studentId}/file`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    // Handle failed download requests.
    if (!response.ok) {
        let message = "Unable to download student resume.";

        try {
            // Read the server-provided error when possible.
            const result = await response.json();
            message = result.message || message;
        } catch {
            // Keep the default error message.
        }

        throw new Error(message);
    }

    // Return the downloaded file data.
    return response.blob();
}
