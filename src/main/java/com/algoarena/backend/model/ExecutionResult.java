package com.algoarena.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "execution_result")
@Data
@NoArgsConstructor
public class ExecutionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String algorithmName;
    private long executionTimeMs;
    private int comparisons;
    private int swaps;
    private int datasetSize;
    private LocalDateTime executedAt;

    public ExecutionResult(String algorithmName, long executionTimeMs, int comparisons, int swaps, int datasetSize, LocalDateTime executedAt) {
        this.algorithmName = algorithmName;
        this.executionTimeMs = executionTimeMs;
        this.comparisons = comparisons;
        this.swaps = swaps;
        this.datasetSize = datasetSize;
        this.executedAt = executedAt;
    }
}
