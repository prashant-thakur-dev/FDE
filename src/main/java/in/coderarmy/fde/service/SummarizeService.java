package in.coderarmy.fde.service;

import in.coderarmy.fde.aitools.CalculatorTool;
import in.coderarmy.fde.aitools.CurrencyExchangeTool;
import in.coderarmy.fde.aitools.DateTimeTool;
import in.coderarmy.fde.aitools.WeatherTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Service
public class SummarizeService {

    private final ChatClient chatClient;
    private final CalculatorTool calculatorTool;
    private final WeatherTool weatherTool;
    private final CurrencyExchangeTool currencyExchangeTool;
    private final DateTimeTool dateTimeTool;

    public SummarizeService(ChatClient.Builder chatClientBuilder, CalculatorTool calculatorTool, WeatherTool weatherTool, CurrencyExchangeTool currencyExchangeTool, DateTimeTool dateTimeTool){
        this.chatClient = chatClientBuilder.build();
        this.calculatorTool = calculatorTool;
        this.weatherTool = weatherTool;
        this.currencyExchangeTool = currencyExchangeTool;
        this.dateTimeTool = dateTimeTool;
    }

    private final List<Message> history = new ArrayList<>();

    private final String SystemPrompt = """
                        you are a helpfull AI assistance which help user in funny way and you have the access to external tools
                        also and you use these tool when ever some related information is required you can also answer user unrelated question.

                        follow these rules:
                        1. for arithmetic calculation always use external Calculator tool.
                        6. always use calculator for even small or trivial calculation.
                        2. for finding weather always use external Weather tool.
                        3. for finding currency always use external Currency Exchange tool.
                        7. for finding current date and time always use External date and time tools.
                        4. you may call multiple tools when solving a multi-step request.
                        5. never invent current weather or exchange-rate information.
                        """ ;

//        private final String SystemPrompt = """
//                        make answer as concise as possible but understandable
//                        """ ;

    public Flux<String> chat(String message){

        history.add(new UserMessage(message));

        StringBuilder finalResponse = new StringBuilder();

        Flux<String> output = chatClient
                .prompt()
                .system(SystemPrompt)
                .messages(history)
//                .user(message)
                .tools(calculatorTool, weatherTool, currencyExchangeTool, dateTimeTool)
                .stream()
                .content()
                .doOnNext(finalResponse::append)
                .doOnComplete(() -> {
                    history.add(new AssistantMessage(finalResponse.toString()));
                });
        
        return output;
    }

}
