package org.example.openparkingbackendauth.controller;

import lombok.RequiredArgsConstructor;
import org.example.openparkingbackendauth.model.Role;
import org.example.openparkingbackendauth.model.User;
import org.example.openparkingbackendauth.service.AdminService;
import org.example.openparkingbackendauth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = authService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
        }

        if (!user.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(403).body(Map.of("message", "Acceso denegado: no eres administrador"));
        }

        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().name(),
                "email", user.getEmail(),
                "name", user.getEmail()
        ));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(adminService.updateUser(id, updatedUser));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado correctamente"));
    }
}
