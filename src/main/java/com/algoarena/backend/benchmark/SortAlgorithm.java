package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;

public interface SortAlgorithm {
    String getName();

    AlgorithmBenchmark benchmark(int[] input);
}
