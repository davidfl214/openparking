package es.unir.parkingmicroservice.repository;

import es.unir.parkingmicroservice.model.ParkingSlot;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository extends MongoRepository<ParkingSlot, String> {

    List<ParkingSlot> findByParkingId(String parkingId);

    Optional<ParkingSlot> findByParkingIdAndFloorAndSlot(String parkingId, Integer floor, Integer slot);

    List<ParkingSlot> findByParkingId(String parkingId);
    List<ParkingSlot> findByIsOccupied(boolean isOccupied);
}
