package com.portfolio.config;

import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository repository;

    public DataSeeder(ProjectRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            List<Project> projects = Arrays.asList(
                    new Project(
                            "E-Commerce Platform",
                            "A full-stack e-commerce application with payment gateway integration.",
                            "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            Arrays.asList("Java", "Spring Boot", "React", "MySQL"),
                            "https://github.com/user/ecommerce",
                            "https://ecommerce-demo.com"),
                    new Project(
                            "Task Manager API",
                            "RESTful API for managing tasks and collaborative projects.",
                            "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            Arrays.asList("Node.js", "Express", "MongoDB", "Docker"),
                            "https://github.com/user/taskmanager",
                            "https://api.taskmanager.com"),
                    new Project(
                            "Portfolio Website",
                            "Personal portfolio website showcasing projects and skills.",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            Arrays.asList("HTML", "CSS", "JavaScript", "Spring Boot"),
                            "https://github.com/user/portfolio",
                            "https://myportfolio.com"));

            repository.saveAll(projects);
            System.out.println("Seeded " + projects.size() + " projects.");
        }
    }
}
