package es.unir.authmicroservice.dto;

import es.unir.authmicroservice.model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class LoginResult {

    private String token;

    private String email;

    private String name;

    private Role role;

    private Set<String> parkingFavorites;
}
