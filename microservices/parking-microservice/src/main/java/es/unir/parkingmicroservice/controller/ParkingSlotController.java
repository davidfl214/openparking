package es.unir.parkingmicroservice.controller;

import es.unir.parkingmicroservice.model.ParkingSlot;
import es.unir.parkingmicroservice.service.ParkingSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking-slots")
@RequiredArgsConstructor
public class ParkingSlotController {

    private final ParkingSlotService service;

    @GetMapping
    public List<ParkingSlot> getAll() {
        return service.getAllSlots();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getById(@PathVariable String id) {
        return service.getSlotById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ParkingSlot create(@RequestBody ParkingSlot slot) {
        return service.createSlot(slot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlot> update(@PathVariable String id, @RequestBody ParkingSlot slot) {
        return service.updateSlot(id, slot)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return service.deleteSlot(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}