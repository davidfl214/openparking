package es.unir.parkingmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NewParkingEvent {
    private String parkingId;
    private Integer numberOfFloors;
    private Integer slotsPerFloor;
    private String type;
}
