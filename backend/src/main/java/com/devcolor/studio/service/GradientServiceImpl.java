package com.devcolor.studio.service;

import com.devcolor.studio.dto.GradientDTO;
import com.devcolor.studio.exception.BadRequestException;
import com.devcolor.studio.exception.ResourceNotFoundException;
import com.devcolor.studio.model.Gradient;
import com.devcolor.studio.model.User;
import com.devcolor.studio.repository.GradientRepository;
import com.devcolor.studio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradientServiceImpl implements GradientService {

    @Autowired
    private GradientRepository gradientRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public GradientDTO saveGradient(GradientDTO gradientDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        String colorsString = String.join(",", gradientDTO.getColors());

        // Use direct constructor call
        Gradient gradient = new Gradient(
                gradientDTO.getName(),
                colorsString,
                gradientDTO.getType(),
                gradientDTO.getAngle(),
                user
        );

        Gradient saved = gradientRepository.save(gradient);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradientDTO> getSavedGradients(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Gradient> gradients = gradientRepository.findByCreatedByOrderByCreatedAtDesc(user);
        return gradients.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteGradient(Long gradientId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Gradient gradient = gradientRepository.findById(gradientId)
                .orElseThrow(() -> new ResourceNotFoundException("Gradient not found with id: " + gradientId));

        // Security check: Verify that user owns the gradient
        if (!gradient.getCreatedBy().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to delete this gradient!");
        }

        gradientRepository.delete(gradient);
    }

    private GradientDTO mapToDTO(Gradient gradient) {
        List<String> colorsList = Arrays.asList(gradient.getColors().split(","));

        // Use direct constructor call
        return new GradientDTO(
                gradient.getId(),
                gradient.getName(),
                colorsList,
                gradient.getType(),
                gradient.getAngle(),
                gradient.getCreatedAt()
        );
    }
}
