package com.spit.security;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.spit.model.User;
import com.spit.repository.UserRepository;

/**
 * Intercepts API requests to validate sessions and enforce
 * student and coordinator access permissions.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    /**
     * Initializes the interceptor with the user repository.
     *
     * @param userRepository repository used to verify user accounts
     */
    public AuthInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Validates the session and role before protected API requests proceed.
     *
     * @param request incoming HTTP request
     * @param response outgoing HTTP response
     * @param handler selected request handler
     * @return true if the request may proceed; otherwise false
     * @throws IOException if writing an error response fails
     */
    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws IOException {

        // Allow browser CORS preflight requests.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI()
                .substring(request.getContextPath().length());

        // Allow public access to the published opportunities endpoint.
        if ("GET".equalsIgnoreCase(request.getMethod())
                && "/api/student/opportunities".equals(path)) {
            return true;
        }

        // Apply authentication checks only to student and coordinator APIs.
        if (!path.startsWith("/api/student/")
                && !path.startsWith("/api/coordinator/")) {
            return true;
        }

        // Retrieve the existing session without creating a new one.
        HttpSession session = request.getSession(false);

        // Reject requests without a valid login session.
        if (session == null
                || session.getAttribute("userId") == null
                || session.getAttribute("userRole") == null) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Please log in first.\"}");

            return false;
        }

        Object sessionUserId = session.getAttribute("userId");

        // Validate the user ID stored in the session.
        if (!(sessionUserId instanceof Number)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Invalid session. Please log in again.\"}");

            return false;
        }

        Long userId = ((Number) sessionUserId).longValue();

        // Confirm that the account still exists and remains active.
        User currentUser = userRepository.findById(userId);

        if (currentUser == null || !currentUser.isActive()) {
            session.invalidate();

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Your account is inactive or unavailable. "
                            + "Please contact the coordinator.\"}");

            return false;
        }

        String role = session.getAttribute("userRole").toString();

        // Identify the designated coordinator resume endpoints.
        boolean coordinatorResumeRequest =
                path.matches(
                        "/api/student/resume/coordinator/\\d+(/file)?");

        // Restrict other student APIs to student accounts.
        if (path.startsWith("/api/student/")
                && !coordinatorResumeRequest
                && !"STUDENT".equals(role)) {

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Student access only.\"}");

            return false;
        }

        // Restrict designated coordinator resume endpoints to coordinators.
        if (coordinatorResumeRequest
                && !"COORDINATOR".equals(role)) {

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Coordinator access only.\"}");

            return false;
        }

        // Restrict coordinator APIs to coordinator accounts.
        if (path.startsWith("/api/coordinator/")
                && !"COORDINATOR".equals(role)) {

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Coordinator access only.\"}");

            return false;
        }

        // All authentication and authorization checks passed.
        return true;
    }
}
