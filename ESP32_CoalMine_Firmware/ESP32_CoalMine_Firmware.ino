#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>

// --- CONFIGURATION ---
const char* ssid = "Dimpu";     // Change this
const char* password = "12345678"; // Change this
const char* serverUrl = "http://10.242.99.53:5000/api/sensor-data"; // Local IPv4 Configured

// Sensor Pins
#define FINGERPRINT_RX 16
#define FINGERPRINT_TX 17

// Hardware Serial for Fingerprint
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

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

  // User Instructions
  Serial.println("\n---------------------------------------------------");
  Serial.println("SYSTEM IS ACTIVE AND READY!");
  Serial.println(" -> To log Attendance / CHECK IN: Simply place your finger on the sensor.");
  Serial.println(" -> To ENROLL a new worker: Type 'ENROLL <ID>' (e.g. ENROLL 2) in the box above and press Enter.");
  Serial.println("---------------------------------------------------\n");
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

  // Every second, check if a finger is on the sensor
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    int fingerId = getFingerprintID();
    
    if (fingerId != -1) {
      // Finger detected and identified!
      // Using mock values for health since the MAX30100 was removed
      float heartRate = 75.0;
      float spo2 = 98.0;

      Serial.printf("Worker ID: %d | HR(Mock): %.1f | SpO2(Mock): %.1f%%\n", fingerId, heartRate, spo2);
      sendDataToServer(fingerId, heartRate, (int)spo2);

      // Prevent continuous spam reading! Wait until finger is fully removed.
      Serial.println("Please remove finger to allow next scan...");
      while (finger.getImage() != FINGERPRINT_NOFINGER) {
        delay(100);
      }
      Serial.println("Finger removed. Sensor is ready.");
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

void sendEnrollmentToServer(int fingerId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String enrollUrl = String(serverUrl);
    enrollUrl.replace("/sensor-data", "/enroll");
    http.begin(enrollUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"fingerprintId\":" + String(fingerId) + "}";
    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("Enrollment Linked to Server: HTTP ");
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
    if (p == FINGERPRINT_NOFINGER) { delay(50); }
    else if (p == FINGERPRINT_OK) { Serial.println("Image taken"); }
    else { Serial.println("Error imaging finger"); return p; }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) { Serial.println("Conversion Error"); return p; }
  
  // --- DUPLICATE CHECK ---
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.printf("Error: Finger already enrolled as valid ID #%d!\n", finger.fingerID);
    return FINGERPRINT_PACKETRECIEVEERR; // Abort enrollment
  }

  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) { p = finger.getImage(); delay(10); }
  
  Serial.println("Place same finger again");
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); }
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
    sendEnrollmentToServer(id);
  } else {
    Serial.println("Error storing the fingerprint.");
    return p;
  }
  return p;
}
