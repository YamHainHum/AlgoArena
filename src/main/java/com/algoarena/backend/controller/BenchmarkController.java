package com.algoarena.backend.controller;

import com.algoarena.backend.dto.BenchmarkRequest;
import com.algoarena.backend.dto.BenchmarkResponse;
import com.algoarena.backend.service.BenchmarkService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@AllArgsConstructor
public class BenchmarkController {

    private final BenchmarkService benchmarkService;

    @PostMapping("/benchmark")
    public ResponseEntity<?> runBenchmark(@RequestBody BenchmarkRequest request) {
        try {
            BenchmarkResponse response = benchmarkService.runBenchmark(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
