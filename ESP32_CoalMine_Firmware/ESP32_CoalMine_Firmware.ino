#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

// --- CONFIGURATION ---
const char* ssid = "Dimpu";     // Change this
const char* password = "12345678"; // Change this
const char* serverUrl = "http://10.242.99.210:5000/api/sensor-data"; // Change to your local IP

// Sensor Pins
#define FINGERPRINT_RX 16
#define FINGERPRINT_TX 17
#define I2C_SDA 21
#define I2C_SCL 22

// Hardware Serial for Fingerprint
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// PulseOximeter instance
PulseOximeter pox;
uint32_t tsLastReport = 0;
#define REPORTING_PERIOD_MS 1000

bool isFingerDetected = false;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // 1. WiFi Setup
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // 2. Fingerprint Sensor Setup
  mySerial.begin(57600, SERIAL_8N1, FINGERPRINT_RX, FINGERPRINT_TX);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
  }

  // 3. MAX30100 Setup
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!pox.begin()) {
    Serial.println("FAILED to initialize MAX30100");
  } else {
    Serial.println("MAX30100 Initialized");
  }
}

void loop() {
  // Listen for console commands to register a new finger
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("ENROLL ")) {
      int id = cmd.substring(7).toInt();
      if (id > 0 && id <= 127) {
        Serial.printf("Starting enrollment for ID #%d...\n", id);
        enrollFingerprint(id);
      } else {
        Serial.println("Invalid ID. Range is 1-127.");
      }
    }
  }

  pox.update();

  // Every second, check if a finger is on the sensor
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    int fingerId = getFingerprintID();
    
    if (fingerId != -1) {
      // Finger detected and identified!
      float heartRate = pox.getHeartRate();
      float spo2 = pox.getSpO2();

      if (heartRate > 0) {
        Serial.printf("Worker ID: %d | HR: %.1f | SpO2: %.1f%%\n", fingerId, heartRate, spo2);
        sendDataToServer(fingerId, heartRate, (int)spo2);
      }
    }
    tsLastReport = millis();
  }
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;
  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1;
  
  return finger.fingerID;
}

void sendDataToServer(int fingerId, float hr, int spo2) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"fingerprintId\":" + String(fingerId) + 
                         ",\"heartRate\":" + String(hr) + 
                         ",\"spo2\":" + String(spo2) + "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);
    http.end();
  }
}

// --- ENROLLMENT LOGIC ---
// Enrolls a new fingerprint to the sensor's flashes under the given ID
uint8_t enrollFingerprint(uint8_t id) {
  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); pox.update(); }
    else if (p == FINGERPRINT_OK) { Serial.println("Image taken"); }
    else { Serial.println("Error imaging finger"); return p; }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) { Serial.println("Conversion Error"); return p; }
  
  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) { p = finger.getImage(); delay(10); }
  
  Serial.println("Place same finger again");
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); pox.update(); }
    else if (p == FINGERPRINT_OK) { Serial.println("Image taken"); }
    else { Serial.println("Error imaging finger"); return p; }
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) { Serial.println("Conversion Error"); return p; }
  
  Serial.println("Creating model...");
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else {
    Serial.println("Prints did not match!");
    return p;
  }
  
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored! Registration Successful.");
  } else {
    Serial.println("Error storing the fingerprint.");
    return p;
  }
  return p;
}
