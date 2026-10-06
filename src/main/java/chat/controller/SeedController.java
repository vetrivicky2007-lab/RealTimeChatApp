package chat.controller;

import chat.service.DataSeeder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    private final DataSeeder dataSeeder;

    public SeedController(DataSeeder dataSeeder) {
        this.dataSeeder = dataSeeder;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSeedStatus() {
        Map<String, Object> report = dataSeeder.getLatestReport();
        return ResponseEntity.ok(report);
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runSeed(
            @RequestParam(value = "force", defaultValue = "false") boolean force) {
        Map<String, Object> report = dataSeeder.seedAll(force);
        return ResponseEntity.ok(report);
    }
}
