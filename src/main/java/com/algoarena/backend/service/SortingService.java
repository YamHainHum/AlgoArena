package com.algoarena.backend.service;

import com.algoarena.backend.model.SortResult;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SortingService {
    public SortResult bubbleSort(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        int n = arr.length, comparisons = 0, swaps = 0;
        long start = System.currentTimeMillis();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swaps++;
                }
            }
        }
        long end = System.currentTimeMillis();
        return new SortResult("Bubble Sort", end - start, comparisons, swaps, arr);
    }

    public SortResult insertionSort(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        int n = arr.length, comparisons = 0, swaps = 0;
        long start = System.currentTimeMillis();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0) {
                comparisons++;
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    swaps++;
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
        }
        long end = System.currentTimeMillis();
        return new SortResult("Insertion Sort", end - start, comparisons, swaps, arr);
    }

    public SortResult quickSort(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        int[] metrics = new int[2]; // [comparisons, swaps]
        long start = System.currentTimeMillis();
        quickSortHelper(arr, 0, arr.length - 1, metrics);
        long end = System.currentTimeMillis();
        return new SortResult("Quick Sort", end - start, metrics[0], metrics[1], arr);
    }

    private void quickSortHelper(int[] arr, int low, int high, int[] metrics) {
        if (low < high) {
            int pi = partition(arr, low, high, metrics);
            quickSortHelper(arr, low, pi - 1, metrics);
            quickSortHelper(arr, pi + 1, high, metrics);
        }
    }

    private int partition(int[] arr, int low, int high, int[] metrics) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            metrics[0]++;
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                metrics[1]++;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        metrics[1]++;
        return i + 1;
    }

    public SortResult mergeSort(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        int[] metrics = new int[2]; // [comparisons, swaps]
        long start = System.currentTimeMillis();
        mergeSortHelper(arr, 0, arr.length - 1, metrics);
        long end = System.currentTimeMillis();
        return new SortResult("Merge Sort", end - start, metrics[0], metrics[1], arr);
    }

    private void mergeSortHelper(int[] arr, int l, int r, int[] metrics) {
        if (l < r) {
            int m = (l + r) / 2;
            mergeSortHelper(arr, l, m, metrics);
            mergeSortHelper(arr, m + 1, r, metrics);
            merge(arr, l, m, r, metrics);
        }
    }

    private void merge(int[] arr, int l, int m, int r, int[] metrics) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            metrics[0]++;
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
                metrics[1]++;
            }
        }
        while (i < n1) {
            arr[k++] = L[i++];
        }
        while (j < n2) {
            arr[k++] = R[j++];
        }
    }

    public SortResult heapSort(int[] input) {
        int[] arr = Arrays.copyOf(input, input.length);
        int n = arr.length, comparisons = 0, swaps = 0;
        long start = System.currentTimeMillis();
        for (int i = n / 2 - 1; i >= 0; i--) {
            int[] m = heapify(arr, n, i);
            comparisons += m[0];
            swaps += m[1];
        }
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            swaps++;
            int[] m = heapify(arr, i, 0);
            comparisons += m[0];
            swaps += m[1];
        }
        long end = System.currentTimeMillis();
        return new SortResult("Heap Sort", end - start, comparisons, swaps, arr);
    }

    private int[] heapify(int[] arr, int n, int i) {
        int comparisons = 0, swaps = 0;
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n) {
            comparisons++;
            if (arr[l] > arr[largest]) largest = l;
        }
        if (r < n) {
            comparisons++;
            if (arr[r] > arr[largest]) largest = r;
        }
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            swaps++;
            int[] m = heapify(arr, n, largest);
            comparisons += m[0];
            swaps += m[1];
        }
        return new int[]{comparisons, swaps};
    }
}
