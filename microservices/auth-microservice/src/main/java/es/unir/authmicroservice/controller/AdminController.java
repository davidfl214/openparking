package es.unir.authmicroservice.controller;

import es.unir.authmicroservice.dto.AuthResponse;
import es.unir.authmicroservice.dto.LoginRequest;
import es.unir.authmicroservice.dto.ModifyUserRequest;
import lombok.RequiredArgsConstructor;
import es.unir.authmicroservice.model.Role;
import es.unir.authmicroservice.model.User;
import es.unir.authmicroservice.service.AdminService;
import es.unir.authmicroservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody ModifyUserRequest modifiedUser) {
        return ResponseEntity.ok(adminService.updateUser(id, modifiedUser));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
