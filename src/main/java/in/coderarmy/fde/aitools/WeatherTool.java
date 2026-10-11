package in.coderarmy.fde.aitools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class WeatherTool {

    private final RestClient restClient;

    public WeatherTool(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @Tool(description = """
            Get the current weather information for a city.
            Returns temperature, humidity, wind speed and weather condition.
            Use this tool when the user asks about the current weather of a city.
            """)
    public WeatherResponse getWeather(
            @ToolParam(description = "Name of the city, for example Delhi, Mumbai or Patna")
            String city) {

        System.out.println("Weather tool called for: " + city);

        // --------------------------------------------------
        // STEP 1: Find latitude and longitude of the city
        // --------------------------------------------------

        LocationResponse locationResponse = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("geocoding-api.open-meteo.com")
                        .path("/v1/search")
                        .queryParam("name", city)
                        .queryParam("count", 1)
                        .queryParam("language", "en")
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .body(LocationResponse.class);

        if (locationResponse == null
                || locationResponse.results() == null
                || locationResponse.results().isEmpty()) {

            throw new IllegalArgumentException(
                    "Could not find location: " + city
            );
        }

        Location location = locationResponse.results().getFirst();

        if (location.latitude() == null || location.longitude() == null) {
            throw new IllegalArgumentException(
                    "Location coordinates are unavailable for: " + city
            );
        }

        // --------------------------------------------------
        // STEP 2: Get current weather
        // --------------------------------------------------

        WeatherApiResponse weatherResponse = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.open-meteo.com")
                        .path("/v1/forecast")
                        .queryParam("latitude", location.latitude())
                        .queryParam("longitude", location.longitude())
                        .queryParam(
                                "current",
                                "temperature_2m," +
                                        "relative_humidity_2m," +
                                        "wind_speed_10m," +
                                        "weather_code"
                        )
                        .queryParam("timezone", "auto")
                        .build())
                .retrieve()
                .body(WeatherApiResponse.class);

        if (weatherResponse == null || weatherResponse.current() == null) {
            throw new IllegalArgumentException(
                    "Weather information unavailable for: " + city
            );
        }

        CurrentWeather current = weatherResponse.current();

        // --------------------------------------------------
        // STEP 3: Validate weather data
        // --------------------------------------------------

        if (current.temperature_2m() == null
                || current.relative_humidity_2m() == null
                || current.wind_speed_10m() == null
                || current.weather_code() == null) {

            throw new IllegalArgumentException(
                    "Incomplete weather information for: " + city
            );
        }

        // --------------------------------------------------
        // STEP 4: Return weather information
        // --------------------------------------------------

        return new WeatherResponse(
                location.name(),
                current.temperature_2m(),
                current.relative_humidity_2m(),
                current.wind_speed_10m(),
                getWeatherDescription(current.weather_code())
        );
    }

    // --------------------------------------------------
    // Convert Open-Meteo weather code into description
    // --------------------------------------------------

    private String getWeatherDescription(Integer weatherCode) {

        return switch (weatherCode) {

            case 0 ->
                    "Clear sky";

            case 1, 2, 3 ->
                    "Mainly clear, partly cloudy or overcast";

            case 45, 48 ->
                    "Fog";

            case 51, 53, 55 ->
                    "Drizzle";

            case 56, 57 ->
                    "Freezing drizzle";

            case 61, 63, 65 ->
                    "Rain";

            case 66, 67 ->
                    "Freezing rain";

            case 71, 73, 75 ->
                    "Snow fall";

            case 77 ->
                    "Snow grains";

            case 80, 81, 82 ->
                    "Rain showers";

            case 85, 86 ->
                    "Snow showers";

            case 95 ->
                    "Thunderstorm";

            case 96, 99 ->
                    "Thunderstorm with hail";

            default ->
                    "Unknown weather condition";
        };
    }

    // ==================================================
    // DTOs
    // ==================================================

    public record LocationResponse(
            List<Location> results
    ) {
    }

    public record Location(
            String name,
            Double latitude,
            Double longitude
    ) {
    }

    public record WeatherApiResponse(
            CurrentWeather current
    ) {
    }

    public record CurrentWeather(
            Double temperature_2m,
            Double relative_humidity_2m,
            Double wind_speed_10m,
            Integer weather_code
    ) {
    }

    public record WeatherResponse(
            String city,
            Double temperature,
            Double humidity,
            Double windSpeed,
            String condition
    ) {
    }
}