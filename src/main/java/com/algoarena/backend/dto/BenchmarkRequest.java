package com.algoarena.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BenchmarkRequest {
    private int size;
    private int maxValue;
    private String initialCondition;
    private List<String> algorithms;
}
