package es.unir.parkingmicroservice.security;

import es.unir.parkingmicroservice.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        final String userRole;

        if (authHeader != null || authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            log.debug("Extracted JWT from Authorization Header: {}", jwt);
        } else {
            Cookie[] cookies = request.getCookies();
            String jwtCookieValue = null;
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        jwtCookieValue = cookie.getValue();
                        break;
                    }
                }
            }
            if (jwtCookieValue != null) {
                jwt = jwtCookieValue;
                log.debug("Extracted JWT from Cookie: {}", jwt);
            } else {
                log.debug("No JWT found in Authorization Header or Cookies");
                filterChain.doFilter(request, response);
                return;
            }
        }

        if (jwtService.isTokenValid(jwt)) {
            userEmail = jwtService.extractUserEmail(jwt);
            userRole = jwtService.extractUserRole(jwt);

            if (userEmail != null && userRole != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {
                List<SimpleGrantedAuthority> authorities =
                        Collections.singletonList(new SimpleGrantedAuthority(userRole));

                UserDetails userDetails = new User(userEmail, "", authorities);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("JWT is valid for user: {}, role: {}", userEmail, userRole);
            } else {
                log.debug("JWT is invalid or expired for user: {}", userEmail);
            }
        }

        filterChain.doFilter(request, response);
    }
}
