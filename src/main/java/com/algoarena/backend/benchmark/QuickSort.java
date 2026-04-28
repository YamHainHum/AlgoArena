package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class QuickSort implements SortAlgorithm {

    @Override
    public String getName() {
        return "QUICK_SORT";
    }

    @Override
    public AlgorithmBenchmark benchmark(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        AtomicLong comparisons = new AtomicLong(0);
        AtomicLong swaps = new AtomicLong(0);

        long start = System.nanoTime();
        quickSort(arr, 0, arr.length - 1, comparisons, swaps);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

        return new AlgorithmBenchmark(getName(), elapsedMs, comparisons.get(), swaps.get());
    }

    private void quickSort(int[] arr, int low, int high, AtomicLong comparisons, AtomicLong swaps) {
        if (low < high) {
            int pivot = partition(arr, low, high, comparisons, swaps);
            quickSort(arr, low, pivot - 1, comparisons, swaps);
            quickSort(arr, pivot + 1, high, comparisons, swaps);
        }
    }

    private int partition(int[] arr, int low, int high, AtomicLong comparisons, AtomicLong swaps) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            comparisons.incrementAndGet();
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j, swaps);
            }
        }
        swap(arr, i + 1, high, swaps);
        return i + 1;
    }

    private void swap(int[] arr, int i, int j, AtomicLong swaps) {
        if (i == j) {
            return;
        }
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        swaps.incrementAndGet();
    }
}
