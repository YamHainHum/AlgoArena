package com.algoarena.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "race_result")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RaceResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String username;

    @Column(nullable = false, length = 64)
    private String leftAlgorithm;

    @Column(nullable = false, length = 64)
    private String rightAlgorithm;

    @Column(nullable = false, length = 64)
    private String winnerAlgorithm;

    @Column(nullable = false)
    private long leftTimeMs;

    @Column(nullable = false)
    private long rightTimeMs;

    @Column(nullable = false)
    private int arraySize;

    @Column(nullable = false, length = 32)
    private String initialCondition;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
