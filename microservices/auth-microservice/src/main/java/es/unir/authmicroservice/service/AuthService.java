package es.unir.authmicroservice.service;

import es.unir.authmicroservice.dto.AuthResponse;
import es.unir.authmicroservice.dto.LoginRequest;
import es.unir.authmicroservice.dto.LoginResult;
import es.unir.authmicroservice.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import es.unir.authmicroservice.model.Role;
import es.unir.authmicroservice.model.User;
import es.unir.authmicroservice.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadCredentialsException("Las credenciales no son válidas");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.USER);

        userRepository.save(newUser);

        String token = jwtService.generateToken(newUser);

        return AuthResponse.builder()
                .role(newUser.getRole())
                .email(newUser.getEmail())
                .name(newUser.getName())
                .build();
    }

    public LoginResult login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Las credenciales no son válidas"));

        String token = jwtService.generateToken(user);

        return LoginResult.builder()
                .token(token)
                .role(user.getRole())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}

