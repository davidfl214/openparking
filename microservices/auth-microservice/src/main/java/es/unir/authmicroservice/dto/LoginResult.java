package es.unir.authmicroservice.dto;

import es.unir.authmicroservice.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResult {

    private String token;

    private String email;

    private String name;

    private Role role;
}
