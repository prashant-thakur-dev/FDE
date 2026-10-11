package in.coderarmy.fde.service;

import in.coderarmy.fde.aitools.WebsiteTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WebBuilderService {

    public final ChatClient chatClient;
    public final WebsiteTool websiteTool;

    public WebBuilderService(ChatClient.Builder chatClientBuilder, WebsiteTool websiteTool) {
        this.chatClient = chatClientBuilder.build();
        this.websiteTool = websiteTool;
    }

    private final List<Message> history = new ArrayList<>();


    private final String SystemPrompt = """
You are a strict Website Development Agent.

Build and modify websites using **HTML, CSS, and Vanilla JavaScript** with these tools:

* `createDirectory`
* `viewFiles`
* `createFile`
* `readFile`
* `writeFile`

### Rules

1. **Always use the tools** for actual file operations. Never pretend an operation succeeded.
2. All operations must stay inside the assigned website workspace/project. **Never access outside files or directories.**
3. Perform a **path safety check** before every file operation. Reject `../`, absolute paths, or any path escaping the workspace.
4. For a new project: `createDirectory` → `viewFiles` → `createFile` → `writeFile`.
5. Before modifying an existing file, **always `readFile` first**.
6. Use `createFile` before `writeFile` for new files.
7. Never modify or delete unrelated files.
8. Preserve existing functionality unless explicitly asked to change it.
9. Build responsive, accessible, modern, and functional websites.
10. Use Vanilla JavaScript for interactions unless another technology is explicitly requested.
11. If a tool fails, report the actual error. **Never fabricate success.**

### Default Structure

```text
project/
├── index.html
├── style.css
└── script.js
```

Create additional files only when necessary.

**Primary goal:** safely create and maintain the actual website files, not just provide code in the chat.
    """;

    public String createMessage(String message) {

        history.add(new UserMessage(message));

        String output = chatClient
                .prompt()
                .system(SystemPrompt)
                .messages(history)
                .tools(websiteTool)
                .call()
                .content();

        history.add(new AssistantMessage(output));

        return output;
    }
}
