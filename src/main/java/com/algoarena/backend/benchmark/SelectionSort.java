package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class SelectionSort implements SortAlgorithm {

    @Override
    public String getName() {
        return "SELECTION_SORT";
    }

    @Override
    public AlgorithmBenchmark benchmark(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        AtomicLong comparisons = new AtomicLong(0);
        AtomicLong swaps = new AtomicLong(0);

        long start = System.nanoTime();
        selectionSort(arr, comparisons, swaps);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

        return new AlgorithmBenchmark(getName(), elapsedMs, comparisons.get(), swaps.get());
    }

    private void selectionSort(int[] arr, AtomicLong comparisons, AtomicLong swaps) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                comparisons.incrementAndGet();
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex != i) {
                int temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
                swaps.incrementAndGet();
            }
        }
    }
}
