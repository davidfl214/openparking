package es.unir.authmicroservice.controller;

import es.unir.authmicroservice.dto.ModifyUserRequest;
import lombok.RequiredArgsConstructor;
import es.unir.authmicroservice.model.User;
import es.unir.authmicroservice.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody ModifyUserRequest modifiedUser) {
        return ResponseEntity.ok(adminService.updateUser(id, modifiedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
