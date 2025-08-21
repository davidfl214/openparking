package es.unir.parkingmicroservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.unir.parkingmicroservice.config.MqttConfig;
import es.unir.parkingmicroservice.dto.NewParkingEvent;
import es.unir.parkingmicroservice.dto.ParkingDTO;
import es.unir.parkingmicroservice.dto.ParkingSlotStatus;
import es.unir.parkingmicroservice.mapper.ParkingMapper;
import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.model.ParkingSlot;
import es.unir.parkingmicroservice.repository.ParkingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingService {

    private final ParkingRepository parkingRepository;
    private final ParkingSlotService parkingSlotService;
    private final MqttConfig.MqttGateway mqttGateway;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String ADD_PARKING_TYPE = "add";
    private static final String DELETE_PARKING_TYPE = "delete";

    public List<Parking> getParkings() {
        return parkingRepository.findAll();
    }

    @Transactional
    public void createParking(ParkingDTO newParking) {
        if (parkingRepository.existsByAdministratorEmail(newParking.getAdministratorEmail())) {
            throw new IllegalArgumentException("Parking with this administrator email already exists");
        }

        Parking parking = ParkingMapper.toEntity(newParking);

        Parking savedParking = parkingRepository.save(parking);

        parkingSlotService.generateInitialParkingSlots(savedParking);

        sendParkingConfigurationEvent(savedParking.getId(), savedParking.getNumberOfFloors(),
                savedParking.getSlotsPerFloor(), ADD_PARKING_TYPE);

        List<ParkingSlot> parkingSlots = parkingSlotService.getParkingSlotsByParkingId(savedParking.getId());
        int occupiedSlots = (int) parkingSlots.stream().filter(ParkingSlot::isOccupied).count();
        ParkingSlotStatus status = ParkingSlotStatus.builder().id(savedParking.getId()).name(savedParking.getName())
                .location(savedParking.getLocation()).latitude(savedParking.getLatitude())
                .longitude(savedParking.getLongitude()).totalSlots(parkingSlots.size()).occupiedSlots(occupiedSlots)
                .enabled(savedParking.isEnabled()).build();
        messagingTemplate.convertAndSend("/topic/parkingStatus", status);
    }

    public void deleteParking(String id) {
        if (parkingRepository.existsById(id)) {
            parkingSlotService.deleteParkingSlotsByParkingId(id);
            parkingRepository.deleteById(id);

            sendParkingConfigurationEvent(id, null, null, DELETE_PARKING_TYPE);
        } else {
            throw new IllegalArgumentException("Parking with id " + id + " does not exist");
        }
    }

    public List<ParkingSlotStatus> getAllParkingStatus() {
        List<Parking> parkings = parkingRepository.findAll();
        List<ParkingSlotStatus> parkingSlotStatuses = new ArrayList<>();
        for (Parking parking : parkings) {
            List<ParkingSlot> parkingSlots = parkingSlotService.getParkingSlotsByParkingId(parking.getId());
            int occupiedSlots = (int) parkingSlots.stream().filter(ParkingSlot::isOccupied).count();
            ParkingSlotStatus status = ParkingSlotStatus.builder().id(parking.getId()).name(parking.getName())
                    .location(parking.getLocation()).latitude(parking.getLatitude()).longitude(parking.getLongitude())
                    .totalSlots(parkingSlots.size()).occupiedSlots(occupiedSlots).enabled(parking.isEnabled()).build();
            parkingSlotStatuses.add(status);
        }
        return parkingSlotStatuses;
    }

    public ParkingSlotStatus getParkingStatus(String id) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Parking with id " + id + " does not exist"));

        List<ParkingSlot> parkingSlots = parkingSlotService.getParkingSlotsByParkingId(id);
        int occupiedSlots = (int) parkingSlots.stream().filter(ParkingSlot::isOccupied).count();

        return ParkingSlotStatus.builder().id(parking.getId()).name(parking.getName()).location(parking.getLocation())
                .latitude(parking.getLatitude()).longitude(parking.getLongitude()).totalSlots(parkingSlots.size())
                .occupiedSlots(occupiedSlots).enabled(parking.isEnabled()).build();
    }

    private void sendParkingConfigurationEvent(String parkingId, Integer numberOfFloors, Integer slotsPerFloor,
                                               String type) {
        try {
            NewParkingEvent event = NewParkingEvent.builder().parkingId(parkingId).numberOfFloors(numberOfFloors)
                    .slotsPerFloor(slotsPerFloor).type(type).build();

            String jsonEvent = objectMapper.writeValueAsString(event);
            mqttGateway.sendToMqtt(jsonEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing parking configuration event", e);
        }
    }
}
