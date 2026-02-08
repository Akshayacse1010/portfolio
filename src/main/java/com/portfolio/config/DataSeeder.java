package com.portfolio.config;

import com.portfolio.model.Project;
import com.portfolio.model.BlogPost;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.service.BlogService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final BlogService blogService;

    public DataSeeder(ProjectRepository projectRepository, BlogService blogService) {
        this.projectRepository = projectRepository;
        this.blogService = blogService;
    }

    @Override
    public void run(String... args) throws Exception {
        seedProjects();
        seedBlogPosts();
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
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

            projectRepository.saveAll(projects);
            System.out.println("Seeded " + projects.size() + " projects.");
        }
    }

    private void seedBlogPosts() {
        try {
            blogService.deleteAll();

            // In a real jar, we need to use ResourcePatternResolver
            // For now, this simple approach works for local dev/exploded directories
            // Or we can list specific files if directory listing is tricky in JARs
            // For simplicity in this demo, let's look for known files or use a pattern
            // resolver

            // Using Spring's ResourcePatternResolver is better
            org.springframework.core.io.support.ResourcePatternResolver resolver = new org.springframework.core.io.support.PathMatchingResourcePatternResolver();
            org.springframework.core.io.Resource[] resources = resolver.getResources("classpath:posts/*.md");

            for (org.springframework.core.io.Resource resource : resources) {
                parseAndSavePost(resource);
            }

            System.out.println("Seeded blog posts from " + resources.length + " files.");

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to seed blog posts: " + e.getMessage());
        }
    }

    private void parseAndSavePost(org.springframework.core.io.Resource resource) {
        try (java.io.BufferedReader reader = new java.io.BufferedReader(
                new java.io.InputStreamReader(resource.getInputStream()))) {
            String line;
            boolean inFrontMatter = false;

            String title = "";
            String slug = "";
            String dateStr = "";
            String tagsStr = "";
            String image = "";
            String summary = "";
            StringBuilder content = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                if (line.trim().equals("---")) {
                    inFrontMatter = !inFrontMatter;
                    continue;
                }

                if (inFrontMatter) {
                    if (line.startsWith("title:"))
                        title = line.substring(6).trim();
                    else if (line.startsWith("slug:"))
                        slug = line.substring(5).trim();
                    else if (line.startsWith("date:"))
                        dateStr = line.substring(5).trim();
                    else if (line.startsWith("tags:"))
                        tagsStr = line.substring(5).trim();
                    else if (line.startsWith("image:"))
                        image = line.substring(6).trim();
                    else if (line.startsWith("summary:"))
                        summary = line.substring(8).trim();
                } else {
                    content.append(line).append("\n");
                }
            }

            List<String> tags = Arrays.asList(tagsStr.split(","));
            // Clean tags
            tags.replaceAll(String::trim);

            // Parse date
            java.time.LocalDate date = java.time.LocalDate.now();
            try {
                if (!dateStr.isEmpty())
                    date = java.time.LocalDate.parse(dateStr);
            } catch (Exception e) {
                System.err.println("Could not parse date: " + dateStr);
            }

            BlogPost post = new BlogPost(title, slug, content.toString(), summary, date, image, tags);
            blogService.savePost(post);
            System.out.println("Loaded post: " + title);

        } catch (Exception e) {
            System.err.println("Error reading file: " + resource.getFilename());
            e.printStackTrace();
        }
    }
}
