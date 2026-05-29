package com.devcolor.studio.service;

import com.devcolor.studio.dto.PaletteDTO;
import com.devcolor.studio.exception.BadRequestException;
import com.devcolor.studio.exception.ResourceNotFoundException;
import com.devcolor.studio.model.Palette;
import com.devcolor.studio.model.User;
import com.devcolor.studio.repository.PaletteRepository;
import com.devcolor.studio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaletteServiceImpl implements PaletteService {

    @Autowired
    private PaletteRepository paletteRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public PaletteDTO savePalette(PaletteDTO paletteDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        String colorsString = String.join(",", paletteDTO.getColors());

        // Use direct constructor call
        Palette palette = new Palette(paletteDTO.getName(), colorsString, user);

        Palette saved = paletteRepository.save(palette);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaletteDTO> getSavedPalettes(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Palette> palettes = paletteRepository.findByCreatedByOrderByCreatedAtDesc(user);
        return palettes.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePalette(Long paletteId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Palette palette = paletteRepository.findById(paletteId)
                .orElseThrow(() -> new ResourceNotFoundException("Palette not found with id: " + paletteId));

        // Security check: Verify that user owns the palette
        if (!palette.getCreatedBy().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to delete this palette!");
        }

        paletteRepository.delete(palette);
    }

    private PaletteDTO mapToDTO(Palette palette) {
        List<String> colorsList = Arrays.asList(palette.getColors().split(","));

        // Use direct constructor call
        return new PaletteDTO(
                palette.getId(),
                palette.getName(),
                colorsList,
                palette.getCreatedAt()
        );
    }
}
