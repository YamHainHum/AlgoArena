package com.algoarena.backend.model;

public class SortResult {
    private String algorithmName;
    private long executionTimeMs;
    private int comparisons;
    private int swaps;
    private int[] sortedArray;

    public SortResult() {}

    public SortResult(String algorithmName, long executionTimeMs, int comparisons, int swaps, int[] sortedArray) {
        this.algorithmName = algorithmName;
        this.executionTimeMs = executionTimeMs;
        this.comparisons = comparisons;
        this.swaps = swaps;
        this.sortedArray = sortedArray;
    }

    public String getAlgorithmName() {
        return algorithmName;
    }

    public void setAlgorithmName(String algorithmName) {
        this.algorithmName = algorithmName;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public int getComparisons() {
        return comparisons;
    }

    public void setComparisons(int comparisons) {
        this.comparisons = comparisons;
    }

    public int getSwaps() {
        return swaps;
    }

    public void setSwaps(int swaps) {
        this.swaps = swaps;
    }

    public int[] getSortedArray() {
        return sortedArray;
    }

    public void setSortedArray(int[] sortedArray) {
        this.sortedArray = sortedArray;
    }
}
