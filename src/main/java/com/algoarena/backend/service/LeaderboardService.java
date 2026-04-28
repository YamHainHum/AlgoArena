package com.algoarena.backend.service;

import com.algoarena.backend.dto.GlobalLeaderboardDto;
import com.algoarena.backend.dto.PersonalRaceDto;
import com.algoarena.backend.model.RaceResult;
import com.algoarena.backend.repository.RaceResultRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@AllArgsConstructor
public class LeaderboardService {

    private final RaceResultRepository raceResultRepository;

    public RaceResult saveRaceResult(RaceResult raceResult) {
        validateRaceResult(raceResult);

        raceResult.setUsername(raceResult.getUsername().trim());
        raceResult.setLeftAlgorithm(normalizeAlgorithmName(raceResult.getLeftAlgorithm()));
        raceResult.setRightAlgorithm(normalizeAlgorithmName(raceResult.getRightAlgorithm()));
        raceResult.setWinnerAlgorithm(normalizeAlgorithmName(raceResult.getWinnerAlgorithm()));
        raceResult.setInitialCondition(normalizeCondition(raceResult.getInitialCondition()));

        if (raceResult.getTimestamp() == null) {
            raceResult.setTimestamp(LocalDateTime.now());
        }

        return raceResultRepository.save(raceResult);
    }

    public List<GlobalLeaderboardDto> getGlobalLeaderboard() {
        long totalRaces = raceResultRepository.count();
        if (totalRaces == 0) {
            return Collections.emptyList();
        }

        return raceResultRepository.findGlobalWinCounts().stream()
                .map(row -> {
                    String algorithm = (String) row[0];
                    long wins = ((Number) row[1]).longValue();
                    double percentage = (wins * 100.0d) / totalRaces;
                    double rounded = Math.round(percentage * 100.0d) / 100.0d;
                    return new GlobalLeaderboardDto(algorithm, wins, rounded);
                })
                .toList();
    }

    public List<PersonalRaceDto> getPersonalHistory(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("username is required");
        }

        return raceResultRepository.findTop50ByUsernameOrderByTimestampDesc(username.trim()).stream()
                .map(this::toPersonalRaceDto)
                .toList();
    }

    private PersonalRaceDto toPersonalRaceDto(RaceResult raceResult) {
        return new PersonalRaceDto(
                raceResult.getUsername(),
                raceResult.getLeftAlgorithm(),
                raceResult.getRightAlgorithm(),
                raceResult.getWinnerAlgorithm(),
                raceResult.getLeftTimeMs(),
                raceResult.getRightTimeMs(),
                raceResult.getArraySize(),
                raceResult.getInitialCondition(),
                raceResult.getTimestamp()
        );
    }

    private void validateRaceResult(RaceResult raceResult) {
        if (raceResult == null) {
            throw new IllegalArgumentException("request body is required");
        }
        if (raceResult.getUsername() == null || raceResult.getUsername().isBlank()) {
            throw new IllegalArgumentException("username is required");
        }
        if (raceResult.getLeftAlgorithm() == null || raceResult.getLeftAlgorithm().isBlank()) {
            throw new IllegalArgumentException("leftAlgorithm is required");
        }
        if (raceResult.getRightAlgorithm() == null || raceResult.getRightAlgorithm().isBlank()) {
            throw new IllegalArgumentException("rightAlgorithm is required");
        }
        if (raceResult.getWinnerAlgorithm() == null || raceResult.getWinnerAlgorithm().isBlank()) {
            throw new IllegalArgumentException("winnerAlgorithm is required");
        }
        if (raceResult.getArraySize() <= 0) {
            throw new IllegalArgumentException("arraySize must be greater than 0");
        }
        if (raceResult.getInitialCondition() == null || raceResult.getInitialCondition().isBlank()) {
            throw new IllegalArgumentException("initialCondition is required");
        }
    }

    private String normalizeAlgorithmName(String algorithmName) {
        return algorithmName.trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');
    }

    private String normalizeCondition(String initialCondition) {
        return initialCondition.trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');
    }
}
