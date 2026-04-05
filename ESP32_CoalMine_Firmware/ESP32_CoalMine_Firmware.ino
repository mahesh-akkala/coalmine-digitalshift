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
