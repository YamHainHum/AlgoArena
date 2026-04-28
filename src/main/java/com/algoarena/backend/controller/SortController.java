package com.algoarena.backend.controller;

import com.algoarena.backend.model.SortRequest;
import com.algoarena.backend.model.SortResult;
import com.algoarena.backend.service.SortingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sort")
@CrossOrigin(origins = "*")
public class SortController {
    @Autowired
    private SortingService sortingService;

    @PostMapping
    public ResponseEntity<?> sort(@RequestBody SortRequest request) {
        // Memory safety validation
        if (request.getArray() == null || request.getArray().length == 0) {
            return ResponseEntity.badRequest().body("Input array is null or empty.");
        }
        if (request.getArray().length > 100_000) {
            return ResponseEntity.badRequest().body("Dataset too large. Limit is 100,000 items.");
        }
        List<SortResult> results = new ArrayList<>();
        for (String algo : request.getAlgorithms()) {
            switch (algo.toLowerCase()) {
                case "bubble sort":
                    results.add(sortingService.bubbleSort(request.getArray()));
                    break;
                case "insertion sort":
                    results.add(sortingService.insertionSort(request.getArray()));
                    break;
                case "quick sort":
                    results.add(sortingService.quickSort(request.getArray()));
                    break;
                case "merge sort":
                    results.add(sortingService.mergeSort(request.getArray()));
                    break;
                case "heap sort":
                    results.add(sortingService.heapSort(request.getArray()));
                    break;
                default:
                    // skip unknown
            }
        }
        SortResult winner = results.stream().min(Comparator.comparingLong(SortResult::getExecutionTimeMs)).orElse(null);
        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        response.put("winner", winner != null ? winner.getAlgorithmName() : null);
        return ResponseEntity.ok(response);
    }
}
