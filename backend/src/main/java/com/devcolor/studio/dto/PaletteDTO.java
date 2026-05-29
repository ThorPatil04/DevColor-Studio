package com.devcolor.studio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.List;

public class PaletteDTO {
    private Long id;

    @NotBlank
    private String name;

    @NotEmpty
    private List<String> colors;

    private LocalDateTime createdAt;

    // Constructors
    public PaletteDTO() {}

    public PaletteDTO(Long id, String name, List<String> colors, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.colors = colors;
        this.createdAt = createdAt;
    }

    public PaletteDTO(String name, List<String> colors) {
        this.name = name;
        this.colors = colors;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
