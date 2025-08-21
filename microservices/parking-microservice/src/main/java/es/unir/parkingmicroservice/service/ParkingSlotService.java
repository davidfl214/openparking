package es.unir.parkingmicroservice.service;

import es.unir.parkingmicroservice.dto.ParkingSlotStatus;
import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.model.ParkingSlot;
import es.unir.parkingmicroservice.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void generateInitialParkingSlots(Parking parking) {
        List<ParkingSlot> parkingSlots = new ArrayList<>();
        for (int floor = 1; floor <= parking.getNumberOfFloors(); floor++) {
            for (int slot = 1; slot <= parking.getSlotsPerFloor(); slot++) {
                ParkingSlot parkingSlot =
                        ParkingSlot.builder().parkingId(parking.getId()).floor(floor).slot(slot).isOccupied(false).build();
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

    public List<ParkingSlot> getParkingSlotsByParkingId(String parkingId) {
        return parkingSlotRepository.findByParkingId(parkingId);
    }

    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    public Optional<ParkingSlot> getSlotById(String id) {
        return parkingSlotRepository.findById(id);
    }

    public void createSlot(ParkingSlot slot) {
        slot.setLastUpdated(LocalDateTime.now());
        parkingSlotRepository.save(slot);
    }

    public Optional<ParkingSlot> updateSlot(String id, ParkingSlot updatedSlot) {
        return parkingSlotRepository.findById(id).map(existing -> {
            existing.setParkingId(updatedSlot.getParkingId());
            existing.setFloor(updatedSlot.getFloor());
            existing.setSlot(updatedSlot.getSlot());
            existing.setOccupied(updatedSlot.isOccupied());
            existing.setLastUpdated(LocalDateTime.now());
            return parkingSlotRepository.save(existing);
        });
    }

    public void deleteSlot(String id) {
        if (parkingSlotRepository.existsById(id)) {
            parkingSlotRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Parking slot with id " + id + " does not exist");
        }
    }

    @Transactional
    public void updateSlotOccupancy(String parkingId, Integer floor, Integer slot, boolean isOccupied,
                                    LocalDateTime messageTimestamp, Parking associatedParking) {
        try {
            Optional<ParkingSlot> slotOptional =
                    parkingSlotRepository.findByParkingIdAndFloorAndSlot(parkingId, floor, slot);
            if (slotOptional.isPresent()) {
                ParkingSlot parkingSlot = slotOptional.get();

                if (parkingSlot.getLastUpdated() != null && messageTimestamp.isBefore(parkingSlot.getLastUpdated())) {
                    return;
                }

                parkingSlot.setOccupied(isOccupied);
                parkingSlot.setLastUpdated(messageTimestamp);
                parkingSlotRepository.save(parkingSlot);
                
                if (associatedParking != null) {
                    List<ParkingSlot> parkingSlots = getParkingSlotsByParkingId(associatedParking.getId());
                    int occupiedSlots = (int) parkingSlots.stream().filter(ParkingSlot::isOccupied).count();
                    ParkingSlotStatus updatedStatus =
                            ParkingSlotStatus.builder().id(associatedParking.getId()).name(associatedParking.getName())
                                    .location(associatedParking.getLocation()).latitude(associatedParking.getLatitude())
                                    .longitude(associatedParking.getLongitude()).totalSlots(parkingSlots.size())
                                    .occupiedSlots(occupiedSlots).enabled(associatedParking.isEnabled()).build();

                    messagingTemplate.convertAndSend("/topic/parkingStatus", updatedStatus);
                }

            } else {
                throw new IllegalArgumentException(
                        "Parking slot not found for parkingId: " + parkingId + ", floor: " + floor + ", slot: " + slot);
            }
        } catch (Exception e) {
            throw e;
        }
    }

}
