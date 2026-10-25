// ==========================================
// SPIT - API REQUEST SERVICE
// Handles HTTP requests from the React frontend
// to the Spring MVC backend.
// ==========================================


// ==========================================
// 1. CONFIGURE THE BACKEND API URL
// Use the environment variable when available.
// Otherwise, use the local development server.
// ==========================================

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8080/spit-backend/api";


// ==========================================
// 2. CREATE A REUSABLE API REQUEST FUNCTION
// Supports GET, POST, PUT, DELETE, and other
// HTTP methods supported by the backend.
// ==========================================

export async function apiRequest(
    endpoint,
    { method = "GET", body, headers = {}, ...options } = {}
) {

    // Copy the supplied headers to avoid modifying the original object
    const requestHeaders = { ...headers };


    // ==========================================
    // 3. CHECK THE REQUEST BODY TYPE
    // FormData is used for file uploads.
    // Other request bodies are sent as JSON.
    // ==========================================

    const isFormData =
        typeof FormData !== "undefined" && body instanceof FormData;

    // Set the JSON content type for non-FormData request bodies
    if (body !== undefined && !isFormData) {
        requestHeaders["Content-Type"] = "application/json";
    }


    // ==========================================
    // 4. SEND THE HTTP REQUEST
    // Combine the base URL with the endpoint.
    // Include cookies for session-based authentication.
    // ==========================================

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            // Forward additional fetch options
            ...options,

            // Specify the HTTP method
            method,

            // Attach the request headers
            headers: requestHeaders,

            // Include cookies in cross-origin requests when permitted
            credentials: "include",

            // Send no body when undefined.
            // Otherwise, send FormData directly or serialize JSON.
            body:
                body === undefined
                    ? undefined
                    : isFormData
                        ? body
                        : JSON.stringify(body),
        }
    );


    // ==========================================
    // 5. HANDLE EMPTY RESPONSES
    // HTTP 204 means the request succeeded
    // and the response contains no content.
    // ==========================================

    if (response.status === 204) {
        return null;
    }


    // ==========================================
    // 6. READ THE RESPONSE
    // Parse JSON responses as objects or arrays.
    // Read other response types as plain text.
    // ==========================================

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();


    // ==========================================
    // 7. HANDLE HTTP ERRORS
    // Throw an error containing the backend's
    // message when the request fails.
    // ==========================================

    if (!response.ok) {

        // Extract the error message from the response
        const message =
            typeof data === "object" && data !== null
                ? data.message || data.error
                : data;

        // Throw an error for the calling component to handle
        throw new Error(
            message || `Request failed with status ${response.status}`
        );
    }


    // ==========================================
    // 8. RETURN THE SUCCESSFUL RESPONSE
    // Make the parsed response available to
    // the component that called apiRequest().
    // ==========================================

    return data;
}
