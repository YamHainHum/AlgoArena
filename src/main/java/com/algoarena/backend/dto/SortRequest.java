package com.algoarena.backend.dto;

import java.util.List;

public class SortRequest {
    private int[] array;
    private List<String> algorithms;

    public int[] getArray() { return array; }
    public void setArray(int[] array) { this.array = array; }
    public List<String> getAlgorithms() { return algorithms; }
    public void setAlgorithms(List<String> algorithms) { this.algorithms = algorithms; }
}
