package com.algoarena.backend.repository;

import com.algoarena.backend.model.ExecutionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutionResultRepository extends JpaRepository<ExecutionResult, Long> {
    // Custom queries can be added here
}
