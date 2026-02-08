package com.portfolio.service;

import com.portfolio.model.BlogPost;
import com.portfolio.repository.BlogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    private final BlogRepository repository;

    public BlogService(BlogRepository repository) {
        this.repository = repository;
    }

    public List<BlogPost> getAllPosts() {
        return repository.findAllByOrderByDateDesc();
    }

    public Optional<BlogPost> getPostBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    public void savePost(BlogPost post) {
        repository.save(post);
    }

    public void deleteAll() {
        repository.deleteAll();
    }
}
