package com.devcolor.studio.service;

import com.devcolor.studio.dto.AuthRequest;
import com.devcolor.studio.dto.AuthResponse;
import com.devcolor.studio.dto.RegisterRequest;

public interface UserService {
    AuthResponse authenticateUser(AuthRequest authRequest);
    void registerUser(RegisterRequest registerRequest);
}
