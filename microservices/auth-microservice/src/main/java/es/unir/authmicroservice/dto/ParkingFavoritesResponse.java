package es.unir.authmicroservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class ParkingFavoritesResponse {

    private Set<String> parkingFavorites;

}
