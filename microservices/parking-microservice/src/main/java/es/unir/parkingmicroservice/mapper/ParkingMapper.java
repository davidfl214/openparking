package es.unir.parkingmicroservice.mapper;

import es.unir.parkingmicroservice.dto.ParkingDTO;
import es.unir.parkingmicroservice.model.Parking;

public class ParkingMapper {

    public static ParkingDTO toDTO(Parking parking){
        if (parking == null) {
            return null;
        }

        return ParkingDTO.builder()
                .name(parking.getName())
                .administratorEmail(parking.getAdministratorEmail())
                .location(parking.getLocation())
                .numberOfFloors(parking.getNumberOfFloors())
                .slotsPerFloor(parking.getSlotsPerFloor())
                .enabled(parking.isEnabled())
                .build();

    }

    public static Parking toEntity(ParkingDTO parkingDTO) {
        if (parkingDTO == null) {
            return null;
        }

        return Parking.builder()
                .name(parkingDTO.getName())
                .administratorEmail(parkingDTO.getAdministratorEmail())
                .location(parkingDTO.getLocation())
                .numberOfFloors(parkingDTO.getNumberOfFloors())
                .slotsPerFloor(parkingDTO.getSlotsPerFloor())
                .enabled(parkingDTO.isEnabled())
                .build();
    }
}
