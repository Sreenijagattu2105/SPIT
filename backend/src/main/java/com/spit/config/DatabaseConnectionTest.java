package com.spit.config;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseConnectionTest {

    public static void main(String[] args) {

        try (
                AnnotationConfigApplicationContext context =
                        new AnnotationConfigApplicationContext(
                                DatabaseConfig.class
                        )
        ) {
            JdbcTemplate jdbcTemplate =
                    context.getBean(JdbcTemplate.class);

            String database = jdbcTemplate.queryForObject(
                    "SELECT DATABASE()",
                    String.class
            );

            System.out.println("Database connected successfully!");
            System.out.println("Current database: " + database);
        }
    }
}
