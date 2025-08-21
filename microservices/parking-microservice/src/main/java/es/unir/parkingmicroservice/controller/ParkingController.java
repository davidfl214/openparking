package es.unir.parkingmicroservice.controller;

import es.unir.parkingmicroservice.dto.ParkingCreateDTO;
import es.unir.parkingmicroservice.dto.ParkingStatus;
import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.service.ParkingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/parkings")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;

    @GetMapping
    public ResponseEntity<List<Parking>> getParkings() {
        return ResponseEntity.ok(parkingService.getParkings());
    }

    @PostMapping
    public ResponseEntity<Void> createParking(@Valid @RequestBody ParkingCreateDTO newParking) {
        parkingService.createParking(newParking);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParking(@PathVariable("id") String id) {
        parkingService.deleteParking(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/status")
    public ResponseEntity<List<ParkingStatus>> getAllParkingStatus() {
        return ResponseEntity.ok(parkingService.getAllParkingStatus());
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<ParkingStatus> getParkingStatus(@PathVariable("id") String id) {
        ParkingStatus status = parkingService.getParkingStatus(id);
        return ResponseEntity.ok(status);
    }
}
