package es.unir.parkingmicroservice.repository;

import es.unir.parkingmicroservice.model.Parking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<Parking, String> {
    boolean existsByAdministratorEmail(String administratorEmail);
}
