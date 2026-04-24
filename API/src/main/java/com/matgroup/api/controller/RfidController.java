package com.matgroup.api.controller;

import com.matgroup.api.model.TagRead;
import com.matgroup.api.service.RfidReaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/rfid")
@RequiredArgsConstructor
@CrossOrigin
public class RfidController {

    // TODO: Adaptar para React
    private final RfidReaderService rfidService;

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "reading", rfidService.isReading(),
                "tagCount", rfidService.getCurrentTags().size()
        );
    }

    @GetMapping("/tags")
    public Collection<TagRead> tags() {
        return rfidService.getCurrentTags().values();
    }

    @PostMapping("/start")
    public Map<String, Object> start() throws Exception {
        rfidService.startReading();
        return Map.of("status", "started");
    }

    @PostMapping("/stop")
    public Map<String, Object> stop() throws Exception {
        rfidService.stopReading();
        return Map.of("status", "stopped");
    }

    @PostMapping("/clear")
    public Map<String, Object> clear() {
        rfidService.clearCache();
        return Map.of("status", "cleared");
    }
}