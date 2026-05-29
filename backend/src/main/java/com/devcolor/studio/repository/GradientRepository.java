package com.devcolor.studio.repository;

import com.devcolor.studio.model.Gradient;
import com.devcolor.studio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradientRepository extends JpaRepository<Gradient, Long> {
    List<Gradient> findByCreatedByOrderByCreatedAtDesc(User createdBy);
}
