package es.unir.parkingmicroservice.controller;

import es.unir.parkingmicroservice.dto.ParkingDTO;
import es.unir.parkingmicroservice.dto.ParkingSlotStatus;
import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.service.ParkingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/parkings")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;

    @GetMapping
    public ResponseEntity<List<Parking>> getParkings() {
        return ResponseEntity.ok(parkingService.getParkings());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> createParking(@Valid @RequestBody ParkingDTO newParking) {
        parkingService.createParking(newParking);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteParking(@PathVariable("id") String id) {
        parkingService.deleteParking(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/status")
    public ResponseEntity<List<ParkingSlotStatus>> getAllParkingStatus() {
        return ResponseEntity.ok(parkingService.getAllParkingStatus());
    }
}
