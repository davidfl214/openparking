package es.unir.parkingmicroservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "parkings")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Parking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String Id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "administrator_email", unique = true, nullable = false)
    private String administratorEmail;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "number_of_floors", nullable = false)
    private Integer numberOfFloors;

    @Column(name = "slots_per_floor", nullable = false)
    private Integer slotsPerFloor;

    @Column(name = "enabled", nullable = false)
    private boolean enabled;
}
