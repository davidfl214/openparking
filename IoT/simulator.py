import paho.mqtt.client as mqtt
import random
import time
import json
import os
from datetime import datetime

# MQTT configuration
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = os.getenv("MQTT_PORT", 1883)
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "parking/")
MQTT_UPDATE_TOPIC = os.getenv("MQTT_UPDATE_TOPIC", "parking/updates")

parking_config_global = []

def read_parking_data(filename):
    parking_data = []
    try:
        with open(filename, 'r') as f:
            for line in f:
                parts = line.strip().split(',')
                if len(parts) == 3:
                    parking_id = parts[0].strip()
                    floor_number = int(parts[1].strip())
                    slots_per_floor = int(parts[2].strip())
                    parking_data.append({
                        "parking_id": parking_id,
                        "floor_number": floor_number,
                        "slots_per_floor": slots_per_floor,
                        "slot_status": {}
                    })
                else:
                    print(f"Invalid line in file: {line.strip()}")
    except FileNotFoundError:
        print(f"File {filename} not found.")
        exit(1)
    return parking_data

def initialize_parking_status(parking_data):
    for parking in parking_data:
        parking_id = parking["parking_id"]
        parking["slot_status"][parking_id] = {}
        for floor in range(1, parking["floor_number"] + 1):
            parking["slot_status"][parking_id][floor] = {}
            for slot in range(1, parking["slots_per_floor"] + 1):
                parking["slot_status"][parking_id][floor][slot] = "free"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
    else:
        print(f"Failed to connect, return code {rc}")

def simulate_parking_sensor(parking_data_file = "parking_data.txt"):
    global parking_config_global
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message_update
    client.connect(MQTT_BROKER, int(MQTT_PORT), 60)
    client.subscribe(MQTT_UPDATE_TOPIC)

    client.loop_start()

    parking_config_global = read_parking_data(parking_data_file)
    while not parking_config_global:
        print("Waiting for parking data to be loaded...")
        time.sleep(30)
        parking_config_global = read_parking_data(parking_data_file)
    
    initialize_parking_status(parking_config_global)

    print("Starting parking sensor simulation...")
    print("Press Ctrl+C to stop the simulation.")

    try:
        while True:
            selected_parking = random.choice(parking_config_global)
            parking_id = selected_parking["parking_id"]
            num_floors = selected_parking["floor_number"]
            num_slots_per_floor = selected_parking["slots_per_floor"]

            selected_floor = random.randint(1, num_floors)
            selected_slot = random.randint(1, num_slots_per_floor)

            current_status = selected_parking["slot_status"][parking_id][selected_floor][selected_slot]
            new_status = "free" if current_status == "occupied" else "occupied"
            selected_parking["slot_status"][parking_id][selected_floor][selected_slot] = new_status

            timestamp = datetime.now().isoformat()

            message = {
                "floor": selected_floor,
                "slot": selected_slot,
                "status": new_status,
                "timestamp": timestamp
            }

            topic = f"{MQTT_TOPIC}{parking_id}"

            client.publish(topic, json.dumps(message))
            print(f"Published message to {topic}: {message}")

            time.sleep(random.uniform(15, 30))

    except KeyboardInterrupt:
        print("Simulation stopped by user.")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker.")

def on_message_update(client, userdate, msg):

    global parking_config_global
    print(f"Update received on {msg.topic}: {msg.payload.decode()}")
    try:
        update_data = json.loads(msg.payload.decode())
        update_type = update_data.get("type")
        parking_id = update_data.get("parkingId")

        if update_type == "add":
            new_parking = {
                "parking_id": parking_id,
                "floor_number": update_data.get("numberOfFloors"),
                "slots_per_floor": update_data.get("slotsPerFloor"),
                "slot_status": {}
            }
            parking_config_global.append(new_parking)
            initialize_parking_status([new_parking])
            try:
                with open("parking_data.txt", "r") as f:
                    existing_data = f.read().strip()
                    with open("parking_data.txt", "a") as f:
                        if existing_data:
                            f.write("\n")
                        f.write(f"{parking_id},{new_parking['floor_number']},{new_parking['slots_per_floor']}")
            except FileNotFoundError:
                with open("parking_data.txt", "w") as f:
                    f.write(f"{parking_id},{new_parking['floor_number']},{new_parking['slots_per_floor']}")

            print(f"Added new parking: {new_parking}")
        
        elif update_type == "delete":
            parking_config_global = [p for p in parking_config_global if p["parking_id"] != parking_id]
            try:
                with open("parking_data.txt", "r") as f:
                    lines = f.readlines()
                remaining_lines = [line for line in lines if not line.startswith(parking_id + ",")]
                if remaining_lines:
                    with open("parking_data.txt", "w") as f:
                        f.writelines(remaining_lines)
                else:
                    open("parking_data.txt", "w").close()
            except FileNotFoundError:
                print("File not found while trying to delete parking.")
            print(f"Deleted parking with ID: {parking_id}")
        
        elif update_type == "update":
            for parking in parking_config_global:
                if parking["parking_id"] == parking_id:
                    parking["floor_number"] = update_data.get("floor_number", parking["floor_number"])
                    parking["slots_per_floor"] = update_data.get("slots_per_floor", parking["slots_per_floor"])
                    initialize_parking_status([parking])
                    print(f"Updated parking: {parking}")
                    try:
                        with open("parking_data.txt", "r") as f:
                            lines = f.readlines()
                        with open("parking_data.txt", "w") as f:
                            for line in lines:
                                if not line.startswith(parking_id + ","):
                                    f.write(line)
                            f.write(f"{parking_id},{parking['floor_number']},{parking['slots_per_floor']}")
                    except FileNotFoundError:
                        print("File not found while trying to update parking.")
                    break
    
    except json.JSONDecodeError:
        print("Received invalid JSON update message.")
    except Exception as e:
        print(f"Error processing update message: {e}")

if __name__ == "__main__":
    simulate_parking_sensor("parking_data.txt")