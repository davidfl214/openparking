package es.unir.authmicroservice.service;

import es.unir.authmicroservice.dto.ModifyUserRequest;
import lombok.RequiredArgsConstructor;
import es.unir.authmicroservice.model.User;
import es.unir.authmicroservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String id, ModifyUserRequest modifiedUser) {
        if (userRepository.existsByEmail(modifiedUser.getEmail())) {
            User existingUser = userRepository.findByEmail(modifiedUser.getEmail()).orElse(null);
            if (existingUser != null && !existingUser.getId().equals(id)) {
                throw new IllegalArgumentException("El email ya está en uso por otro usuario");
            }
        }
        User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        user.setName(modifiedUser.getName());
        user.setEmail(modifiedUser.getEmail());
        user.setRole(modifiedUser.getRole());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
