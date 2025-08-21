package es.unir.parkingmicroservice.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import es.unir.parkingmicroservice.model.Parking;
import es.unir.parkingmicroservice.service.ParkingService;
import es.unir.parkingmicroservice.service.ParkingSlotService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class MqttMessageHandler implements MessageHandler {

    private final ParkingSlotService parkingSlotService;
    private final ParkingService parkingService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Pattern topicPattern = Pattern.compile("parking/([^/]+)");


    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        try {
            String topic = message.getHeaders().get("mqtt_receivedTopic", String.class);
            String payload = message.getPayload().toString();

            Matcher matcher = topicPattern.matcher(topic);
            if (!matcher.matches()) {
                return;
            }

            String parkingId = matcher.group(1);

            JsonNode jsonNode = objectMapper.readTree(payload);
            Integer floor = jsonNode.path("floor").asInt();
            Integer slot = jsonNode.path("slot").asInt();
            boolean isOccupied = jsonNode.get("status").asText().equals("occupied");
            String timestampStr = jsonNode.has("timestamp") ? jsonNode.get("timestamp").asText() : null;

            LocalDateTime timestamp;
            if (timestampStr != null) {
                try {
                    timestamp = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (DateTimeParseException e) {
                    timestamp = LocalDateTime.now();
                }
            } else {
                timestamp = LocalDateTime.now();
            }

            Parking associatedParking = parkingService.getParkingById(parkingId);

            parkingSlotService.updateSlotOccupancy(parkingId, floor, slot, isOccupied, timestamp, associatedParking);


        } catch (Exception e) {
            //
        }
    }
}
