package com.algoarena.backend.dto;

public class SortResult {
    private String algorithmName;
    private long executionTimeMs;
    private long comparisons;
    private long swaps;
    private int[] sortedArray;

    public SortResult() {}
    public SortResult(String algorithmName, long executionTimeMs, long comparisons, long swaps, int[] sortedArray) {
        this.algorithmName = algorithmName;
        this.executionTimeMs = executionTimeMs;
        this.comparisons = comparisons;
        this.swaps = swaps;
        this.sortedArray = sortedArray;
    }
    public String getAlgorithmName() { return algorithmName; }
    public void setAlgorithmName(String algorithmName) { this.algorithmName = algorithmName; }
    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
    public long getComparisons() { return comparisons; }
    public void setComparisons(long comparisons) { this.comparisons = comparisons; }
    public long getSwaps() { return swaps; }
    public void setSwaps(long swaps) { this.swaps = swaps; }
    public int[] getSortedArray() { return sortedArray; }
    public void setSortedArray(int[] sortedArray) { this.sortedArray = sortedArray; }
}
