package es.unir.parkingmicroservice.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_slots")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Column(name = "slot", nullable = false)
    private Integer slot;

    @Column(name = "occupied", nullable = false)
    private boolean occupied = false;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
