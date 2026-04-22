package com.matgroup.api.controller;

import com.matgroup.api.service.RfidReaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/read")
@RequiredArgsConstructor
@CrossOrigin
public class RfidController {

    // TODO: Adaptar para React
    private final RfidReaderService rfidService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("reading", rfidService.isReading());
        model.addAttribute("tags", rfidService.getCurrentTags().values());
        return "index";
    }

    @PostMapping("/start")
    @ResponseBody
    public Map<String, Object> start() throws Exception {
        rfidService.startReading();
        return Map.of("status", "started");
    }

    @PostMapping("/stop")
    @ResponseBody
    public Map<String, Object> stop() throws Exception {
        rfidService.stopReading();
        return Map.of("status", "stopped");
    }

    @PostMapping("/clear")
    @ResponseBody
    public Map<String, Object> clear() {
        rfidService.clearCache();
        return Map.of("status", "cleared");
    }
}