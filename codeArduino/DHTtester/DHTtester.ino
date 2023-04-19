#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#define DHTPIN 5          // Định nghĩa chân DHT22
#define DHTTYPE DHT22      // Định nghĩa loại cảm biến DHT22

const char* ssid = "CNHKVT";      // Tên wifi
const char* password = "sae@6789";  // Mật khẩu wifi
const char* serverName = "192.168.1.122";   // Tên miền máy chủ

DHT dht(DHTPIN, DHTTYPE);
WiFiClient client;

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);
  Serial.println("Đang kết nối tới wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối...");
  }
  Serial.println("Đã kết nối tới wifi!");

}

void loop() {
  delay(2000);
  float t = dht.readTemperature();   // Đọc giá trị nhiệt độ từ cảm biến
  float h = dht.readHumidity();      // Đọc giá trị độ ẩm từ cảm biến
  Serial.print("Nhiệt độ: ");
  Serial.print(t);
  Serial.print("°C - Độ ẩm: ");
  Serial.print(h);
  Serial.println("%");
  
  if (isnan(t) || isnan(h)) {
    Serial.println("Lỗi đọc cảm biến DHT22!");
    return;
  }

  String url = "http://";
  url += serverName;
  url += ":3000/data";
  url += "/?temp=";
  url += String(t);
  url += "&hum=";
  url += String(h);
  
  if (client.connect(serverName, 3000)) {
    Serial.println("Đã kết nối tới máy chủ!");
    Serial.println(url);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + serverName + "\r\n" +
                 "Connection: close\r\n\r\n");
    Serial.println("Đã gửi HTTP GET request!");
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
    client.stop();
  } 
  else {
    Serial.println("Không thể kết nối tới máy chủ!");
  }

  delay(10000);
}
