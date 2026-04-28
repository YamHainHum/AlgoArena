package com.algoarena.backend.service;

import com.algoarena.backend.model.SortResult;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service
public class SortingEngineService {

    @Async("algoWorkerPool")
    public CompletableFuture<SortResult> runQuickSort(int[] dataset) {
        long startTime = System.currentTimeMillis();
        QuickSortStats stats = new QuickSortStats();
        quickSort(dataset, 0, dataset.length - 1, stats);
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        SortResult result = new SortResult("Quick Sort", executionTime, stats.comparisons, stats.swaps, dataset);
        return CompletableFuture.completedFuture(result);
    }

    private static class QuickSortStats {
        int comparisons = 0;
        int swaps = 0;
    }

    private void quickSort(int[] arr, int low, int high, QuickSortStats stats) {
        if (low < high) {
            int pi = partition(arr, low, high, stats);
            quickSort(arr, low, pi - 1, stats);
            quickSort(arr, pi + 1, high, stats);
        }
    }

    private int partition(int[] arr, int low, int high, QuickSortStats stats) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            stats.comparisons++;
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j, stats);
            }
        }
        swap(arr, i + 1, high, stats);
        return i + 1;
    }

    private void swap(int[] arr, int i, int j, QuickSortStats stats) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        stats.swaps++;
    }

    @Async("algoWorkerPool")
    public CompletableFuture<SortResult> runMergeSort(int[] dataset) {
        long startTime = System.currentTimeMillis();
        MergeSortStats stats = new MergeSortStats();
        mergeSort(dataset, 0, dataset.length - 1, stats);
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        SortResult result = new SortResult("Merge Sort", executionTime, stats.comparisons, stats.swaps, dataset);
        return CompletableFuture.completedFuture(result);
    }

    private static class MergeSortStats {
        int comparisons = 0;
        int swaps = 0;
    }

    private void mergeSort(int[] arr, int l, int r, MergeSortStats stats) {
        if (l < r) {
            int m = l + (r - l) / 2;
            mergeSort(arr, l, m, stats);
            mergeSort(arr, m + 1, r, stats);
            merge(arr, l, m, r, stats);
        }
    }

    private void merge(int[] arr, int l, int m, int r, MergeSortStats stats) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            stats.comparisons++;
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
                stats.swaps++;
            }
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    @Async("algoWorkerPool")
    public CompletableFuture<SortResult> runHeapSort(int[] dataset) {
        long startTime = System.currentTimeMillis();
        HeapSortStats stats = new HeapSortStats();
        heapSort(dataset, stats);
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        SortResult result = new SortResult("Heap Sort", executionTime, stats.comparisons, stats.swaps, dataset);
        return CompletableFuture.completedFuture(result);
    }

    private static class HeapSortStats {
        int comparisons = 0;
        int swaps = 0;
    }

    private void heapSort(int[] arr, HeapSortStats stats) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i, stats);
        for (int i = n - 1; i > 0; i--) {
            heapSwap(arr, 0, i, stats);
            heapify(arr, i, 0, stats);
        }
    }

    private void heapify(int[] arr, int n, int i, HeapSortStats stats) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n) {
            stats.comparisons++;
            if (arr[l] > arr[largest]) largest = l;
        }
        if (r < n) {
            stats.comparisons++;
            if (arr[r] > arr[largest]) largest = r;
        }
        if (largest != i) {
            heapSwap(arr, i, largest, stats);
            heapify(arr, n, largest, stats);
        }
    }

    private void heapSwap(int[] arr, int i, int j, HeapSortStats stats) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        stats.swaps++;
    }
}
