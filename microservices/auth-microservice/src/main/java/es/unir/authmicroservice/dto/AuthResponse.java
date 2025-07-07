package es.unir.authmicroservice.dto;

import es.unir.authmicroservice.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String token;

    private Role role;

    private String email;

    private String name;
}
