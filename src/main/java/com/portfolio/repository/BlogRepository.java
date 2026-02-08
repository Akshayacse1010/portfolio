package com.portfolio.repository;

import com.portfolio.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface BlogRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);

    List<BlogPost> findAllByOrderByDateDesc();
}
