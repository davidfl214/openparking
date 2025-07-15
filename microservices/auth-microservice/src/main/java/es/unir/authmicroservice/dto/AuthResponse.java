package es.unir.authmicroservice.dto;

import es.unir.authmicroservice.model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {

    private Role role;

    private String email;

    private String name;

    private Set<String> parkingFavorites;
}
