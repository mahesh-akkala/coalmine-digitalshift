#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>

// --- CONFIGURATION ---
const char* ssid = "Galaxy S23 FE";     // Change this
const char* password = "mukeshgoud"; // Change this
const char* serverUrl = "http://10.169.204.53:5000/api/sensor-data"; // Local IPv4 Configured

// Sensor Pins
#define FINGERPRINT_RX 16
#define FINGERPRINT_TX 17

// Hardware Serial for Fingerprint
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint32_t tsLastReport = 0;
#define REPORTING_PERIOD_MS 1000

uint32_t tsLastPoll = 0;
#define POLLING_PERIOD_MS 2000

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
  postLog("Device Connected to High-Altitude WiFi.");

  // 2. Fingerprint Sensor Setup
  mySerial.begin(57600, SERIAL_8N1, FINGERPRINT_RX, FINGERPRINT_TX);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
    postLog("Fingerprint Sensor AS608 initialized.");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    postLog("CRITICAL ERROR: Sensor Hardware Offline.");
  }

  // User Instructions
  Serial.println("\n---------------------------------------------------");
  Serial.println("SYSTEM IS ACTIVE AND READY!");
  postLog("Hardware Status: STANDBY (Awaiting Scanning Commands)");
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

  // --- Remote Control Polling --- 
  if (millis() - tsLastPoll > POLLING_PERIOD_MS) {
    pollBackend();
    tsLastPoll = millis();
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

void postScanStatus(String status, String msg) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String statusUrl = String(serverUrl);
    statusUrl.replace("/sensor-data", "/scan-status");
    http.begin(statusUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"status\":\"" + status + "\", \"message\":\"" + msg + "\"}";
    http.POST(payload);
    http.end();
  }
}

void postLog(String log) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String logUrl = String(serverUrl);
    logUrl.replace("/sensor-data", "/hardware-log");
    http.begin(logUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"log\":\"" + log + "\"}";
    http.POST(payload);
    http.end();
  }
  Serial.println("[WEB LOG] " + log);
}

void sendEnrollFailure(String errorMsg) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String failUrl = String(serverUrl);
    failUrl.replace("/sensor-data", "/enroll/fail");
    http.begin(failUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"message\":\"" + errorMsg + "\"}";
    http.POST(payload);
    http.end();
  }
}

// --- REMOTE POLLING ---
void pollBackend() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String cmdUrl = String(serverUrl);
    cmdUrl.replace("/sensor-data", "/device/command");
    http.begin(cmdUrl);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      if (payload.indexOf("\"command\":\"ENROLL\"") > 0) {
        int slotKeyIndex = payload.indexOf("\"slot\":");
        if (slotKeyIndex > 0) {
          int valStart = slotKeyIndex + 7;
          int valEnd = payload.indexOf("}", valStart);
          if (valEnd > valStart) {
            String slotStr = payload.substring(valStart, valEnd);
            int slotId = slotStr.toInt();
            if (slotId > 0 && slotId <= 127) {
              Serial.printf("\n>>> REMOTE COMMAND RECEIVED: ENROLL SLOT #%d <<<\n", slotId);
              enrollFingerprint(slotId);
            }
          }
        }
      } else if (payload.indexOf("\"command\":\"VERIFY\"") > 0) {
        Serial.println("\n>>> REMOTE COMMAND RECEIVED: VERIFY LOGIN <<<\n");
        verifyFingerprint();
      }

      // Handle raw console commands from the web terminal
      int consoleKeyIndex = payload.indexOf("\"consoleMsg\":\"");
      if (consoleKeyIndex > 0) {
        int valStart = consoleKeyIndex + 14;
        int valEnd = payload.indexOf("\"", valStart);
        if (valEnd > valStart) {
          String remoteCmd = payload.substring(valStart, valEnd);
          if (remoteCmd != "null" && remoteCmd.length() > 0) {
            Serial.printf("\n>>> WEB TERMINAL INPUT RECEIVED: %s <<<\n", remoteCmd.c_str());
            postLog("Executing Web Command: " + remoteCmd);
            processRemoteCommand(remoteCmd);
          }
        }
      }
    }
    http.end();
  }
}

void processRemoteCommand(String cmd) {
  if (cmd.startsWith("ENROLL ")) {
    int id = cmd.substring(7).toInt();
    if (id > 0 && id <= 127) {
      enrollFingerprint(id);
    }
  }
}

// --- ENROLLMENT LOGIC ---
// Enrolls a new fingerprint to the sensor's flashes under the given ID
uint8_t enrollFingerprint(uint8_t id) {
  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  postScanStatus("WAITING", "Waiting for finger...");
  
  // SCAN 1
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); }
    else if (p == FINGERPRINT_OK) { 
      Serial.println("Image taken"); 
      postLog("Scan 1: Raw image captured successfully.");
      postScanStatus("DETECTED", "Finger detected ✅");
    }
    else { 
      Serial.println("Error imaging finger"); 
      postLog("ERROR Scan 1: Failed to capture image.");
      postScanStatus("FAIL_SCAN", "Scan failed. Try again");
      return p; 
    }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) { 
    Serial.println("Conversion Error"); 
    postLog("ERROR: Image to Template conversion failed (Slot 1).");
    postScanStatus("FAIL_SCAN", "Scan failed. Try again");
    return p; 
  }
  
  // --- DUPLICATE CHECK ---
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.printf("Error: Finger already enrolled as valid ID #%d!\n", finger.fingerID);
    sendEnrollFailure("DUPLICATE_FINGER");
    postScanStatus("FAIL_SCAN", "Finger already registered ❌");
    return FINGERPRINT_PACKETRECIEVEERR; // Abort enrollment
  }

  // --- REMOVAL ---
  Serial.println("Remove finger");
  postScanStatus("REMOVE", "Remove finger");
  delay(1000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) { 
    p = finger.getImage(); 
    delay(10); 
  }
  
  // --- SCAN 2 ---
  Serial.println("Place same finger again");
  postScanStatus("PLACE_AGAIN", "Place same finger again");
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); }
    else if (p == FINGERPRINT_OK) { 
      Serial.println("Image taken"); 
      postScanStatus("PROCESSING", "Scanning...");
    }
    else { 
      Serial.println("Error imaging finger"); 
      postScanStatus("FAIL_SCAN", "Scan failed. Try again");
      return p; 
    }
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) { 
    Serial.println("Conversion Error"); 
    postLog("ERROR: Image to Template conversion failed (Slot 2).");
    postScanStatus("FAIL_SCAN", "Scan failed. Try again");
    return p; 
  }
  
  Serial.println("Creating model...");
  postLog("Processing: Correlating Scan 1 and Scan 2 templates...");
  postScanStatus("PROCESSING", "Processing fingerprint...");
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
    postLog("Success: Biometric identity verified and matched.");
  } else {
    Serial.println("Prints did not match!");
    postLog("ALERT: Biometric mismatch between Scan 1 and Scan 2.");
    postScanStatus("FAIL_MISMATCH", "Finger mismatch ❌ Please try again");
    sendEnrollFailure("MISMATCH");
    return p;
  }
  
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored! Registration Successful.");
    postLog("Registry Updated: Template saved to ID Slot #" + String(id));
    postScanStatus("SUCCESS", "Completed");
    sendEnrollmentToServer(id);
  } else {
    Serial.println("Error storing the fingerprint.");
    postLog("CRITICAL: Hardware flash memory write error.");
    postScanStatus("FAIL_SCAN", "Memory Store Error");
    return p;
  }
  return p;
}

void verifyFingerprint() {
  int p = -1;
  postLog("Login Mode: Waiting for supervisor fingerprint...");
  postScanStatus("WAITING", "Waiting for login scan...");
  
  // Try to find a finger
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) { delay(50); }
    else if (p == FINGERPRINT_OK) {
      postLog("Login Scan: Finger detected on sensor.");
      postScanStatus("DETECTED", "Identity scanning in progress...");
    } else {
      postLog("ERROR: Sensor hardware read failure.");
      postScanStatus("ERROR", "Sensor read error.");
      return;
    }
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    postLog("ERROR: Login image conversion failed.");
    postScanStatus("ERROR", "Conversion Error.");
    return;
  }

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.printf("Found ID #%d with confidence %d\n", finger.fingerID, finger.confidence);
    postLog("IDENTIFIED: Admin matched to Template Slot #" + String(finger.fingerID));
    postScanStatus("SUCCESS", "Scan completed successfully.");
    
    // Send only ID to /sensor-data (Login trigger)
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      String payload = "{\"fingerprintId\":" + String(finger.fingerID) + "}";
      http.POST(payload);
      http.end();
    }
  } else {
    postScanStatus("ERROR", "Scan failed. Please try again.");
  }
}
