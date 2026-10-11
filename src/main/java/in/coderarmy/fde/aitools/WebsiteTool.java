package in.coderarmy.fde.aitools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Collectors;

@Component
public class WebsiteTool {

    /*
     * ALL websites are created inside this directory.
     *
     * Example:
     *
     * generated-websites/
     * ├── portfolio/
     * │   ├── index.html
     * │   ├── style.css
     * │   └── script.js
     * └── ecommerce/
     *     ├── index.html
     *     ├── style.css
     *     └── script.js
     */
    private final Path rootDirectory =
            Path.of("generated-websites").toAbsolutePath().normalize();

    public WebsiteTool() {
        try {
            Files.createDirectories(rootDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to initialize website workspace", e
            );
        }
    }

    // ============================================================
    // SAFETY CHECK
    // ============================================================

    private Path safePath(String directoryName, String fileName) {

        System.out.println("safety check started");

        if (directoryName == null || directoryName.isBlank()) {
            throw new IllegalArgumentException(
                    "Directory name cannot be empty"
            );
        }

        Path projectPath = rootDirectory
                .resolve(directoryName)
                .normalize();

        // Project itself must remain inside workspace
        if (!projectPath.startsWith(rootDirectory)) {
            throw new SecurityException(
                    "Access denied: invalid directory path"
            );
        }

        // If only directory is required
        if (fileName == null || fileName.isBlank()) {
            return projectPath;
        }

        Path filePath = projectPath
                .resolve(fileName)
                .normalize();

        // File must remain inside the selected project
        if (!filePath.startsWith(projectPath)) {
            throw new SecurityException(
                    "Access denied: file path is outside project directory"
            );
        }
        System.out.println("safety check ended");

        return filePath;
    }

    // ============================================================
    // CREATE DIRECTORY
    // ============================================================

    @Tool(description = """
            Create a new website project directory.
            All website projects are created inside the safe website workspace.
            Always create the project directory before creating files.
            """)
    public String createDirectory(
            @ToolParam(description = "Website project directory name")
            String directoryName) {
        System.out.println("creating directory");

        try {

            Path projectPath = safePath(directoryName, null);

            Files.createDirectories(projectPath);

            return "Directory created successfully: "
                    + projectPath;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to create directory: " + directoryName,
                    e
            );
        }
    }

    // ============================================================
    // VIEW FILES
    // ============================================================

    @Tool(description = """
            View all files and directories inside a website project.
            Use this before modifying an existing website to understand
            the project structure.
            """)
    public String viewFiles(
            @ToolParam(description = "Website project directory name")
            String directoryName) {
        System.out.println("Looking into file");

        try {

            Path projectPath = safePath(directoryName, null);

            if (!Files.exists(projectPath)) {
                return "Directory does not exist: " + directoryName;
            }

            if (!Files.isDirectory(projectPath)) {
                return "Path is not a directory: " + directoryName;
            }

            try (var stream = Files.walk(projectPath)) {

                String files = stream
                        .filter(path -> !path.equals(projectPath))
                        .map(projectPath::relativize)
                        .map(Path::toString)
                        .sorted()
                        .collect(Collectors.joining("\n"));

                if (files.isBlank()) {
                    return "Directory is empty.";
                }

                return files;
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to view files: " + directoryName,
                    e
            );
        }
    }

    // ============================================================
    // CREATE FILE
    // ============================================================

    @Tool(description = """
            Create a new file inside a website project.
            Examples: index.html, style.css, script.js.
            Always create the file before writing its contents.
            """)
    public String createFile(

            @ToolParam(description = "Website project directory name")
            String directoryName,

            @ToolParam(description = "File name, for example index.html")
            String fileName) {
        System.out.println("creating files");

        try {

            Path filePath = safePath(
                    directoryName,
                    fileName
            );

            Path projectPath = safePath(
                    directoryName,
                    null
            );

            if (!Files.exists(projectPath)) {
                return "Project directory does not exist. "
                        + "Create the directory first.";
            }

            if (Files.exists(filePath)) {
                return "File already exists: " + fileName;
            }

            Files.createDirectories(filePath.getParent());

            Files.createFile(filePath);

            return "File created successfully: "
                    + filePath;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to create file: " + fileName,
                    e
            );
        }
    }

    // ============================================================
    // READ FILE
    // ============================================================

    @Tool(description = """
            Read the contents of an existing website file.
            Always read an existing file before modifying it.
            """)
    public String readFile(

            @ToolParam(description = "Website project directory name")
            String directoryName,

            @ToolParam(description = "File name")
            String fileName) {
        System.out.println("reading file");

        try {

            Path filePath = safePath(
                    directoryName,
                    fileName
            );

            if (!Files.exists(filePath)) {
                return "File does not exist: " + fileName;
            }

            if (!Files.isRegularFile(filePath)) {
                return "Path is not a file: " + fileName;
            }

            return Files.readString(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read file: " + fileName,
                    e
            );
        }
    }

    // ============================================================
    // WRITE FILE
    // ============================================================

    @Tool(description = """
            Write or replace the complete contents of a website file.
            For an existing file, read it first before writing changes.
            Use this tool for HTML, CSS, and JavaScript code.
            """)
    public String writeFile(

            @ToolParam(description = "Website project directory name")
            String directoryName,

            @ToolParam(description = "File name")
            String fileName,

            @ToolParam(description = "Complete file contents")
            String content) {
        System.out.println("writing into files");

        try {

            Path filePath = safePath(
                    directoryName,
                    fileName
            );

            Path projectPath = safePath(
                    directoryName,
                    null
            );

            if (!Files.exists(projectPath)) {
                return "Project directory does not exist.";
            }

            if (!Files.exists(filePath)) {
                return "File does not exist. "
                        + "Use createFile before writeFile.";
            }

            Files.writeString(
                    filePath,
                    content,
                    StandardOpenOption.TRUNCATE_EXISTING,
                    StandardOpenOption.WRITE
            );

            return "File written successfully: "
                    + filePath;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to write file: " + fileName,
                    e
            );
        }
    }
}