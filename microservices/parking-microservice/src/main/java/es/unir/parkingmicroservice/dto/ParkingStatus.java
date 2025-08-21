package es.unir.parkingmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingStatus {

    private String id;

    private String name;

    private String location;

    private Double latitude;

    private Double longitude;

    private Integer totalSlots;

    private Integer occupiedSlots;

    private boolean enabled;
}
