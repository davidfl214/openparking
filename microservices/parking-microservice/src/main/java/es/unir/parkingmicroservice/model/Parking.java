package es.unir.parkingmicroservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "parkings")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Parking {

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("administratorEmail")
    private String administratorEmail;

    @Field("location")
    private String location;

    @Field("numberOfFloors")
    private Integer numberOfFloors;

    @Field("slotsPerFloor")
    private Integer slotsPerFloor;

    @Field("enabled")
    private boolean enabled;
}
