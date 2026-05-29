package com.devcolor.studio.repository;

import com.devcolor.studio.model.Palette;
import com.devcolor.studio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaletteRepository extends JpaRepository<Palette, Long> {
    List<Palette> findByCreatedByOrderByCreatedAtDesc(User createdBy);
}
