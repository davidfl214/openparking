package es.unir.parkingmicroservice.repository;

import es.unir.parkingmicroservice.model.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, String> {

    List<ParkingSlot> findByParkingId(String parkingId);

    Optional<ParkingSlot> findByParkingIdAndFloorAndSlot(String parkingId, Integer floor, Integer slot);
}
