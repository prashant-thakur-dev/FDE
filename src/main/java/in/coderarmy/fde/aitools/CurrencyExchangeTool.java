package in.coderarmy.fde.aitools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CurrencyExchangeTool {

    private final RestClient restClient;

    public CurrencyExchangeTool(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @Tool(description = """
            Convert an amount from one currency to another.

            Use this tool whenever the user asks for currency conversion.

            Examples:
            - Convert 100 USD to INR
            -  6
            - Convert 50 EUR to USD

            Currency must be provided using the standard three-letter ISO code:
            USD, EUR, INR, JPY, GBP, AUD, CAD, etc.
            """)
    public CurrencyExchangeResponse convertCurrency(

            @ToolParam(description = "Amount to convert")
            double amount,

            @ToolParam(description = "Source currency ISO code, for example INR")
            String from,

            @ToolParam(description = "Target currency ISO code, for example JPY")
            String to) {

        System.out.println(
                "Currency Exchange Tool called: "
                        + amount + " " + from + " -> " + to
        );

        if (amount < 0) {
            throw new IllegalArgumentException(
                    "Amount cannot be negative"
            );
        }

        String sourceCurrency = from.toUpperCase().trim();
        String targetCurrency = to.toUpperCase().trim();

        // Same currency
        if (sourceCurrency.equals(targetCurrency)) {

            return new CurrencyExchangeResponse(
                    amount,
                    sourceCurrency,
                    targetCurrency,
                    1.0,
                    amount
            );
        }

        // --------------------------------------------------
        // Call Frankfurter API
        // --------------------------------------------------

        ExchangeRateResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.frankfurter.dev")
                        .path("/v2/rate/{base}/{quote}")
                        .build(
                                sourceCurrency.toLowerCase(),
                                targetCurrency.toLowerCase()
                        ))
                .retrieve()
                .body(ExchangeRateResponse.class);

        if (response == null || response.rate() == null) {

            throw new IllegalArgumentException(
                    "Exchange rate unavailable for "
                            + sourceCurrency
                            + " to "
                            + targetCurrency
            );
        }

        double exchangeRate = response.rate();

        double convertedAmount = amount * exchangeRate;

        return new CurrencyExchangeResponse(
                amount,
                sourceCurrency,
                targetCurrency,
                exchangeRate,
                convertedAmount
        );
    }

    // ==================================================
    // Frankfurter API Response
    // ==================================================

    public record ExchangeRateResponse(
            String date,
            String base,
            String quote,
            Double rate
    ) {
    }

    // ==================================================
    // Tool Response
    // ==================================================

    public record CurrencyExchangeResponse(
            double amount,
            String from,
            String to,
            double exchangeRate,
            double convertedAmount
    ) {
    }
}