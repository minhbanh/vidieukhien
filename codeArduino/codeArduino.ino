#include <ESP8266WiFi.h>
#include <DHT.h>
#include <WiFiClient.h>

#define DHTPIN 2          // DHT22 signal pin
#define DHTTYPE DHT22     // DHT22 sensor type
#define WIFI_SSID "BDM"
#define WIFI_PASSWORD "12345789"
#define SERVER_IP "127.0.0.1"
#define SERVER_PORT 3000  // Node.js server port
#define DATABASE_NAME "test-dht"
#define COLLECTION_NAME "data-dht"

DHT dht(DHTPIN, DHTTYPE);
WiFiClient client;

void setup() {
  Serial.begin(115200);
  dht.begin();
  connectToWiFi();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read temperature and humidity from DHT22.");
    delay(1000);
    return;
  }

  if (client.connect(SERVER_IP, SERVER_PORT)) {
    Serial.println("Connected to server.");
    String data = "{ \"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + " }";
    //client.println("POST /" + DATABASE_NAME + "/" + COLLECTION_NAME + " HTTP/1.1");
    client.println("Host: " + String(SERVER_IP));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(data.length()));
    client.println();
    client.println(data);
    Serial.println("Sent data to server:");
    Serial.println(data);
  } else {
    Serial.println("Failed to connect to server.");
  }

  client.stop();
  delay(5000);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
