package com.algoarena.backend.service;

import com.algoarena.backend.model.ExecutionResult;
import com.algoarena.backend.model.SortResult;
import com.algoarena.backend.repository.ExecutionResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AnalyticsPersistenceService {
    @Autowired
    private ExecutionResultRepository executionResultRepository;

    public void saveSortResult(SortResult result, int datasetSize) {
        ExecutionResult entity = new ExecutionResult(
            result.getAlgorithmName(),
            result.getExecutionTimeMs(),
            result.getComparisons(),
            result.getSwaps(),
            datasetSize,
            LocalDateTime.now()
        );
        executionResultRepository.save(entity);
    }
}
