package com.spit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.spit.repository.CoordinatorProfileRepository;
import com.spit.repository.DashboardRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    private final CoordinatorProfileRepository profileRepository;
    private final DashboardRepository dashboardRepository;

    public CoordinatorController(
            DashboardRepository dashboardRepository,
            CoordinatorProfileRepository profileRepository) {

        this.dashboardRepository = dashboardRepository;
        this.profileRepository = profileRepository;
    }

    /**
     * Tests whether the Coordinator API is accessible.
     */
    @GetMapping("/test")
    public Map<String, String> test() {

        return Map.of(
                "message",
                "Coordinator API accessed successfully."
        );
    }

    /**
     * Retrieves Coordinator Dashboard statistics.
     */
    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {

        return dashboardRepository.getDashboardStats();
    }

    /**
     * Retrieves applications for the Coordinator.
     */
    @GetMapping("/applications")
    public List<Map<String, Object>> getCoordinatorApplications() {

        return dashboardRepository.getCoordinatorApplications();
    }

    /**
     * Retrieves statistics for Placement Reports.
     */
    @GetMapping("/placement-report-stats")
    public Map<String, Object> getPlacementReportStats() {

        return dashboardRepository.getPlacementReportStats();
    }

    /**
     * Retrieves the profile of the logged-in Coordinator.
     */
    @GetMapping("/profile")
    public Map<String, Object> getProfile(HttpSession session) {

        Long userId = ((Number) session.getAttribute("userId")).longValue();

        try {
            return profileRepository.getProfile(userId);
        } catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Coordinator profile not found."
            );
        }
    }

    /**
     * Updates the profile of the logged-in Coordinator.
     */
    @PutMapping("/profile")
    public Map<String, String> updateProfile(
            @RequestBody Map<String, String> request,
            HttpSession session) {

        Long userId = ((Number) session.getAttribute("userId")).longValue();

        String name = request.getOrDefault("name", "").trim();
        String email = request.getOrDefault("email", "").trim();
        String phone = request.getOrDefault("phone", "").trim();

        if (name.isEmpty() || email.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Coordinator name and email are required."
            );
        }

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a valid email address."
            );
        }

        int updated = profileRepository.updateProfile(
                userId,
                name,
                email,
                phone.isEmpty() ? null : phone
        );

        if (updated == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Coordinator profile not found."
            );
        }

        return Map.of(
                "message",
                "Coordinator profile saved successfully."
        );
    }
}
