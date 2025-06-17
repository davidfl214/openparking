package es.unir.parkingmicroservice.repository;

import es.unir.parkingmicroservice.model.Parking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ParkingRepository extends MongoRepository<Parking, String> {
    boolean existsByAdministratorEmail(String administratorEmail);
}
