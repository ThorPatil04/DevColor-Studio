package com.devcolor.studio.service;

import com.devcolor.studio.dto.PaletteDTO;

import java.util.List;

public interface PaletteService {
    PaletteDTO savePalette(PaletteDTO paletteDTO, String username);
    List<PaletteDTO> getSavedPalettes(String username);
    void deletePalette(Long paletteId, String username);
}
