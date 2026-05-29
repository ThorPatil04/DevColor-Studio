package com.devcolor.studio.service;

import com.devcolor.studio.dto.GradientDTO;

import java.util.List;

public interface GradientService {
    GradientDTO saveGradient(GradientDTO gradientDTO, String username);
    List<GradientDTO> getSavedGradients(String username);
    void deleteGradient(Long gradientId, String username);
}
