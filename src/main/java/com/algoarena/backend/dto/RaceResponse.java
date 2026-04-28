package com.algoarena.backend.dto;

import java.util.List;

public class RaceResponse {
    private List<SortResult> results;
    private String winner;

    public RaceResponse(List<SortResult> results, String winner) {
        this.results = results;
        this.winner = winner;
    }
    public List<SortResult> getResults() { return results; }
    public void setResults(List<SortResult> results) { this.results = results; }
    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }
}
