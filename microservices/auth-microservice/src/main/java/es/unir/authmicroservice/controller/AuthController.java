package es.unir.authmicroservice.controller;

import es.unir.authmicroservice.dto.*;
import es.unir.authmicroservice.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        jwtCookie.setDomain("openparking.me");

        response.addCookie(jwtCookie);

        return ResponseEntity.ok(AuthResponse.builder().role(loginResult.getRole()).name(loginResult.getName())
                .email(loginResult.getEmail()).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(0);
        jwtCookie.setPath("/");
        jwtCookie.setSecure(true);

        response.addCookie(jwtCookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateResponse> validateToken(HttpServletRequest request) {
        String token = getToken(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.validateToken(token));
    }

    @GetMapping("/favorite-parkings")
    public ResponseEntity<ParkingFavoritesResponse> getFavoriteParkings(HttpServletRequest request) {
        String token = getToken(request);
        return ResponseEntity.ok(authService.getFavoriteParkings(token));
    }

    @PatchMapping("/favorite-parking")
    public ResponseEntity<ParkingFavoritesResponse> addParkingToFavorites(@RequestParam String parkingId,
                                                                          HttpServletRequest request) {
        String token = getToken(request);
        return ResponseEntity.ok(authService.addParkingToFavorites(parkingId, token));
    }

    @DeleteMapping("/favorite-parking")
    public ResponseEntity<ParkingFavoritesResponse> removeParkingFromFavorites(@RequestParam String parkingId,
                                                                               HttpServletRequest request) {
        String token = getToken(request);
        return ResponseEntity.ok(authService.removeParkingFromFavorites(parkingId, token));
    }

    public String getToken(HttpServletRequest request) {
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
        return token;
    }

}
