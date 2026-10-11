package in.coderarmy.fde.aitools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CalculatorTool {

    @Tool(description = """
                 Perform arithmetic calculation.
                 Supported operations: add, subject, multiply, divide, mod, power.
                 """)
    public double calculate(
            @ToolParam(description = "Operation: add, subtract, multiplication, division, mod, power")
            String operation,

            @ToolParam(description = "first number")
            double a,
            @ToolParam(description = "second number")
            double b){

        System.out.println("Calculator tool called");

        switch (operation) {

            case "add" -> {
                return a + b;
            }
            case "subtract" -> {
                return a - b;
            }
            case "multiplication" -> {
                return a * b;
            }
            case "division" -> {
                if (b == 0) {
                    throw new IllegalArgumentException("Cannot divide by 0");
                }
                return a / b;
            }
            case "mod" -> {
                if (b == 0) {
                    throw new IllegalArgumentException("Cannot divide by 0");
                }
                return a % b;
            }
            case "power" -> {
                return Math.pow(a, b);
            }
            default -> throw new IllegalArgumentException("Unsupported operation " + operation);
        }
    }
}
