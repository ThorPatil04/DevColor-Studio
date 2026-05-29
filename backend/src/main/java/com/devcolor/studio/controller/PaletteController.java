package com.devcolor.studio.controller;

import com.devcolor.studio.dto.PaletteDTO;
import com.devcolor.studio.service.PaletteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/palettes")
public class PaletteController {

    @Autowired
    private PaletteService paletteService;

    @PostMapping
    public ResponseEntity<PaletteDTO> savePalette(@Valid @RequestBody PaletteDTO paletteDTO, Principal principal) {
        PaletteDTO saved = paletteService.savePalette(paletteDTO, principal.getName());
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PaletteDTO>> getSavedPalettes(Principal principal) {
        List<PaletteDTO> palettes = paletteService.getSavedPalettes(principal.getName());
        return ResponseEntity.ok(palettes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePalette(@PathVariable Long id, Principal principal) {
        paletteService.deletePalette(id, principal.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Palette deleted successfully!");
        return ResponseEntity.ok(response);
    }
}
