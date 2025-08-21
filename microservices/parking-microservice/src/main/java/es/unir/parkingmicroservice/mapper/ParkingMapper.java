package es.unir.parkingmicroservice.mapper;

import es.unir.parkingmicroservice.dto.ParkingCreateDTO;
import es.unir.parkingmicroservice.model.Parking;

public class ParkingMapper {

    public static ParkingCreateDTO toDTO(Parking parking) {
        if (parking == null) {
            return null;
        }

        return ParkingCreateDTO.builder().name(parking.getName()).administratorEmail(parking.getAdministratorEmail())
                .location(parking.getLocation()).latitude(parking.getLatitude()).longitude(parking.getLongitude())
                .numberOfFloors(parking.getNumberOfFloors()).slotsPerFloor(parking.getSlotsPerFloor())
                .enabled(parking.isEnabled()).build();

    }

    public static Parking toEntity(ParkingCreateDTO parkingCreateDTO) {
        if (parkingCreateDTO == null) {
            return null;
        }

        return Parking.builder().name(parkingCreateDTO.getName()).administratorEmail(parkingCreateDTO.getAdministratorEmail())
                .location(parkingCreateDTO.getLocation()).latitude(parkingCreateDTO.getLatitude())
                .longitude(parkingCreateDTO.getLongitude()).numberOfFloors(parkingCreateDTO.getNumberOfFloors())
                .slotsPerFloor(parkingCreateDTO.getSlotsPerFloor()).enabled(parkingCreateDTO.isEnabled()).build();
    }
}
