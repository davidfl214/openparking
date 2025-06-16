package es.unir.parkingmicroservice.service;

import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.model.ParkingSlot;
import es.unir.parkingmicroservice.repository.ParkingSlotRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;

    public void generateInitialParkingSlots(Parking parking) {
        List<ParkingSlot> parkingSlots = new ArrayList<>();
        for (int floor = 1; floor <= parking.getNumberOfFloors(); floor++) {
            for (int slot = 1; slot <= parking.getSlotsPerFloor(); slot++) {
                ParkingSlot parkingSlot = ParkingSlot.builder()
                        .parking(parking)
                        .floor(floor)
                        .slot(slot)
                        .occupied(false)
                        .build();
                parkingSlots.add(parkingSlot);
            }
        }
        parkingSlotRepository.saveAll(parkingSlots);
    }

    public void deleteParkingSlotsByParkingId(String parkingId) {
        List<ParkingSlot> parkingSlots = parkingSlotRepository.findByParkingId(parkingId);
        if (!parkingSlots.isEmpty()) {
            parkingSlotRepository.deleteAll(parkingSlots);
        } else {
            throw new IllegalArgumentException("No parking slots found for parking with id " + parkingId);
        }
    }

    @Transactional
    public void updateSlotOccupancy(String parkingId, Integer floor, Integer slot, boolean isOccupied, LocalDateTime messageTimestamp) {
        try{
            Optional<ParkingSlot> slotOptional = parkingSlotRepository.findByParkingIdAndFloorAndSlot(parkingId, floor, slot);
            if (slotOptional.isPresent()) {
                ParkingSlot parkingSlot = slotOptional.get();

                if (parkingSlot.getLastUpdated() != null && messageTimestamp.isBefore(parkingSlot.getLastUpdated())) {
                    return;
                }

                parkingSlot.setOccupied(isOccupied);
                parkingSlot.setLastUpdated(messageTimestamp);
                parkingSlotRepository.save(parkingSlot);

            } else {
                throw new IllegalArgumentException("Parking slot not found for parkingId: " + parkingId + ", floor: " + floor + ", slot: " + slot);
            }
        } catch (Exception e) {
            throw e;
        }
    }

}
