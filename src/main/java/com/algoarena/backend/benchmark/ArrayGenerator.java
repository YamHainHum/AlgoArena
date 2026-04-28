package com.algoarena.backend.benchmark;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class ArrayGenerator {

    public int[] generateArray(int size, int maxValue, String initialCondition) {
        if (size <= 0) {
            throw new IllegalArgumentException("size must be greater than 0");
        }
        if (maxValue <= 0) {
            throw new IllegalArgumentException("maxValue must be greater than 0");
        }

        String normalizedCondition = normalizeCondition(initialCondition);
        return switch (normalizedCondition) {
            case "RANDOM" -> randomArray(size, maxValue);
            case "NEARLY_SORTED" -> nearlySortedArray(size, maxValue);
            case "REVERSED" -> reversedArray(size, maxValue);
            default -> throw new IllegalArgumentException("Unsupported initialCondition: " + initialCondition);
        };
    }

    private int[] randomArray(int size, int maxValue) {
        int[] data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = ThreadLocalRandom.current().nextInt(1, maxValue + 1);
        }
        return data;
    }

    private int[] nearlySortedArray(int size, int maxValue) {
        int[] data = randomArray(size, maxValue);
        Arrays.sort(data);

        int swaps = Math.max(1, size / 10);
        for (int i = 0; i < swaps; i++) {
            int a = ThreadLocalRandom.current().nextInt(size);
            int b = ThreadLocalRandom.current().nextInt(size);
            int tmp = data[a];
            data[a] = data[b];
            data[b] = tmp;
        }
        return data;
    }

    private int[] reversedArray(int size, int maxValue) {
        int[] data = randomArray(size, maxValue);
        Arrays.sort(data);
        for (int i = 0, j = data.length - 1; i < j; i++, j--) {
            int tmp = data[i];
            data[i] = data[j];
            data[j] = tmp;
        }
        return data;
    }

    private String normalizeCondition(String initialCondition) {
        if (initialCondition == null || initialCondition.isBlank()) {
            return "RANDOM";
        }
        return initialCondition.trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');
    }
}
