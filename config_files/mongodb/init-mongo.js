var adminDb = db.getSiblingDB('admin');

try {
  adminDb.createUser(
    {
      user: "mongoadmin",
      pwd: "mongopassword",
      roles: [
        { role: "root", db: "admin" }
      ]
    }
  );
  print("User 'mongoadmin' created successfully.");
} catch (e) {
  if (e.code === 51003) {
    print("User 'mongoadmin' already exists.");
  } else {
    print("Error creating user 'mongoadmin': " + e.message);
    throw e;
  }
}

var parkingDb = db.getSiblingDB('parking_db');

try {
  parkingDb.createUser(
    {
      user: "parkingUser",
      pwd: "parkingPassword",
      roles: [
        { role: "readWrite", db: "parking_db" }
      ]
    }
  );
  print("User 'parkingUser' created successfully.");
} catch (e) {
  if (e.code === 51003) {
    print("User 'parkingUser' already exists.");
  } else {
    print("Error creating user 'parkingUser': " + e.message);
    throw e;
  }
}

try {
  parkingDb.createCollection("parkings");
  print("Collection 'parkings' created or already exists.");
} catch (e) {
  if (e.code === 48) {
     print("Collection 'parkings' already exists with the same name.");
  } else {
     print("Error creating collection 'parkings': " + e.message);
     throw e;
  }
}

try {
  parkingDb.createCollection("parking_slots");
  print("Collection 'parkingSlots' created or already exists.");
} catch (e) {
  if (e.code === 48) {
    print("Collection 'parkingSlots' already exists with the same name.");
  } else {
    print("Error creating collection 'parkingSlots': " + e.message);
    throw e;
  }
}

print("MongoDB initialization script finished.");