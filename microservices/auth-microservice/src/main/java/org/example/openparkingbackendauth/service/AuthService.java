package org.example.openparkingbackendauth.service;

import lombok.RequiredArgsConstructor;
import org.example.openparkingbackendauth.dto.AuthResponse;
import org.example.openparkingbackendauth.dto.LoginRequest;
import org.example.openparkingbackendauth.dto.RegisterRequest;
import org.example.openparkingbackendauth.model.Role;
import org.example.openparkingbackendauth.model.User;
import org.example.openparkingbackendauth.repository.UserRepository;
import org.example.openparkingbackendauth.security.CustomUserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var token = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        var token = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(token);
    }
}

