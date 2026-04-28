package com.algoarena.backend.controller;

import com.algoarena.backend.model.ExecutionResult;
import com.algoarena.backend.model.SortResult;
import com.algoarena.backend.repository.ExecutionResultRepository;
import com.algoarena.backend.service.AnalyticsPersistenceService;
import com.algoarena.backend.service.SortingEngineService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin("*")
@AllArgsConstructor
public class AnalyticsController {

    private final SortingEngineService sortingEngineService;
    private final AnalyticsPersistenceService analyticsPersistenceService;
    private final ExecutionResultRepository executionResultRepository;

    @PostMapping("/race")
    public Map<String, Object> raceAlgorithms(@RequestBody int[] dataset) throws Exception {
        if (dataset == null || dataset.length == 0) {
            throw new IllegalArgumentException("dataset cannot be null or empty");
        }

        CompletableFuture<SortResult> quickSort = sortingEngineService
                .runQuickSort(Arrays.copyOf(dataset, dataset.length));
        CompletableFuture<SortResult> mergeSort = sortingEngineService
                .runMergeSort(Arrays.copyOf(dataset, dataset.length));
        CompletableFuture<SortResult> heapSort = sortingEngineService
                .runHeapSort(Arrays.copyOf(dataset, dataset.length));

        CompletableFuture.allOf(quickSort, mergeSort, heapSort).join();

        SortResult quick = quickSort.get();
        SortResult merge = mergeSort.get();
        SortResult heap = heapSort.get();

        analyticsPersistenceService.saveSortResult(quick, dataset.length);
        analyticsPersistenceService.saveSortResult(merge, dataset.length);
        analyticsPersistenceService.saveSortResult(heap, dataset.length);

        return Map.of("results", List.of(quick, merge, heap));
    }

    @GetMapping("/leaderboard")
    public List<ExecutionResult> getLeaderboard() {
        return executionResultRepository.findAll().stream()
                .sorted(Comparator.comparingLong(ExecutionResult::getExecutionTimeMs))
                .limit(30)
                .toList();
    }
}
