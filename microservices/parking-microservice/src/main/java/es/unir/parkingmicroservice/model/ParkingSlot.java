package es.unir.parkingmicroservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "parking_slots")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ParkingSlot {

    @Id
    private String id;

    @DBRef
    private Parking parking;

    @Field("floor")
    private Integer floor;

    @Field("slot")
    private Integer slot;

    @Field("isOccupied")
    private boolean isOccupied = false;

    @Field("last_updated")
    private LocalDateTime lastUpdated;
}
