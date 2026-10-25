package com.spit.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spit.model.User;
import com.spit.repository.CoordinatorNotificationRepository;
import com.spit.repository.UserRepository;

/**
 * Handles user registration, authentication, and password management
 * for the SPIT application.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CoordinatorNotificationRepository notificationRepository;

    /**
     * Initializes the service with the required dependencies.
     */
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CoordinatorNotificationRepository notificationRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
    }

    /**
     * Registers a new student and notifies coordinators who enabled
     * registration notifications.
     *
     * @param user student details submitted during registration
     */
    @Transactional
    public void registerStudent(User user) {

        // Validate the student's full name.
        if (user.getFullName() == null
                || user.getFullName().isBlank()) {
            throw new IllegalArgumentException(
                    "Full name is required.");
        }

        // Validate and normalize the email address.
        if (user.getEmail() == null
                || user.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required.");
        }

        user.setEmail(user.getEmail().trim().toLowerCase());

        if (!user.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException(
                    "Enter a valid email address.");
        }

        // Validate the password.
        if (user.getPassword() == null
                || user.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters.");
        }

        // Prevent duplicate student registrations.
        if (userRepository.emailExists(user.getEmail())) {
            throw new IllegalArgumentException(
                    "This email is already registered.");
        }

        // Hash the password before saving the user.
        String passwordHash =
                passwordEncoder.encode(user.getPassword());

        userRepository.save(user, passwordHash);

        // Retrieve the newly registered user.
        User savedUser =
                userRepository.findByEmail(user.getEmail());

        if (savedUser == null) {
            throw new IllegalStateException(
                    "Could not retrieve the newly registered user.");
        }

        // Save the student's phone number.
        userRepository.saveStudentPhone(
                savedUser.getUserId(),
                user.getPhone()
        );

        // Notify coordinators who enabled registration notifications.
        Long studentId = savedUser.getUserId();

        String notificationMessage =
                "New student account registered: "
                        + savedUser.getFullName();

        for (Long coordinatorId :
                notificationRepository
                        .getCoordinatorsForRegistrationNotifications()) {

            notificationRepository.createNotification(
                    coordinatorId,
                    "REGISTERED_ACCOUNT",
                    notificationMessage,
                    studentId,
                    null,
                    null
            );
        }
    }

    /**
     * Authenticates a user using their email and password.
     *
     * @param email user's email address
     * @param password plain-text password supplied during login
     * @return authenticated user without the stored password hash
     */
    public User login(String email, String password) {

        // Validate login credentials.
        if (email == null || email.isBlank()
                || password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Email and password are required.");
        }

        // Find the account using a normalized email address.
        User user = userRepository.findByEmail(
                email.trim().toLowerCase());

        // Reject invalid credentials.
        if (user == null
                || !passwordEncoder.matches(
                        password, user.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid email or password.");
        }

        // Reject deactivated accounts.
        if (!user.isActive()) {
            throw new IllegalArgumentException(
                    "Your account has been deactivated. "
                            + "Please contact the coordinator.");
        }

        // Allow only supported application roles.
        if (!"STUDENT".equals(user.getRole())
                && !"COORDINATOR".equals(user.getRole())) {
            throw new IllegalArgumentException(
                    "Invalid account role.");
        }

        // Never expose the stored password hash.
        user.setPassword(null);

        return user;
    }

    /**
     * Changes a user's password after validating the current password.
     *
     * @param userId ID of the account
     * @param currentPassword current password
     * @param newPassword requested new password
     */
    @Transactional
    public void changePassword(
            Long userId,
            String currentPassword,
            String newPassword) {

        // Validate the supplied password fields.
        if (currentPassword == null || currentPassword.isBlank()
                || newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException(
                    "All password fields are required.");
        }

        // Enforce the minimum password length.
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "New password must contain at least 8 characters.");
        }

        // Find the account whose password must be changed.
        User user = userRepository.findById(userId);

        if (user == null) {
            throw new IllegalArgumentException(
                    "User account not found.");
        }

        // Verify the current password.
        if (!passwordEncoder.matches(
                currentPassword, user.getPassword())) {
            throw new IllegalArgumentException(
                    "Current password is incorrect.");
        }

        // Prevent reusing the current password.
        if (passwordEncoder.matches(
                newPassword, user.getPassword())) {
            throw new IllegalArgumentException(
                    "New password must differ from the current password.");
        }

        // Hash the new password before updating the database.
        String newPasswordHash =
                passwordEncoder.encode(newPassword);

        int updatedRows = userRepository.updatePassword(
                userId,
                newPasswordHash
        );

        // Ensure exactly one account was updated.
        if (updatedRows != 1) {
            throw new IllegalStateException(
                    "Could not update the password.");
        }
    }
}
