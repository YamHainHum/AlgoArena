package com.algoarena.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalLeaderboardDto {
    private String algorithmName;
    private long totalWins;
    private double winPercentage;
}
