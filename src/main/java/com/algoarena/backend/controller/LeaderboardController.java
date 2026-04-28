package com.algoarena.backend.controller;

import com.algoarena.backend.dto.GlobalLeaderboardDto;
import com.algoarena.backend.dto.PersonalRaceDto;
import com.algoarena.backend.model.RaceResult;
import com.algoarena.backend.service.LeaderboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin("*")
@AllArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @PostMapping("/race-result")
    public ResponseEntity<?> saveRaceResult(@RequestBody RaceResult raceResult) {
        try {
            RaceResult saved = leaderboardService.saveRaceResult(raceResult);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/global")
    public ResponseEntity<List<GlobalLeaderboardDto>> getGlobalLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyLeaderboard(@RequestParam("username") String username) {
        try {
            List<PersonalRaceDto> history = leaderboardService.getPersonalHistory(username);
            return ResponseEntity.ok(history);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
