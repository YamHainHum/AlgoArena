package com.algoarena.backend.benchmark;

import com.algoarena.backend.dto.AlgorithmBenchmark;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class HeapSort implements SortAlgorithm {

    @Override
    public String getName() {
        return "HEAP_SORT";
    }

    @Override
    public AlgorithmBenchmark benchmark(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        AtomicLong comparisons = new AtomicLong(0);
        AtomicLong swaps = new AtomicLong(0);

        long start = System.nanoTime();
        heapSort(arr, comparisons, swaps);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

        return new AlgorithmBenchmark(getName(), elapsedMs, comparisons.get(), swaps.get());
    }

    private void heapSort(int[] arr, AtomicLong comparisons, AtomicLong swaps) {
        int n = arr.length;

        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i, comparisons, swaps);
        }

        for (int i = n - 1; i > 0; i--) {
            swap(arr, 0, i, swaps);
            heapify(arr, i, 0, comparisons, swaps);
        }
    }

    private void heapify(int[] arr, int n, int i, AtomicLong comparisons, AtomicLong swaps) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n) {
            comparisons.incrementAndGet();
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            comparisons.incrementAndGet();
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest != i) {
            swap(arr, i, largest, swaps);
            heapify(arr, n, largest, comparisons, swaps);
        }
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
