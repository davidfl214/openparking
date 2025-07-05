package es.unir.parkingmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingSlotDetail {
    private Integer floor;
    private Integer slot;
    private boolean isOccupied;
}
