package de.codecentric.index;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    
    @GetMapping("/")
    public String loginPage() {
        return "login"; 
    }

    @GetMapping("/dashboard")
    public String dashboardPage() {
        return "index"; 
    }

    @GetMapping("/logout")
    public String handleLogout() {
        return "redirect:/"; 
    }

}
