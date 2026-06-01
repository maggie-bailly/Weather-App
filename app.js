<!DOCTYPE html>
<html>
<head>
  <title>Buggy SF Weather App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #dff3ff;
      text-align: center;
      padding-top: 60px;
    }

    .card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 4px 12px #999;
    }

    .temp {
      font-size: 48px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>San Francisco Weather 🐛</h1>
    <p id="time">Loading time...</p>
    <div class="temp" id="temp">--°F</div>
    <p id="wind">Loading wind...</p>
  </div>

  <script>
    const tempEl = document.getElementById("temp");
    const windEl = document.getElementById("wind");
    const timeEl = document.getElementById("time");

    function updateTime() {
      const now = new Date();

      // BUG: says "local time" but hardcodes San Francisco time zone
      const sfTime = now.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles"
      });

      timeEl.textContent = "San Francisco time: " + sfTime;
    }

    async function getWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true&temperature_unit=fahrenheit"
        );

        const data = await response.json();

        // BUG: no check that current_weather exists
        const weather = data.current_weather;

        tempEl.textContent = weather.temperature + "°F";

        // BUG: windspeed may be in km/h depending on API defaults
        windEl.textContent = "Wind: " + weather.windspeed + " mph";
      } catch (error) {
        tempEl.textContent = "Weather broke 🐞";
        windEl.textContent = error.message;
      }
    }

    updateTime();
    getWeather();

    setInterval(updateTime, 1000);
    setInterval(getWeather, 300000); // Refresh weather every 5 minutes
  </script>
</body>
</html>
