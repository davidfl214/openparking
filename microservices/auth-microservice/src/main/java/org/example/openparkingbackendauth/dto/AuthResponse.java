package org.example.openparkingbackendauth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor // 👈 Necesario para que Spring pueda usarlo
public class AuthResponse {
    private String token;
}
