package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class BubbleSort implements SortAlgorithm {

    @Override
    public String getName() {
        return "BUBBLE_SORT";
    }

    @Override
    public AlgorithmBenchmark benchmark(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        AtomicLong comparisons = new AtomicLong(0);
        AtomicLong swaps = new AtomicLong(0);

        long start = System.nanoTime();
        bubbleSort(arr, comparisons, swaps);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

        return new AlgorithmBenchmark(getName(), elapsedMs, comparisons.get(), swaps.get());
    }

    private void bubbleSort(int[] arr, AtomicLong comparisons, AtomicLong swaps) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                comparisons.incrementAndGet();
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swaps.incrementAndGet();
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }
}
