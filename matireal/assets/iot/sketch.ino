// Arduino - DHT22 example sketch
// Requires the DHT library: https://github.com/adafruit/DHT-sensor-library
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (!isnan(t) && !isnan(h)) {
    // Send CSV-like line: temperature,humidity
    Serial.print(t, 2);
    Serial.print(",");
    Serial.println(h, 2);
  }
  delay(1000);
}
