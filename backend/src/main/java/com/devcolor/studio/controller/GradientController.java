package com.devcolor.studio.controller;

import com.devcolor.studio.dto.GradientDTO;
import com.devcolor.studio.service.GradientService;
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
@RequestMapping("/api/gradients")
public class GradientController {

    @Autowired
    private GradientService gradientService;

    @PostMapping
    public ResponseEntity<GradientDTO> saveGradient(@Valid @RequestBody GradientDTO gradientDTO, Principal principal) {
        GradientDTO saved = gradientService.saveGradient(gradientDTO, principal.getName());
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GradientDTO>> getSavedGradients(Principal principal) {
        List<GradientDTO> gradients = gradientService.getSavedGradients(principal.getName());
        return ResponseEntity.ok(gradients);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteGradient(@PathVariable Long id, Principal principal) {
        gradientService.deleteGradient(id, principal.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Gradient deleted successfully!");
        return ResponseEntity.ok(response);
    }
}
