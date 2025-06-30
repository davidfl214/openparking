package org.example.openparkingbackendauth.controller;

import lombok.RequiredArgsConstructor;
import org.example.openparkingbackendauth.dto.AuthResponse;
import org.example.openparkingbackendauth.dto.LoginRequest;
import org.example.openparkingbackendauth.dto.RegisterRequest;
import org.example.openparkingbackendauth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
