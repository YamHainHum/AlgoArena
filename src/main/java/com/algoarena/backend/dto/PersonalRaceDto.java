package com.algoarena.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalRaceDto {
    private String username;
    private String leftAlgorithm;
    private String rightAlgorithm;
    private String winnerAlgorithm;
    private long leftTimeMs;
    private long rightTimeMs;
    private int arraySize;
    private String initialCondition;
    private LocalDateTime timestamp;
}
