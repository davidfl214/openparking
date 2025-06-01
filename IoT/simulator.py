import datetime
import json
import random
import time

import paho.mqtt.client as mqtt

# Initial configuration
BROKER = 'localhost'
PORT = 1883

# Parking spots configuration
PARKINGS = {
    'P1': [f'P1-A{i}' for i in range(1, 6)],
    'P2': [f'P1-B{i}' for i in range(1, 4)] + [f'P2-C{i}' for i in range(1, 3)],
    'P3': [f'P1-D{i}' for i in range(1, 5)],
}

# TODO: Think about initializing the parking spots with a random state
spot_status = {
    parking_id: {spot: 'FREE' for spot in spots}
    for parking_id, spots in PARKINGS.items()
}

# MQTT client setup
client = mqtt.Client()
client.connect(BROKER, PORT, 60)

def spot_change():
    parking_id = random.choice(list(PARKINGS.keys()))
    spot = random.choice(PARKINGS[parking_id])

    current_state = spot_status[parking_id][spot]
    new_state = 'OCCUPIED' if current_state == 'FREE' else 'FREE'
    spot_status[parking_id][spot] = new_state

    timestamp = datetime.datetime.now(datetime.UTC).isoformat()

    message = {
        "spot": spot,
        "status": new_state,
        "timestamp": timestamp
    }

    topic = f'parking/{parking_id}'
    client.publish(topic, json.dumps(message))
    print(f"[{timestamp}] {parking_id} - {spot} -> {new_state}")

try:
    while True:
        spot_change()
        time.sleep(random.randint(10, 30))
except KeyboardInterrupt:
    print("Simulation stopped by user.")
    client.disconnect()