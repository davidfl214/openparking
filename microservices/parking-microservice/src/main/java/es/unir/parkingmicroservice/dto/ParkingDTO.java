package es.unir.parkingmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingDTO {

    private String name;

    private String administratorEmail;

    private String location;

    private Integer numberOfFloors;

    private Integer slotsPerFloor;

    private boolean enabled;

}
