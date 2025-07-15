package es.unir.authmicroservice.controller;

import es.unir.authmicroservice.dto.AuthResponse;
import es.unir.authmicroservice.dto.LoginRequest;
import es.unir.authmicroservice.dto.LoginResult;
import es.unir.authmicroservice.dto.RegisterRequest;
import es.unir.authmicroservice.model.Role;
import es.unir.authmicroservice.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {

        LoginResult loginResult = authService.login(request);

        Cookie jwtCookie = new Cookie("jwt", loginResult.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(60 * 60 * 24);
        jwtCookie.setPath("/");
        jwtCookie.setSecure(true);

        response.addCookie(jwtCookie);

        return ResponseEntity.ok(AuthResponse.builder().role(loginResult.getRole()).name(loginResult.getName()).email(loginResult.getEmail()).favouritesParkings(loginResult.getFavouritesParkings()).build());
    }

    @PatchMapping("/favorite-parking")
    public ResponseEntity<AuthResponse> addParkingToFavorites(@RequestParam String parkingId, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            throw new BadCredentialsException("Token inválido");
        }

        return ResponseEntity.ok(authService.addParkingToFavorites(token, parkingId));
    }

    @DeleteMapping("/favorite-parking")
    public ResponseEntity<AuthResponse> removeParkingFromFavorites(@RequestParam String parkingId, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            throw new BadCredentialsException("Token inválido");
        }

        return ResponseEntity.ok(authService.removeParkingFromFavorites(token, parkingId));
    }

}
