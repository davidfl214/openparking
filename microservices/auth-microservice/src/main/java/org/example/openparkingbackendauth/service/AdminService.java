package org.example.openparkingbackendauth.service;

import lombok.RequiredArgsConstructor;
import org.example.openparkingbackendauth.model.User;
import org.example.openparkingbackendauth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword()); // recuerda cifrar si hace falta
        user.setRole(updatedUser.getRole());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
