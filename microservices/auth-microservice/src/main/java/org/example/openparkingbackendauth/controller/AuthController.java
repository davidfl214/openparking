package org.example.openparkingbackendauth.controller;

import lombok.RequiredArgsConstructor;
import org.example.openparkingbackendauth.model.Role;
import org.example.openparkingbackendauth.model.User;
import org.example.openparkingbackendauth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        Timestamp createdAt = new Timestamp(System.currentTimeMillis());
        Timestamp updatedAt = new Timestamp(System.currentTimeMillis());
        String token = authService.register(name, email, password, Role.USER, createdAt, updatedAt);

        return ResponseEntity.ok(Map.of(
                "token", token, "role", Role.USER.name(), "email", email
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of(
                "token", token, "role", Role.USER.name(), "email", email, "name", name
        ));
    }

}
