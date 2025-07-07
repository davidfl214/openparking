package es.unir.authmicroservice.dto;

import es.unir.authmicroservice.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ModifyUserRequest {

    private String name;

    private String email;

    private Role role;

}
