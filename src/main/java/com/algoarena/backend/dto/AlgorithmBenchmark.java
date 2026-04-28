package com.algoarena.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlgorithmBenchmark {
    private String algorithm;
    private long timeMs;
    private long comparisons;
    private long swaps;
}
