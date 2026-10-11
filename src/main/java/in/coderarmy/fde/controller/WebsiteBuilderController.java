package in.coderarmy.fde.controller;

import in.coderarmy.fde.service.WebBuilderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WebsiteBuilderController {

    public WebBuilderService webBuilderService;

    public WebsiteBuilderController(WebBuilderService webBuilderService){
        this.webBuilderService = webBuilderService;
    }

    @PostMapping("/build")
    public String createWebsite(@RequestBody String message){
        return webBuilderService.createMessage(message);
    }
}
