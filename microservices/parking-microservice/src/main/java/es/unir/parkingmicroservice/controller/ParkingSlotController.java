package es.unir.parkingmicroservice.controller;

import es.unir.parkingmicroservice.model.ParkingSlot;
import es.unir.parkingmicroservice.service.ParkingSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parking-slots")
@RequiredArgsConstructor
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    @GetMapping
    public List<ParkingSlot> getAll() {
        return parkingSlotService.getAllSlots();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getParkingSlotById(@PathVariable String id) {
        return parkingSlotService.getSlotById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Void> createParkingSlot(@RequestBody ParkingSlot slot) {
        parkingSlotService.createSlot(slot);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlot> updateParkingSlot(@PathVariable String id, @RequestBody ParkingSlot slot) {
        return parkingSlotService.updateSlot(id, slot)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        parkingSlotService.deleteSlot(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/parking/{parkingId}")
    public ResponseEntity<List<ParkingSlot>> getParkingSlotsByParkingId(@PathVariable String parkingId) {
        List<ParkingSlot> slots = parkingSlotService.getParkingSlotsByParkingId(parkingId);
        if (slots.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(slots);
    }
}