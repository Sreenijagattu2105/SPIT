package com.spit;

import java.util.Scanner;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.spit.config.DatabaseConfig;
import com.spit.model.User;
import com.spit.repository.UserRepository;
import com.spit.security.PasswordConfig;

public class CoordinatorSetup {

    @Configuration
    @ComponentScan(basePackages = "com.spit.repository")
    static class SetupConfig {
    }

    public static void main(String[] args) {

        try (
                Scanner scanner = new Scanner(System.in);
                AnnotationConfigApplicationContext context =
                        new AnnotationConfigApplicationContext()
        ) {
            context.register(
                    DatabaseConfig.class,
                    PasswordConfig.class,
                    SetupConfig.class
            );

            context.refresh();

            UserRepository userRepository =
                    context.getBean(UserRepository.class);

            PasswordEncoder passwordEncoder =
                    context.getBean(PasswordEncoder.class);

            System.out.print("Enter coordinator full name: ");
            String fullName = scanner.nextLine().trim();

            System.out.print("Enter coordinator email: ");
            String email = scanner.nextLine().trim().toLowerCase();

            System.out.print("Enter a strong coordinator password: ");
            String password = scanner.nextLine();

            if (fullName.isBlank()
                    || email.isBlank()
                    || password.length() < 12) {

                System.out.println(
                        "Name and email are required. "
                                + "Password must contain at least 12 characters."
                );

                return;
            }

            if (userRepository.emailExists(email)) {
                System.out.println(
                        "This email already exists. No account was created."
                );

                return;
            }

            User coordinator = new User();
            coordinator.setFullName(fullName);
            coordinator.setEmail(email);

            String passwordHash = passwordEncoder.encode(password);

            userRepository.saveCoordinator(coordinator, passwordHash);

            System.out.println(
                    "Coordinator account created successfully!"
            );

        } catch (Exception e) {
            System.err.println(
                    "Coordinator setup failed: " + e.getMessage()
            );
        }
    }
}
