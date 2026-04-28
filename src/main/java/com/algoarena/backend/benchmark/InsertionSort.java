package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class InsertionSort implements SortAlgorithm {

    @Override
    public String getName() {
        return "INSERTION_SORT";
    }

    @Override
    public AlgorithmBenchmark benchmark(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        AtomicLong comparisons = new AtomicLong(0);
        AtomicLong swaps = new AtomicLong(0);

        long start = System.nanoTime();
        insertionSort(arr, comparisons, swaps);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

        return new AlgorithmBenchmark(getName(), elapsedMs, comparisons.get(), swaps.get());
    }

    private void insertionSort(int[] arr, AtomicLong comparisons, AtomicLong swaps) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0) {
                comparisons.incrementAndGet();
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    swaps.incrementAndGet();
                    j--;
                } else {
                    break;
                }
            }

            if (j + 1 != i) {
                arr[j + 1] = key;
                swaps.incrementAndGet();
            }
        }
    }
}
