package com.devcolor.studio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class GradientDTO {
    private Long id;

    @NotBlank
    private String name;

    @NotEmpty
    private List<String> colors;

    @NotBlank
    private String type; // "linear" or "radial"

    @NotNull
    private Integer angle;

    private LocalDateTime createdAt;

    // Constructors
    public GradientDTO() {}

    public GradientDTO(Long id, String name, List<String> colors, String type, Integer angle, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.colors = colors;
        this.type = type;
        this.angle = angle;
        this.createdAt = createdAt;
    }

    public GradientDTO(String name, List<String> colors, String type, Integer angle) {
        this.name = name;
        this.colors = colors;
        this.type = type;
        this.angle = angle;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getAngle() {
        return angle;
    }

    public void setAngle(Integer angle) {
        this.angle = angle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
