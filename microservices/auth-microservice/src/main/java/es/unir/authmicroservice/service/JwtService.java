package es.unir.authmicroservice.service;

import es.unir.authmicroservice.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private Key key;
    private final long expiration = 1000 * 60 * 60 * 24;

    @PostConstruct
    public void init() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateToken(User user) {
        return Jwts.builder().setSubject(user.getEmail()).claim("role", user.getRole().name()).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration)).signWith(key).compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token, User user) {
        String username = extractUsername(token);
        return username.equals(user.getEmail()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getExpiration()
                .before(new Date());
    }
}

