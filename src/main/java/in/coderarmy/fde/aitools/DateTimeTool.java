package in.coderarmy.fde.aitools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Component
public class DateTimeTool {

    @Tool(description = """
            Get date and time information.

            Supported operations:
            - current_datetime: Get the current date and time.
            - current_date: Get today's date.
            - current_time: Get the current time.
            - day_of_week: Get the day of the week for a date.
            - days_between: Calculate the number of days between two dates.

            Dates should use yyyy-MM-dd format.
            """)
    public String dateTime(
            @ToolParam(description = """
                    Operation:
                    current_datetime, current_date, current_time,
                    day_of_week, days_between
                    """)
            String operation,

            @ToolParam(description = "Date in yyyy-MM-dd format. Required for day_of_week.")
            String date,

            @ToolParam(description = "Start date in yyyy-MM-dd format. Required for days_between.")
            String startDate,

            @ToolParam(description = "End date in yyyy-MM-dd format. Required for days_between.")
            String endDate) {

        System.out.println("DateTime tool called: " + operation);

        return switch (operation.toLowerCase()) {

            case "current_datetime" -> {
                LocalDateTime now = LocalDateTime.now();

                yield now.format(
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                );
            }

            case "current_date" ->
                    LocalDate.now().toString();

            case "current_time" -> {
                LocalTime now = LocalTime.now();

                yield now.format(
                        DateTimeFormatter.ofPattern("HH:mm:ss")
                );
            }

            case "day_of_week" -> {

                if (date == null || date.isBlank()) {
                    throw new IllegalArgumentException(
                            "Date is required for day_of_week"
                    );
                }

                LocalDate parsedDate = LocalDate.parse(date);

                yield parsedDate.getDayOfWeek().toString();
            }

            case "days_between" -> {

                if (startDate == null || startDate.isBlank()
                        || endDate == null || endDate.isBlank()) {

                    throw new IllegalArgumentException(
                            "Start date and end date are required"
                    );
                }

                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);

                long days = ChronoUnit.DAYS.between(start, end);

                yield String.valueOf(days);
            }

            default ->
                    throw new IllegalArgumentException(
                            "Unsupported operation: " + operation
                    );
        };
    }
}
