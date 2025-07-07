package es.unir.authmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {

    private String name;

    private String email;

    private String password;
}
