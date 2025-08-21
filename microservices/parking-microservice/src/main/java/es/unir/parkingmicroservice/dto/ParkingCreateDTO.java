package es.unir.parkingmicroservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingCreateDTO {

    private String name;

    private String administratorEmail;

    private String location;

    private Double latitude;

    private Double longitude;

    private Integer numberOfFloors;

    private Integer slotsPerFloor;

    private boolean enabled;

}
