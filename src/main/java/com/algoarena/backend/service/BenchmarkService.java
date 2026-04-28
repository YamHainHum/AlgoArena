package com.algoarena.backend.service;

import com.algoarena.backend.benchmark.ArrayGenerator;
import com.algoarena.backend.benchmark.SortAlgorithm;
import com.algoarena.backend.dto.AlgorithmBenchmark;
import com.algoarena.backend.dto.BenchmarkRequest;
import com.algoarena.backend.dto.BenchmarkResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BenchmarkService {

    private static final int MAX_BENCHMARK_SIZE = 500_000;

    private static final List<String> SUPPORTED_ORDER = List.of(
            "QUICK_SORT",
            "MERGE_SORT",
            "HEAP_SORT",
            "SELECTION_SORT",
            "INSERTION_SORT",
            "BUBBLE_SORT"
    );

    private final ArrayGenerator arrayGenerator;
    private final List<SortAlgorithm> sortAlgorithms;

    @Qualifier("algoWorkerPool")
    private final Executor algoWorkerPool;

    public BenchmarkResponse runBenchmark(BenchmarkRequest request) {
        validateRequest(request);

        int[] baseArray = arrayGenerator.generateArray(
                request.getSize(),
                request.getMaxValue(),
                request.getInitialCondition()
        );

        Map<String, SortAlgorithm> algorithmRegistry = sortAlgorithms.stream()
                .collect(Collectors.toMap(
                        SortAlgorithm::getName,
                        algorithm -> algorithm,
                        (left, right) -> left,
                        LinkedHashMap::new
                ));

        List<String> requestedAlgorithms = resolveRequestedAlgorithms(request.getAlgorithms(), algorithmRegistry);

        List<CompletableFuture<AlgorithmBenchmark>> tasks = requestedAlgorithms.stream()
                .map(algorithmName -> CompletableFuture.supplyAsync(() -> {
                    SortAlgorithm algorithm = algorithmRegistry.get(algorithmName);
                    int[] inputCopy = Arrays.copyOf(baseArray, baseArray.length);
                    return algorithm.benchmark(inputCopy);
                }, algoWorkerPool))
                .toList();

        CompletableFuture.allOf(tasks.toArray(new CompletableFuture[0])).join();
        List<AlgorithmBenchmark> results = tasks.stream().map(CompletableFuture::join).toList();

        return new BenchmarkResponse(baseArray.length, results);
    }

    private void validateRequest(BenchmarkRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.getSize() <= 1) {
            throw new IllegalArgumentException("size must be greater than 1");
        }
        if (request.getSize() > MAX_BENCHMARK_SIZE) {
            throw new IllegalArgumentException("size is too large. Maximum supported size is " + MAX_BENCHMARK_SIZE);
        }
        if (request.getMaxValue() <= 0) {
            throw new IllegalArgumentException("maxValue must be greater than 0");
        }
    }

    private List<String> resolveRequestedAlgorithms(List<String> requested, Map<String, SortAlgorithm> registry) {
        if (requested == null || requested.isEmpty()) {
            return SUPPORTED_ORDER.stream()
                    .filter(registry::containsKey)
                    .toList();
        }

        return requested.stream()
                .map(this::normalizeAlgorithmName)
                .peek(name -> {
                    if (!registry.containsKey(name)) {
                        throw new IllegalArgumentException("Unsupported algorithm: " + name);
                    }
                })
                .toList();
    }

    private String normalizeAlgorithmName(String algorithm) {
        if (algorithm == null || algorithm.isBlank()) {
            throw new IllegalArgumentException("algorithm name cannot be blank");
        }
        return algorithm.trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');
    }
}
