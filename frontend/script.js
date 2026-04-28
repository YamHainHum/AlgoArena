/* ALGO ARENA Frontend Script */

const el = {
    generateBtn: document.getElementById('generateBtn'),
    deepBenchmarkBtn: document.getElementById('deepBenchmarkBtn'),
    globalLeaderboardBtn: document.getElementById('globalLeaderboardBtn'),
    initialCondition: document.getElementById('initialCondition'),
    arraySize: document.getElementById('arraySize'),
    arraySizeValue: document.getElementById('arraySizeValue'),
    maxValue: document.getElementById('maxValue'),
    maxValueValue: document.getElementById('maxValueValue'),
    primaryAlgo: document.getElementById('primaryAlgo'),
    primaryAlgoGroup: document.getElementById('primaryAlgo')?.closest('.algo-selector'),

    themeToggleBtn: document.getElementById('themeToggleBtn'),
    compareModeBtn: document.getElementById('compareModeBtn'),
    raceModeBtn: document.getElementById('raceModeBtn'),
    shortcutsBtn: document.getElementById('shortcutsBtn'),

    chartPanel: document.getElementById('chartPanel'),
    expandChartBtn: document.getElementById('expandChartBtn'),
    exitExpandBtn: document.getElementById('exitExpandBtn'),
    visualModeContainer: document.getElementById('visualModeContainer'),
    analyticsModeContainer: document.getElementById('analyticsModeContainer'),

    singleChartView: document.getElementById('singleChartView'),
    barContainer: document.getElementById('barContainer'),

    compareContainer: document.getElementById('compareContainer'),
    leftAlgo: document.getElementById('leftAlgo'),
    rightAlgo: document.getElementById('rightAlgo'),
    leftBarContainer: document.getElementById('leftBarContainer'),
    rightBarContainer: document.getElementById('rightBarContainer'),
    leftWinnerBadge: document.getElementById('leftWinnerBadge'),
    rightWinnerBadge: document.getElementById('rightWinnerBadge'),

    raceContainer: document.getElementById('raceContainer'),
    raceGrid: document.getElementById('raceGrid'),

    playPauseBtn: document.getElementById('btn-play-pause'),
    nextBtn: document.getElementById('btn-next'),
    prevBtn: document.getElementById('btn-prev'),
    firstBtn: document.getElementById('btn-first'),
    lastBtn: document.getElementById('btn-last'),
    speedSlider: document.getElementById('speedSlider'),
    soundToggle: document.getElementById('soundToggle'),

    currentStep: document.getElementById('currentStep'),
    totalSteps: document.getElementById('totalSteps'),
    codeBlock: document.getElementById('pseudoCode'),
    stepSummary: document.getElementById('actionDescription'),

    varI: document.getElementById('var-i'),
    varJ: document.getElementById('var-j'),
    varPivot: document.getElementById('var-pivot'),
    varComparing: document.getElementById('var-comparing'),

    shortcutsModal: document.getElementById('shortcutsModal'),
    closeShortcutsModal: document.getElementById('closeShortcutsModal'),

    benchmarkModal: document.getElementById('benchmarkModal'),
    closeBenchmarkModal: document.getElementById('closeBenchmarkModal'),
    benchmarkMeta: document.getElementById('benchmarkMeta'),
    benchmarkCustomSize: document.getElementById('benchmarkCustomSize'),
    benchmarkRunBtn: document.getElementById('benchmarkRunBtn'),
    benchmarkResultsBody: document.getElementById('benchmarkResultsBody'),

    leaderboardModal: document.getElementById('leaderboardModal'),
    closeLeaderboardModal: document.getElementById('closeLeaderboardModal'),
    globalLeaderboardBody: document.getElementById('globalLeaderboardBody'),

    tabVisual: document.getElementById('tab-visual'),
    tabAnalytics: document.getElementById('tab-analytics'),
    tabLeaderboard: document.getElementById('tab-leaderboard'),
    analyticsDashboard: document.getElementById('analytics-dashboard'),
    analyticsResults: document.getElementById('analyticsResults'),
    analyticsChart: document.getElementById('analyticsChart'),
    leaderboard: document.getElementById('leaderboard'),
    leaderboardTableBody: document.querySelector('#leaderboardTable tbody'),

    studyPanel: document.getElementById('studyPanel')
};

// Use Railway backend in production, localhost for local development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : 'https://algoarena-production-3419.up.railway.app/api';
const BENCHMARK_MIN_SIZE = 5;
const BENCHMARK_MAX_SIZE = 500000;
const MAX_CAPTURED_STEPS = 6000;
const SLIDER_GENERATE_DEBOUNCE_MS = 120;

function isFetchConnectivityError(error) {
    return error instanceof TypeError && /fetch/i.test(String(error.message || ''));
}

function toUserFacingApiError(prefix, error) {
    if (isFetchConnectivityError(error)) {
        return `${prefix}: Cannot connect to backend at ${API_BASE_URL}. Start backend using "mvn spring-boot:run".`;
    }

    const message = error?.message ? String(error.message) : 'Unexpected error.';
    return `${prefix}: ${message}`;
}

const BACKEND_ALGO_MAP = {
    bubble: 'BUBBLE_SORT',
    selection: 'SELECTION_SORT',
    insertion: 'INSERTION_SORT',
    quick: 'QUICK_SORT',
    merge: 'MERGE_SORT',
    heap: 'HEAP_SORT'
};

/* PSEUDOCODE DATA FIX */
const ALGORITHM_DATA = {
    "Bubble Sort": {
        time: "O(n²)", space: "O(1)",
        pseudo: `for i = 0 to n-1
    for j = 0 to n-i-1
        if arr[j] > arr[j+1]
            swap(arr[j], arr[j+1])`
    },
    "Selection Sort": {
        time: "O(n²)", space: "O(1)",
        pseudo: `for i = 0 to n-1
    min_idx = i
    for j = i+1 to n
        if arr[j] < arr[min_idx]
            min_idx = j
    swap(arr[i], arr[min_idx])`
    },
    "Insertion Sort": {
        time: "O(n²)", space: "O(1)",
        pseudo: `for i = 1 to n-1
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key
        arr[j+1] = arr[j]
        j = j - 1
    arr[j+1] = key`
    },
    "Merge Sort": {
        time: "O(n log n)", space: "O(n)",
        pseudo: `split arr into left and right halves
recursively sort left and right halves
i = 0, j = 0, k = 0
while left and right have elements
    place smaller element into arr[k]
copy any remaining elements`
    },
    "Quick Sort": {
        time: "O(n log n) avg", space: "O(log n)",
        pseudo: `choose a pivot element
partition arr so left < pivot and right > pivot
i = low - 1
for j = low to high - 1
    if arr[j] < pivot: swap arr[i], arr[j]
recursively sort left and right partitions`
    },
    "Heap Sort": {
        time: "O(n log n)", space: "O(1)",
        pseudo: `build a max-heap from arr
for i = n-1 down to 0
    swap root (maximum value) with arr[i]
    reduce heap size by 1
    heapify the root to restore max-heap`
    }
};

const ALGO_KEY_TO_NAME = {
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    merge: 'Merge Sort',
    quick: 'Quick Sort',
    heap: 'Heap Sort'
};

const ALGO_META = Object.fromEntries(
    Object.entries(ALGO_KEY_TO_NAME).map(([key, name]) => {
        const data = ALGORITHM_DATA[name];
        return [key, {
            label: name,
            time: data.time,
            space: data.space
        }];
    })
);

const CODE_SNIPPETS = Object.fromEntries(
    Object.entries(ALGO_KEY_TO_NAME).map(([key, name]) => [key, ALGORITHM_DATA[name].pseudo.split('\n')])
);

const RACE_ALGOS = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
const RACE_COLORS = ['#ff4444', '#a266ff', '#ffaa00', '#00ff88', '#00cfff', '#2a75ff'];
const RACE_RANK_LABELS = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

const state = {
    array: [],
    originalArray: [],
    steps: [],
    currentStep: 0,
    playing: false,
    playInterval: null,
    speed: 50,

    mode: 'single',
    theme: 'dark',
    fullscreen: false,
    soundEnabled: true,

    compare: {
        left: { algo: 'quick', steps: [], index: 0, finished: false },
        right: { algo: 'merge', steps: [], index: 0, finished: false },
        winner: null,
        tick: 0,
        startedAt: null,
        persisted: false
    },

    race: {
        selectedAlgorithms: [...RACE_ALGOS],
        entries: [],
        tick: 0,
        rankCounter: 0,
        startedAt: null,
        persisted: false
    },

    selections: {
        normalModeAlgorithm: 'bubble',
        compareModeAlgorithms: {
            left: 'quick',
            right: 'merge'
        }
    },

    analyticsChartInstance: null
};

let audioCtx = null;
let generateArrayDebounceTimer = null;

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function ensureAudioContext() {
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function playToneForValue(value, maxValue) {
    if (!state.soundEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    // Feature 6: Pitch is proportional to bar height (80ms sine wave)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const ratio = maxValue > 0 ? value / maxValue : 0;
    const freq = 180 + ratio * 920;

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.08;

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.stop(now + 0.08);
}

function intervalFromSpeed() {
    return 510 - state.speed * 5;
}

function updateAnimationSpeed() {
    const interval = intervalFromSpeed();
    // Set transition duration proportional to interval, capping at max .3s for smooth visuals 
    const duration = Math.min((interval * 0.8) / 1000, 0.35); 
    document.documentElement.style.setProperty('--animation-speed', `${duration}s`);
}

function setPlayButtonIcon() {
    if (!el.playPauseBtn) return;
    el.playPauseBtn.innerHTML = `<i class="fas fa-${state.playing ? 'pause' : 'play'}"></i>`;
}

function setStepCounter(current, total) {
    el.currentStep.textContent = String(current);
    el.totalSteps.textContent = String(Math.max(0, total));
}

function setVars(vars) {
    el.varI.textContent = vars.i ?? '-';
    el.varJ.textContent = vars.j ?? '-';
    el.varPivot.textContent = vars.key ?? '-';
    el.varComparing.textContent = vars.comparing ?? '-';
}

function updateStudyPanelUI(algorithmName) {
    const data = ALGORITHM_DATA[algorithmName];
    if (!data) return;

    // Update text elements
    document.getElementById('complexityBadge').innerHTML = `Time: ${data.time}<br>Space: ${data.space}`;

    // Format and insert pseudocode
    const pseudoElement = document.getElementById('pseudoCode');
    pseudoElement.innerText = data.pseudo;
    pseudoElement.style.whiteSpace = "pre-wrap";
    pseudoElement.style.fontFamily = "monospace";

    // Reset Live Variables
    document.getElementById('var-i').innerText = "-";
    document.getElementById('var-j').innerText = "-";
    document.getElementById('var-pivot').innerText = "-";
    document.getElementById('var-comparing').innerText = "-";
    document.getElementById('actionDescription').innerText = `Starting ${algorithmName}`;
}

function isSupportedAlgorithmKey(algo) {
    return Object.prototype.hasOwnProperty.call(ALGO_KEY_TO_NAME, algo);
}

function normalizeAlgorithmKey(algo, fallback) {
    if (isSupportedAlgorithmKey(algo)) return algo;
    return isSupportedAlgorithmKey(fallback) ? fallback : 'bubble';
}

function syncAlgorithmSelectionsFromUI() {
    state.selections.normalModeAlgorithm = normalizeAlgorithmKey(
        el.primaryAlgo?.value,
        state.selections.normalModeAlgorithm
    );

    state.selections.compareModeAlgorithms.left = normalizeAlgorithmKey(
        el.leftAlgo?.value,
        state.selections.compareModeAlgorithms.left
    );
    state.selections.compareModeAlgorithms.right = normalizeAlgorithmKey(
        el.rightAlgo?.value,
        state.selections.compareModeAlgorithms.right
    );

}

function applyAlgorithmSelectionsToUI() {
    if (el.primaryAlgo) {
        el.primaryAlgo.value = state.selections.normalModeAlgorithm;
    }
    if (el.leftAlgo) {
        el.leftAlgo.value = state.selections.compareModeAlgorithms.left;
    }
    if (el.rightAlgo) {
        el.rightAlgo.value = state.selections.compareModeAlgorithms.right;
    }

}

function updateModeSpecificControls(mode) {
    const inSingleMode = mode === 'single';
    if (el.primaryAlgoGroup) {
        el.primaryAlgoGroup.classList.toggle('hidden', !inSingleMode);
    }
}

function setTheme(theme) {
    state.theme = theme; /* PIVOT COMPARING FIX + LIGHT MODE */
    document.body.classList.remove('dark-theme', 'light-theme', 'light-mode'); /* PIVOT COMPARING FIX + LIGHT MODE */
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme'); /* PIVOT COMPARING FIX + LIGHT MODE */
    document.body.classList.toggle('light-mode', theme === 'light'); /* PIVOT COMPARING FIX + LIGHT MODE */
    document.documentElement.classList.toggle('light', theme === 'light'); /* PIVOT COMPARING FIX + LIGHT MODE */
    localStorage.setItem('algoArenaTheme', theme); /* PIVOT COMPARING FIX + LIGHT MODE */
    localStorage.setItem('theme', theme); /* PIVOT COMPARING FIX + LIGHT MODE */

    // Feature 2: Theme toggle icon changes between moon and sun
    el.themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
    rerenderActiveMode();
}

function handleAlgorithmSwitch() { // ALGO CHANGE - RESHUFFLE FIX
    state.selections.normalModeAlgorithm = normalizeAlgorithmKey(
        el.primaryAlgo?.value,
        state.selections.normalModeAlgorithm
    );

    pausePlayback(); // ALGO CHANGE - RESHUFFLE FIX
    const algorithmName = ALGO_KEY_TO_NAME[state.selections.normalModeAlgorithm] || 'Bubble Sort';
    updateStudyPanelUI(algorithmName); // ALGO CHANGE - RESHUFFLE FIX

    if (state.mode !== 'single') { // ALGO CHANGE - RESHUFFLE FIX
        return; // ALGO CHANGE - RESHUFFLE FIX
    }

    generateArray(); // ALGO CHANGE - RESHUFFLE FIX
    state.currentStep = 0; // ALGO CHANGE - RESHUFFLE FIX
    clearStepDetails(); // ALGO CHANGE - RESHUFFLE FIX
    renderSingleStep(0); // ALGO CHANGE - RESHUFFLE FIX
}

function setMode(mode) {
    pausePlayback();
    state.mode = mode;
    updateModeSpecificControls(mode);

    const isVisual = mode !== 'analytics';
    if (isVisual) {
        el.visualModeContainer.style.removeProperty('display');
        el.analyticsModeContainer.style.setProperty('display', 'none', 'important');
    } else {
        el.visualModeContainer.style.setProperty('display', 'none', 'important');
        el.analyticsModeContainer.style.removeProperty('display');
    }
    
    if (mode === 'analytics' || mode === 'compare' || mode === 'race') {
        el.studyPanel.style.setProperty('display', 'none', 'important');
    } else {
        el.studyPanel.style.removeProperty('display');
    }

    el.compareModeBtn.classList.toggle('active', mode === 'compare');
    el.raceModeBtn.classList.toggle('active', mode === 'race');

    el.singleChartView.hidden = mode !== 'single';
    el.compareContainer.hidden = mode !== 'compare';
    el.raceContainer.hidden = mode !== 'race';

    if (mode === 'single') {
        visualizeSort();
    }
    if (mode === 'compare') {
        prepareCompareMode();
    }
    if (mode === 'race') {
        prepareRaceMode();
    }
}

function updateSliderLabels() {
    el.arraySizeValue.textContent = el.arraySize.value;
    el.maxValueValue.textContent = el.maxValue.value;
}

function generateArray() {
    const size = parseInt(el.arraySize.value, 10);
    const max = parseInt(el.maxValue.value, 10);
    const condition = el.initialCondition.value;

    let arr = [];
    if (condition === 'random') {
        arr = Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
    } else if (condition === 'nearly') {
        arr = Array.from({ length: size }, (_, i) => i + 1);
        const swaps = Math.max(1, Math.floor(size * 0.1));
        for (let i = 0; i < swaps; i += 1) {
            const a = Math.floor(Math.random() * size);
            const b = Math.floor(Math.random() * size);
            [arr[a], arr[b]] = [arr[b], arr[a]];
        }
    } else if (condition === 'reversed') {
        arr = Array.from({ length: size }, (_, i) => size - i);
    } else {
        const unique = Math.max(2, Math.floor(size / 8));
        arr = Array.from({ length: size }, () => Math.floor(Math.random() * unique) + 1);
    }

    state.array = arr;
    state.originalArray = [...arr];

    if (state.mode === 'single') {
        visualizeSort();
    } else if (state.mode === 'compare') {
        prepareCompareMode();
    } else if (state.mode === 'race') {
        prepareRaceMode();
    }
}

function refreshArrayForCurrentControls() {
    generateArray();
    updateBarLabels(el.barContainer, state.originalArray.length);
    updateBarLabels(el.leftBarContainer, state.originalArray.length);
    updateBarLabels(el.rightBarContainer, state.originalArray.length);
}

function scheduleArrayRegeneration() {
    if (generateArrayDebounceTimer) {
        clearTimeout(generateArrayDebounceTimer);
    }
    generateArrayDebounceTimer = window.setTimeout(() => {
        generateArrayDebounceTimer = null;
        refreshArrayForCurrentControls();
    }, SLIDER_GENERATE_DEBOUNCE_MS);
}

function clearStepDetails() {
    setVars({ i: '-', j: '-', key: '-', comparing: '-' });
    el.stepSummary.textContent = '';
}

function pushStep(steps, arr, options = {}) {
    const forceCapture = options.forceCapture === true;
    const sortedIndices = options.sortedIndices || [];
    const isFinalSortedFrame = sortedIndices.length === arr.length && arr.length > 0;

    if (steps.__sourceCount == null) {
        steps.__sourceCount = 0;
    }
    steps.__sourceCount += 1;

    const stride = arr.length <= 200 ? 1 : arr.length <= 500 ? 2 : arr.length <= 800 ? 3 : 4;
    const shouldSampleOut = !forceCapture && !isFinalSortedFrame && steps.length > 0 && (steps.__sourceCount % stride !== 0);
    if (shouldSampleOut) return;

    if (!forceCapture && !isFinalSortedFrame && steps.length >= MAX_CAPTURED_STEPS) {
        return;
    }

    steps.push({
        arr: [...arr],
        compareIndices: options.compareIndices || [],
        swapIndices: options.swapIndices || [],
        sortedIndices,
        vars: options.vars || { i: '-', j: '-', key: '-', comparing: '-' },
        summary: options.summary || '',
        codeLines: options.codeLines || CODE_SNIPPETS.bubble,
        codeLine: options.codeLine ?? 0
    });
}

function allIndices(n) {
    return Array.from({ length: n }, (_, i) => i);
}

function buildBubbleSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Bubble Sort',
        codeLines: CODE_SNIPPETS.bubble,
        codeLine: 0
    });

    for (let i = 0; i < n - 1; i += 1) {
        for (let j = 0; j < n - i - 1; j += 1) {
            pushStep(steps, arr, {
                compareIndices: [j, j + 1],
                vars: { i, j, key: '-', comparing: `${arr[j]} vs ${arr[j + 1]}` },
                summary: `Comparing index ${j} and ${j + 1}`,
                codeLines: CODE_SNIPPETS.bubble,
                codeLine: 2
            });
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                pushStep(steps, arr, {
                    swapIndices: [j, j + 1],
                    vars: { i, j, key: '-', comparing: 'swap' },
                    summary: `Swapped ${arr[j + 1]} and ${arr[j]}`,
                    codeLines: CODE_SNIPPETS.bubble,
                    codeLine: 3
                });
            }
        }
        const sortedTail = [];
        for (let k = n - i - 1; k < n; k += 1) sortedTail.push(k);
        pushStep(steps, arr, {
            sortedIndices: sortedTail,
            vars: { i, j: '-', key: '-', comparing: '-' },
            summary: 'Largest value placed at correct position',
            codeLines: CODE_SNIPPETS.bubble,
            codeLine: 0
        });
    }

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.bubble,
        codeLine: 0
    });

    return steps;
}

function buildSelectionSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Selection Sort',
        codeLines: CODE_SNIPPETS.selection,
        codeLine: 0
    });

    for (let i = 0; i < n - 1; i += 1) {
        let min = i;
        for (let j = i + 1; j < n; j += 1) {
            pushStep(steps, arr, {
                compareIndices: [j, min],
                vars: { i, j, key: min, comparing: `${arr[j]} < ${arr[min]} ?` },
                summary: `Searching minimum for position ${i}`,
                codeLines: CODE_SNIPPETS.selection,
                codeLine: 2
            });
            if (arr[j] < arr[min]) {
                min = j;
                pushStep(steps, arr, {
                    compareIndices: [min],
                    vars: { i, j, key: min, comparing: `new min at ${min}` },
                    summary: `New minimum found at index ${min}`,
                    codeLines: CODE_SNIPPETS.selection,
                    codeLine: 3
                });
            }
        }
        if (min !== i) {
            [arr[i], arr[min]] = [arr[min], arr[i]];
            pushStep(steps, arr, {
                swapIndices: [i, min],
                vars: { i, j: '-', key: min, comparing: 'swap' },
                summary: `Placed minimum at index ${i}`,
                codeLines: CODE_SNIPPETS.selection,
                codeLine: 4
            });
        }
        pushStep(steps, arr, {
            sortedIndices: allIndices(i + 1),
            vars: { i, j: '-', key: '-', comparing: '-' },
            summary: `Index ${i} locked as sorted`,
            codeLines: CODE_SNIPPETS.selection,
            codeLine: 0
        });
    }

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.selection,
        codeLine: 0
    });
    return steps;
}

function buildInsertionSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Insertion Sort',
        codeLines: CODE_SNIPPETS.insertion,
        codeLine: 0
    });

    for (let i = 1; i < n; i += 1) {
        const key = arr[i];
        let j = i - 1;

        pushStep(steps, arr, {
            compareIndices: [i],
            vars: { i, j, key, comparing: `insert ${key}` },
            summary: `Insert ${key} into sorted left side`,
            codeLines: CODE_SNIPPETS.insertion,
            codeLine: 1
        });

        while (j >= 0 && arr[j] > key) {
            pushStep(steps, arr, {
                compareIndices: [j, j + 1],
                vars: { i, j, key, comparing: `${arr[j]} > ${key}` },
                summary: `Shift ${arr[j]} right`,
                codeLines: CODE_SNIPPETS.insertion,
                codeLine: 2
            });
            arr[j + 1] = arr[j];
            pushStep(steps, arr, {
                swapIndices: [j, j + 1],
                vars: { i, j, key, comparing: 'shift' },
                summary: 'Element shifted',
                codeLines: CODE_SNIPPETS.insertion,
                codeLine: 2
            });
            j -= 1;
        }

        arr[j + 1] = key;
        pushStep(steps, arr, {
            swapIndices: [j + 1],
            sortedIndices: allIndices(i + 1),
            vars: { i, j, key, comparing: `placed at ${j + 1}` },
            summary: `Inserted ${key}`,
            codeLines: CODE_SNIPPETS.insertion,
            codeLine: 3
        });
    }

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.insertion,
        codeLine: 0
    });
    return steps;
}

function buildMergeSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Merge Sort',
        codeLines: CODE_SNIPPETS.merge,
        codeLine: 0
    });

    function mergeSort(left, right) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);
        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
    }

    function merge(left, mid, right) {
        const L = arr.slice(left, mid + 1);
        const R = arr.slice(mid + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < L.length && j < R.length) {
            pushStep(steps, arr, {
                compareIndices: [left + i, mid + 1 + j],
                vars: { i: k, j: mid + 1 + j, key: '-', comparing: `${L[i]} <= ${R[j]}` },
                summary: 'Compare values from both halves',
                codeLines: CODE_SNIPPETS.merge,
                codeLine: 3
            });

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i += 1;
            } else {
                arr[k] = R[j];
                j += 1;
            }

            pushStep(steps, arr, {
                swapIndices: [k],
                vars: { i: k, j: '-', key: arr[k], comparing: 'merge write' },
                summary: `Write ${arr[k]} at index ${k}`,
                codeLines: CODE_SNIPPETS.merge,
                codeLine: 3
            });
            k += 1;
        }

        while (i < L.length) {
            arr[k] = L[i];
            pushStep(steps, arr, {
                swapIndices: [k],
                vars: { i: k, j: '-', key: arr[k], comparing: 'left remainder' },
                summary: 'Copy left remainder',
                codeLines: CODE_SNIPPETS.merge,
                codeLine: 3
            });
            i += 1;
            k += 1;
        }

        while (j < R.length) {
            arr[k] = R[j];
            pushStep(steps, arr, {
                swapIndices: [k],
                vars: { i: k, j: '-', key: arr[k], comparing: 'right remainder' },
                summary: 'Copy right remainder',
                codeLines: CODE_SNIPPETS.merge,
                codeLine: 3
            });
            j += 1;
            k += 1;
        }
    }

    mergeSort(0, n - 1);

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.merge,
        codeLine: 0
    });
    return steps;
}

function buildQuickSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Quick Sort',
        codeLines: CODE_SNIPPETS.quick,
        codeLine: 0
    });

    function quickSort(low, high) {
        if (low < high) {
            const pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    function partition(low, high) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j += 1) {
            pushStep(steps, arr, {
                compareIndices: [j, high],
                vars: { i, j, key: pivot, comparing: `${arr[j]} < ${pivot}` },
                summary: `Compare index ${j} with pivot`,
                codeLines: CODE_SNIPPETS.quick,
                codeLine: 1
            });

            if (arr[j] < pivot) {
                i += 1;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                pushStep(steps, arr, {
                    swapIndices: [i, j],
                    vars: { i, j, key: pivot, comparing: 'swap for partition' },
                    summary: `Swap to grow lower partition`,
                    codeLines: CODE_SNIPPETS.quick,
                    codeLine: 1
                });
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        pushStep(steps, arr, {
            swapIndices: [i + 1, high],
            vars: { i: i + 1, j: high, key: pivot, comparing: 'pivot swap' },
            summary: `Pivot fixed at index ${i + 1}`,
            codeLines: CODE_SNIPPETS.quick,
            codeLine: 1
        });

        return i + 1;
    }

    quickSort(0, n - 1);

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.quick,
        codeLine: 0
    });
    return steps;
}

function buildHeapSteps(source) {
    const arr = [...source];
    const steps = [];
    const n = arr.length;

    pushStep(steps, arr, {
        summary: 'Starting Heap Sort',
        codeLines: CODE_SNIPPETS.heap,
        codeLine: 0
    });

    function heapify(heapSize, i) {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        if (l < heapSize) {
            pushStep(steps, arr, {
                compareIndices: [l, largest],
                vars: { i, j: l, key: arr[largest], comparing: `${arr[l]} > ${arr[largest]}` },
                summary: 'Compare left child',
                codeLines: CODE_SNIPPETS.heap,
                codeLine: 0
            });
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < heapSize) {
            pushStep(steps, arr, {
                compareIndices: [r, largest],
                vars: { i, j: r, key: arr[largest], comparing: `${arr[r]} > ${arr[largest]}` },
                summary: 'Compare right child',
                codeLines: CODE_SNIPPETS.heap,
                codeLine: 0
            });
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            pushStep(steps, arr, {
                swapIndices: [i, largest],
                vars: { i, j: largest, key: arr[largest], comparing: 'heap swap' },
                summary: 'Swap root with larger child',
                codeLines: CODE_SNIPPETS.heap,
                codeLine: 1
            });
            heapify(heapSize, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
        heapify(n, i);
    }

    for (let i = n - 1; i > 0; i -= 1) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        pushStep(steps, arr, {
            swapIndices: [0, i],
            sortedIndices: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
            vars: { i: 0, j: i, key: arr[i], comparing: 'extract max' },
            summary: `Move max to index ${i}`,
            codeLines: CODE_SNIPPETS.heap,
            codeLine: 1
        });
        heapify(i, 0);
    }

    pushStep(steps, arr, {
        sortedIndices: allIndices(n),
        summary: 'Array sorted',
        codeLines: CODE_SNIPPETS.heap,
        codeLine: 0
    });
    return steps;
}

const STEP_BUILDERS = {
    bubble: buildBubbleSteps,
    selection: buildSelectionSteps,
    insertion: buildInsertionSteps,
    merge: buildMergeSteps,
    quick: buildQuickSteps,
    heap: buildHeapSteps
};

function buildSteps(algo, source) {
    const builder = STEP_BUILDERS[algo] || buildBubbleSteps;
    return builder(source);
}

function ensureBars(container, count) {
    const bars = container.querySelectorAll('.bar');
    if (bars.length === count) return bars;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
        const bar = document.createElement('div');
        bar.className = 'bar';

        const valueLabel = document.createElement('span');
        valueLabel.className = 'bar-value';
        bar.appendChild(valueLabel);

        fragment.appendChild(bar);
    }
    container.appendChild(fragment);
    return container.querySelectorAll('.bar');
}

function updateBarLabels(container, barCount) { // SIZE LABEL FIX
    if (!container || !barCount) return; // SIZE LABEL FIX
    const containerWidth = container.clientWidth; // SIZE LABEL FIX
    const barWidth = containerWidth / barCount; // SIZE LABEL FIX

    let fontSize; // SIZE LABEL FIX
    if (barWidth < 20) { // SIZE LABEL FIX
        fontSize = 0; // SIZE LABEL FIX
    } else if (barWidth < 35) { // SIZE LABEL FIX
        fontSize = 8; // SIZE LABEL FIX
    } else if (barWidth < 50) { // SIZE LABEL FIX
        fontSize = 10; // SIZE LABEL FIX
    } else if (barWidth < 80) { // SIZE LABEL FIX
        fontSize = 12; // SIZE LABEL FIX
    } else { // SIZE LABEL FIX
        fontSize = 14; // SIZE LABEL FIX
    }

    const labels = container.querySelectorAll('.bar-value'); // SIZE LABEL FIX
    labels.forEach((label) => { // SIZE LABEL FIX
        label.style.position = 'absolute'; // SIZE LABEL FIX
        label.style.top = '-20px'; // SIZE LABEL FIX
        label.style.left = '0'; // SIZE LABEL FIX
        label.style.transform = 'translateX(0)'; // SIZE LABEL FIX
        label.style.width = `${barWidth}px`; // SIZE LABEL FIX
        label.style.textAlign = 'center'; // SIZE LABEL FIX
        label.style.whiteSpace = 'nowrap'; // SIZE LABEL FIX
        label.style.overflow = 'hidden'; // SIZE LABEL FIX
        label.style.textOverflow = 'ellipsis'; // SIZE LABEL FIX
        label.style.fontSize = `${fontSize}px`; // SIZE LABEL FIX
        label.style.display = fontSize === 0 ? 'none' : 'block'; // SIZE LABEL FIX
    });
}

function renderBars(container, arr, step, options = {}) {
    if (!container) return;
    if (!arr || arr.length === 0) {
        container.innerHTML = '';
        return;
    }

    if (options.baseColor) {
        container.style.setProperty('--panel-bar-color', options.baseColor);
    } else {
        container.style.removeProperty('--panel-bar-color');
    }

    const bars = ensureBars(container, arr.length);
    const maxValue = Math.max(...arr, 1);

    const compareSet = new Set(step?.compareIndices || []);
    const swapSet = new Set(step?.swapIndices || []);
    const sortedSet = new Set(step?.sortedIndices || []);

    arr.forEach((value, i) => {
        const bar = bars[i];
        const height = Math.max(2, (value / maxValue) * 100);
        bar.style.height = `${height}%`;
        bar.style.flex = '1 1 0%'; // SIZE LABEL FIX
        bar.style.maxWidth = `${100 / arr.length}%`; // SIZE LABEL FIX

        bar.classList.remove('compare', 'swap', 'sorted');
        if (compareSet.has(i)) bar.classList.add('compare');
        if (swapSet.has(i)) bar.classList.add('swap');
        if (sortedSet.has(i)) bar.classList.add('sorted');

        const valueLabel = bar.querySelector('.bar-value');
        valueLabel.textContent = String(value);
    });

    updateBarLabels(container, arr.length); // SIZE LABEL FIX

    if (options.playSound !== false && (step?.compareIndices || []).length > 0) {
        const idx = step.compareIndices[0];
        if (arr[idx] !== undefined) {
            playToneForValue(arr[idx], maxValue);
        }
    }
}

function renderSingleStep(index) {
    if (!state.steps.length) return;
    const safeIndex = Math.max(0, Math.min(index, state.steps.length - 1));
    state.currentStep = safeIndex;

    const step = state.steps[safeIndex];
    renderBars(el.barContainer, step.arr, step);
    setVars(step.vars || {});
    el.stepSummary.textContent = step.summary || '';
    setStepCounter(safeIndex, state.steps.length - 1);
}

function visualizeSort() {
    const algo = normalizeAlgorithmKey(state.selections.normalModeAlgorithm, 'bubble');
    state.selections.normalModeAlgorithm = algo;
    if (el.primaryAlgo && el.primaryAlgo.value !== algo) {
        el.primaryAlgo.value = algo;
    }

    const source = [...state.originalArray];

    state.steps = buildSteps(algo, source);
    state.currentStep = 0;

    renderSingleStep(0);
}

function prepareCompareMode() {
    // Feature 5: Side-by-side algorithm comparison mode
    const leftAlgo = normalizeAlgorithmKey(state.selections.compareModeAlgorithms.left, 'quick');
    const rightAlgo = normalizeAlgorithmKey(state.selections.compareModeAlgorithms.right, 'merge');
    state.selections.compareModeAlgorithms.left = leftAlgo;
    state.selections.compareModeAlgorithms.right = rightAlgo;

    if (el.leftAlgo && el.leftAlgo.value !== leftAlgo) {
        el.leftAlgo.value = leftAlgo;
    }
    if (el.rightAlgo && el.rightAlgo.value !== rightAlgo) {
        el.rightAlgo.value = rightAlgo;
    }

    state.compare.left.algo = leftAlgo;
    state.compare.right.algo = rightAlgo;

    state.compare.left.steps = buildSteps(state.compare.left.algo, [...state.originalArray]);
    state.compare.right.steps = buildSteps(state.compare.right.algo, [...state.originalArray]);

    state.compare.left.index = 0;
    state.compare.right.index = 0;
    state.compare.left.finished = false;
    state.compare.right.finished = false;
    state.compare.left.finishTimeMs = null;
    state.compare.right.finishTimeMs = null;
    state.compare.winner = null;
    state.compare.tick = 0;
    state.compare.startedAt = null;
    state.compare.persisted = false;

    el.leftWinnerBadge.classList.add('hidden');
    el.rightWinnerBadge.classList.add('hidden');

    renderBars(el.leftBarContainer, state.compare.left.steps[0]?.arr || state.originalArray, state.compare.left.steps[0] || {}, { baseColor: 'var(--compare-left-color)' });
    renderBars(el.rightBarContainer, state.compare.right.steps[0]?.arr || state.originalArray, state.compare.right.steps[0] || {}, { baseColor: 'var(--bar-alt-color)' });

    el.stepSummary.textContent = 'Compare Mode: Press Play to run both algorithms on the same array.';
    setVars({ i: '-', j: '-', key: '-', comparing: 'Compare Mode Active' });

    const total = Math.max(state.compare.left.steps.length, state.compare.right.steps.length) - 1;
    setStepCounter(0, total);
}

function advanceCompareTick() {
    if (!state.compare.startedAt) {
        state.compare.startedAt = performance.now();
    }

    let progressed = false;

    const left = state.compare.left;
    const right = state.compare.right;

    const leftPrev = left.index;
    const rightPrev = right.index;

    if (!left.finished) {
        if (left.index < left.steps.length - 1) {
            left.index += 1;
            progressed = true;
        } else {
            left.finished = true;
        }
    }

    if (!right.finished) {
        if (right.index < right.steps.length - 1) {
            right.index += 1;
            progressed = true;
        } else {
            right.finished = true;
        }
    }

    const leftStep = left.steps[left.index] || left.steps[left.steps.length - 1] || {};
    const rightStep = right.steps[right.index] || right.steps[right.steps.length - 1] || {};

    renderBars(el.leftBarContainer, leftStep.arr || state.originalArray, leftStep, { baseColor: 'var(--compare-left-color)' });
    renderBars(el.rightBarContainer, rightStep.arr || state.originalArray, rightStep, { baseColor: 'var(--bar-alt-color)' });

    const leftJustFinished = leftPrev < left.steps.length - 1 && left.index >= left.steps.length - 1;
    const rightJustFinished = rightPrev < right.steps.length - 1 && right.index >= right.steps.length - 1;

    if (leftJustFinished && left.finishTimeMs == null) {
        left.finishTimeMs = Math.max(1, Math.round(performance.now() - state.compare.startedAt));
    }
    if (rightJustFinished && right.finishTimeMs == null) {
        right.finishTimeMs = Math.max(1, Math.round(performance.now() - state.compare.startedAt));
    }

    if (!state.compare.winner) {

        if (leftJustFinished && !rightJustFinished) state.compare.winner = 'left';
        if (rightJustFinished && !leftJustFinished) state.compare.winner = 'right';
        if (leftJustFinished && rightJustFinished) state.compare.winner = 'left';

        if (state.compare.winner === 'left') {
            el.leftWinnerBadge.classList.remove('hidden');
        }
        if (state.compare.winner === 'right') {
            el.rightWinnerBadge.classList.remove('hidden');
        }
    }

    state.compare.tick += 1;
    const total = Math.max(left.steps.length, right.steps.length) - 1;
    setStepCounter(state.compare.tick, total);

    return left.finished && right.finished;
}

function stepBackCompare() {
    const left = state.compare.left;
    const right = state.compare.right;

    if (left.index === 0 && right.index === 0) return;

    left.index = Math.max(0, left.index - 1);
    right.index = Math.max(0, right.index - 1);
    left.finished = false;
    right.finished = false;
    state.compare.tick = Math.max(0, state.compare.tick - 1);

    state.compare.winner = null;
    el.leftWinnerBadge.classList.add('hidden');
    el.rightWinnerBadge.classList.add('hidden');

    renderBars(el.leftBarContainer, left.steps[left.index].arr, left.steps[left.index], { baseColor: 'var(--compare-left-color)' });
    renderBars(el.rightBarContainer, right.steps[right.index].arr, right.steps[right.index], { baseColor: 'var(--bar-alt-color)' });

    const total = Math.max(left.steps.length, right.steps.length) - 1;
    setStepCounter(state.compare.tick, total);
}

function buildRacePanels(algorithms) {
    el.raceGrid.innerHTML = '';
    const entries = [];

    algorithms.forEach((algo) => {
        const panel = document.createElement('div');
        panel.className = 'race-panel';

        const header = document.createElement('div');
        header.className = 'race-header';

        const title = document.createElement('span');
        title.className = 'race-title';
        title.textContent = ALGO_META[algo]?.label || algo;

        const badge = document.createElement('span');
        badge.className = 'rank-badge hidden';
        badge.textContent = '';

        header.appendChild(title);
        header.appendChild(badge);

        const bars = document.createElement('div');
        bars.className = 'bar-container';

        panel.appendChild(header);
        panel.appendChild(bars);
        el.raceGrid.appendChild(panel);

        entries.push({
            algo,
            steps: [],
            index: 0,
            finished: false,
            rank: 0,
            panel,
            badge,
            bars
        });
    });

    state.race.entries = entries;
}

function prepareRaceMode() {
    // Feature 9: Race mode running multiple algorithms in parallel mini-panels
    state.race.selectedAlgorithms = [...RACE_ALGOS];
    buildRacePanels(state.race.selectedAlgorithms);

    state.race.tick = 0;
    state.race.rankCounter = 0;
    state.race.startedAt = null;
    state.race.persisted = false;

    state.race.entries.forEach((entry, idx) => {
        entry.steps = buildSteps(entry.algo, [...state.originalArray]);
        entry.index = 0;
        entry.finished = false;
        entry.rank = 0;
        entry.finishTimeMs = null;
        entry.badge.classList.add('hidden');

        renderBars(entry.bars, entry.steps[0]?.arr || state.originalArray, entry.steps[0] || {}, {
            baseColor: RACE_COLORS[idx % RACE_COLORS.length]
        });
    });

    el.stepSummary.textContent = 'Race Mode: Press Play to run all algorithms together.';
    setVars({ i: '-', j: '-', key: '-', comparing: 'Race Mode Active' });

    const total = Math.max(...state.race.entries.map((entry) => entry.steps.length)) - 1;
    setStepCounter(0, total);
}

function assignRaceBadge(entry) {
    if (entry.rank <= 0) return;
    if (entry.rank <= 3) {
        entry.badge.textContent = RACE_RANK_LABELS[entry.rank - 1];
    } else {
        entry.badge.textContent = `#${entry.rank}`;
    }
    entry.badge.classList.remove('hidden');
}

function advanceRaceTick() {
    if (!state.race.startedAt) {
        state.race.startedAt = performance.now();
    }

    let anyProgress = false;

    state.race.entries.forEach((entry, idx) => {
        if (entry.finished) return;

        if (entry.index < entry.steps.length - 1) {
            entry.index += 1;
            anyProgress = true;
        } else {
            entry.finished = true;
            state.race.rankCounter += 1;
            entry.rank = state.race.rankCounter;
            entry.finishTimeMs = Math.max(1, Math.round(performance.now() - state.race.startedAt));
            assignRaceBadge(entry);
        }

        const step = entry.steps[entry.index] || entry.steps[entry.steps.length - 1] || {};
        renderBars(entry.bars, step.arr || state.originalArray, step, {
            baseColor: RACE_COLORS[idx % RACE_COLORS.length]
        });
    });

    state.race.tick += 1;
    const total = Math.max(...state.race.entries.map((entry) => entry.steps.length)) - 1;
    setStepCounter(state.race.tick, total);

    const allFinished = state.race.entries.every((entry) => entry.finished);
    return allFinished || !anyProgress;
}

function stepBackRace() {
    const canStepBack = state.race.entries.some((entry) => entry.index > 0);
    if (!canStepBack) return;

    state.race.rankCounter = 0;
    state.race.tick = Math.max(0, state.race.tick - 1);

    state.race.entries.forEach((entry, idx) => {
        entry.index = Math.max(0, entry.index - 1);
        entry.finished = false;
        entry.rank = 0;
        entry.badge.classList.add('hidden');

        const step = entry.steps[entry.index] || entry.steps[0] || {};
        renderBars(entry.bars, step.arr || state.originalArray, step, {
            baseColor: RACE_COLORS[idx % RACE_COLORS.length]
        });
    });

    const total = Math.max(...state.race.entries.map((entry) => entry.steps.length)) - 1;
    setStepCounter(state.race.tick, total);
}

function playSingle() {
    if (!state.steps.length) visualizeSort();
    if (!state.steps.length) return;

    state.playing = true;
    setPlayButtonIcon();
    state.playInterval = setInterval(() => {
        if (state.currentStep < state.steps.length - 1) {
            renderSingleStep(state.currentStep + 1);
        } else {
            pausePlayback();
        }
    }, intervalFromSpeed());
}

function playCompare() {
    if (!state.compare.startedAt) {
        state.compare.startedAt = performance.now();
    }

    state.playing = true;
    setPlayButtonIcon();
    state.playInterval = setInterval(() => {
        const done = advanceCompareTick();
        if (done) {
            pausePlayback();
            persistCompareRaceResult();
        }
    }, intervalFromSpeed());
}

function playRace() {
    if (!state.race.startedAt) {
        state.race.startedAt = performance.now();
    }

    state.playing = true;
    setPlayButtonIcon();
    state.playInterval = setInterval(() => {
        const done = advanceRaceTick();
        if (done) {
            pausePlayback();
            persistRaceModeResult();
        }
    }, intervalFromSpeed());
}

function play() {
    if (state.playing) return;

    if (state.mode === 'single') {
        playSingle();
    } else if (state.mode === 'compare') {
        playCompare();
    } else if (state.mode === 'race') {
        playRace();
    }
}

function pausePlayback() {
    state.playing = false;
    if (state.playInterval) clearInterval(state.playInterval);
    state.playInterval = null;
    setPlayButtonIcon();
}

function restartPlaybackIfNeeded() {
    if (state.playing) {
        pausePlayback();
        play();
    }
}

function stepForward() {
    if (state.mode === 'single') {
        if (!state.steps.length) visualizeSort();
        if (state.currentStep < state.steps.length - 1) {
            renderSingleStep(state.currentStep + 1);
        }
        return;
    }

    if (state.mode === 'compare') {
        const done = advanceCompareTick();
        if (done) {
            pausePlayback();
            persistCompareRaceResult();
        }
        return;
    }

    if (state.mode === 'race') {
        const done = advanceRaceTick();
        if (done) {
            pausePlayback();
            persistRaceModeResult();
        }
    }
}

function stepBackward() {
    if (state.mode === 'single') {
        if (state.currentStep > 0) renderSingleStep(state.currentStep - 1);
        return;
    }

    if (state.mode === 'compare') {
        stepBackCompare();
        return;
    }

    if (state.mode === 'race') {
        stepBackRace();
    }
}

function goToStart() {
    pausePlayback();

    if (state.mode === 'single') {
        renderSingleStep(0);
    } else if (state.mode === 'compare') {
        prepareCompareMode();
    } else if (state.mode === 'race') {
        prepareRaceMode();
    }
}

function goToEnd() {
    pausePlayback();

    if (state.mode === 'single') {
        renderSingleStep(state.steps.length - 1);
        return;
    }

    if (state.mode === 'compare') {
        while (!advanceCompareTick()) {
            // progress until complete
        }
        persistCompareRaceResult();
        return;
    }

    if (state.mode === 'race') {
        while (!advanceRaceTick()) {
            // progress until complete
        }
        persistRaceModeResult();
    }
}

function rerenderActiveMode() {
    if (state.mode === 'single') {
        renderSingleStep(state.currentStep);
    } else if (state.mode === 'compare') {
        const leftStep = state.compare.left.steps[state.compare.left.index] || state.compare.left.steps[0] || {};
        const rightStep = state.compare.right.steps[state.compare.right.index] || state.compare.right.steps[0] || {};
        renderBars(el.leftBarContainer, leftStep.arr || state.originalArray, leftStep, { baseColor: 'var(--compare-left-color)' });
        renderBars(el.rightBarContainer, rightStep.arr || state.originalArray, rightStep, { baseColor: 'var(--bar-alt-color)' });
    } else if (state.mode === 'race') {
        state.race.entries.forEach((entry, idx) => {
            const step = entry.steps[entry.index] || entry.steps[0] || {};
            renderBars(entry.bars, step.arr || state.originalArray, step, { baseColor: RACE_COLORS[idx % RACE_COLORS.length] });
        });
    }
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    el.soundToggle.classList.toggle('muted', !state.soundEnabled);
    el.soundToggle.innerHTML = `<i class="fas fa-${state.soundEnabled ? 'volume-up' : 'volume-mute'}"></i>`;
}

function normalizeAlgoForBackend(algo) {
    if (!algo) return 'UNKNOWN';
    const normalized = String(algo).trim().toLowerCase();
    if (BACKEND_ALGO_MAP[normalized]) return BACKEND_ALGO_MAP[normalized];

    return String(algo)
        .trim()
        .toUpperCase()
        .replace(/[-\s]+/g, '_');
}

function mapInitialConditionToBackend(condition) {
    switch (String(condition || '').toLowerCase()) {
        case 'random':
            return 'RANDOM';
        case 'nearly':
            return 'NEARLY_SORTED';
        case 'reversed':
            return 'REVERSED';
        default:
            return 'RANDOM';
    }
}

function getBenchmarkSize() {
    const sliderSize = parseInt(el.arraySize.value, 10);
    const fallbackSize = Number.isFinite(sliderSize) ? sliderSize : 50;

    if (!el.benchmarkCustomSize) return fallbackSize;

    const customRaw = String(el.benchmarkCustomSize.value || '').trim();
    if (!customRaw) return fallbackSize;

    const customSize = Number(customRaw);
    if (!Number.isInteger(customSize)) {
        throw new Error('Custom benchmark size must be a whole number.');
    }
    if (customSize < BENCHMARK_MIN_SIZE || customSize > BENCHMARK_MAX_SIZE) {
        throw new Error(`Custom benchmark size must be between ${BENCHMARK_MIN_SIZE} and ${BENCHMARK_MAX_SIZE.toLocaleString()}.`);
    }

    return customSize;
}

function getSelectedBenchmarkAlgorithms() {
    const selected = new Set();

    const addAlgo = (algoKey) => {
        const mapped = normalizeAlgoForBackend(algoKey);
        // Only add if it's a known backend algorithm
        if (mapped && mapped !== 'UNKNOWN' && Object.values(BACKEND_ALGO_MAP).includes(mapped)) {
            selected.add(mapped);
        }
    };

    if (state.mode === 'compare') {
        addAlgo(state.selections.compareModeAlgorithms.left);
        addAlgo(state.selections.compareModeAlgorithms.right);
    } else if (state.mode === 'race') {
        RACE_ALGOS.forEach(addAlgo);
    } else {
        addAlgo(state.selections.normalModeAlgorithm);
    }
    return [...selected];
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
}

function resetBenchmarkModalState() {
    if (el.benchmarkResultsBody) {
        el.benchmarkResultsBody.innerHTML = '';
    }
    if (el.benchmarkCustomSize) {
        el.benchmarkCustomSize.value = '';
    }
    if (el.benchmarkMeta) {
        el.benchmarkMeta.textContent = 'Array Size: -';
    }
    document.querySelector('.benchmark-running-indicator')?.remove();
}

function showBenchmarkModal() {
    resetBenchmarkModalState();
    openModal(el.benchmarkModal);
}

function closeBenchmarkModal() {
    resetBenchmarkModalState();
    if (el.deepBenchmarkBtn) {
        el.deepBenchmarkBtn.disabled = false;
        el.deepBenchmarkBtn.textContent = '🚀 Deep Benchmark';
    }
    if (el.benchmarkRunBtn) {
        el.benchmarkRunBtn.disabled = false;
        el.benchmarkRunBtn.textContent = 'Run Benchmark';
    }
    closeModal(el.benchmarkModal);
}

async function runBenchmark() {
    let size;
    try {
        size = getBenchmarkSize();
    } catch (error) {
        alert(error.message);
        return;
    }

    const maxValue = parseInt(el.maxValue.value, 10);
    const initialCondition = mapInitialConditionToBackend(el.initialCondition.value);
    const algorithms = getSelectedBenchmarkAlgorithms();

    if (!algorithms.length) {
        alert('No supported algorithm selected for benchmark.');
        return;
    }

    const payload = {
        size,
        maxValue,
        initialCondition,
        algorithms
    };
    showBenchmarkModal();

    try {
        if (el.deepBenchmarkBtn) {
            el.deepBenchmarkBtn.disabled = true;
            el.deepBenchmarkBtn.textContent = 'Benchmarking...';
        }
        if (el.benchmarkRunBtn) {
            el.benchmarkRunBtn.disabled = true;
            el.benchmarkRunBtn.textContent = 'Running...';
        }

        const response = await fetch(`${API_BASE_URL}/benchmark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const message = data?.error || 'Failed to run benchmark.';
            throw new Error(message);
        }

        if (el.benchmarkModal?.classList.contains('hidden')) {
            return;
        }

        const rows = Array.isArray(data.results) ? data.results : [];
        const sortedRows = [...rows].sort((a, b) => (a.timeMs ?? 0) - (b.timeMs ?? 0));

        if (el.benchmarkMeta) {
            el.benchmarkMeta.textContent = `Array Size: ${data.arraySize ?? size} | Condition: ${initialCondition}`;
        }

        if (el.benchmarkResultsBody) {
            el.benchmarkResultsBody.innerHTML = sortedRows.map((row) => `
                <tr>
                    <td>${escapeHtml(row.algorithm ?? '-')}</td>
                    <td>${row.timeMs ?? '-'}</td>
                    <td>${row.comparisons ?? '-'}</td>
                    <td>${row.swaps ?? '-'}</td>
                </tr>
            `).join('');

            if (!sortedRows.length) {
                el.benchmarkResultsBody.innerHTML = '<tr><td colspan="4">No benchmark results available.</td></tr>';
            }
        }
    } catch (error) {
        if (!el.benchmarkModal.classList.contains('hidden')) {
            closeBenchmarkModal();
        }
        alert(toUserFacingApiError('Benchmark error', error));
    } finally {
        if (el.deepBenchmarkBtn) {
            el.deepBenchmarkBtn.disabled = false;
            el.deepBenchmarkBtn.textContent = '🚀 Deep Benchmark';
        }
        if (el.benchmarkRunBtn) {
            el.benchmarkRunBtn.disabled = false;
            el.benchmarkRunBtn.textContent = 'Run Benchmark';
        }
    }
}

async function showLeaderboard() {
    try {
        if (el.globalLeaderboardBtn) {
            el.globalLeaderboardBtn.disabled = true;
            el.globalLeaderboardBtn.textContent = 'Loading...';
        }

        const response = await fetch(`${API_BASE_URL}/leaderboard/global`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
            throw new Error('Failed to load leaderboard.');
        }

        const rows = Array.isArray(data) ? data : [];
        if (el.globalLeaderboardBody) {
            el.globalLeaderboardBody.innerHTML = rows.map((row) => `
                <tr>
                    <td>${escapeHtml(row.algorithmName ?? '-')}</td>
                    <td>${row.totalWins ?? 0}</td>
                    <td>${row.winPercentage ?? 0}%</td>
                </tr>
            `).join('');

            if (!rows.length) {
                el.globalLeaderboardBody.innerHTML = '<tr><td colspan="3">No leaderboard data yet.</td></tr>';
            }
        }

        openModal(el.leaderboardModal);
    } catch (error) {
        alert(toUserFacingApiError('Leaderboard error', error));
    } finally {
        if (el.globalLeaderboardBtn) {
            el.globalLeaderboardBtn.disabled = false;
            el.globalLeaderboardBtn.textContent = '🏆 Leaderboard';
        }
    }
}

function saveRaceResult(winner, leftAlgo, rightAlgo, size, leftTime, rightTime) {
    const payload = {
        username: 'TestUser',
        leftAlgorithm: normalizeAlgoForBackend(leftAlgo),
        rightAlgorithm: normalizeAlgoForBackend(rightAlgo),
        winnerAlgorithm: normalizeAlgoForBackend(winner),
        leftTimeMs: Math.max(0, Math.round(Number(leftTime) || 0)),
        rightTimeMs: Math.max(0, Math.round(Number(rightTime) || 0)),
        arraySize: Number(size) || 0,
        initialCondition: mapInitialConditionToBackend(el.initialCondition?.value),
        timestamp: new Date().toISOString()
    };

    try {
        fetch(`${API_BASE_URL}/leaderboard/race-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch((error) => {
            console.error('Failed to save race result:', error.message);
        });
    } catch (error) {
        console.error('Failed to save race result:', error.message);
    }
}

function queuePostAnimationSave(saveOperation) {
    window.requestAnimationFrame(() => {
        try {
            saveOperation();
        } catch (error) {
            console.error('Failed to queue race result save:', error.message);
        }
    });
}

function persistCompareRaceResult() {
    if (state.compare.persisted) return;
    try {
        state.compare.persisted = true;

        const leftTime = state.compare.left.finishTimeMs ?? state.compare.left.steps.length;
        const rightTime = state.compare.right.finishTimeMs ?? state.compare.right.steps.length;

        const winnerSide = state.compare.winner || (leftTime <= rightTime ? 'left' : 'right');
        const winnerAlgo = winnerSide === 'left' ? state.compare.left.algo : state.compare.right.algo;

        queuePostAnimationSave(() => {
            saveRaceResult(
                winnerAlgo,
                state.compare.left.algo,
                state.compare.right.algo,
                state.originalArray.length,
                leftTime,
                rightTime
            );
        });
    } catch (error) {
        state.compare.persisted = false;
        console.error('Failed to prepare compare result save:', error.message);
    }
}

function persistRaceModeResult() {
    if (state.race.persisted) return;
    try {
        state.race.persisted = true;

        const ranked = [...state.race.entries]
            .filter((entry) => entry.rank > 0)
            .sort((a, b) => a.rank - b.rank);

        if (ranked.length < 2) {
            state.race.persisted = false;
            return;
        }

        const winner = ranked[0];
        const runnerUp = ranked[1];
        const winnerTime = winner.finishTimeMs ?? winner.steps.length;
        const runnerUpTime = runnerUp.finishTimeMs ?? runnerUp.steps.length;

        queuePostAnimationSave(() => {
            saveRaceResult(
                winner.algo,
                winner.algo,
                runnerUp.algo,
                state.originalArray.length,
                winnerTime,
                runnerUpTime
            );
        });
    } catch (error) {
        state.race.persisted = false;
        console.error('Failed to prepare race result save:', error.message);
    }
}

function renderAnalyticsResults(results) {
    const safeResults = Array.isArray(results) ? results : [];
    if (!safeResults.length) {
        el.analyticsResults.innerHTML = '<span style="color:#ff4444">No analytics data found.</span>';
        return;
    }

    if (state.analyticsChartInstance) {
        state.analyticsChartInstance.destroy();
    }

    const ctx = el.analyticsChart.getContext('2d');
    state.analyticsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: safeResults.map((r) => r.algorithmName),
            datasets: [
                {
                    label: 'Execution Time (ms)',
                    data: safeResults.map((r) => r.executionTimeMs),
                    backgroundColor: ['#00ff88', '#00cfff', '#ffaa00', '#ff6a00', '#6aff00', '#00a7ff']
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    let winner = safeResults[0];
    safeResults.forEach((entry) => {
        if (entry.executionTimeMs < winner.executionTimeMs) winner = entry;
    });

    el.analyticsResults.innerHTML =
        `<b>Winner:</b> <span style="color:#00ff88">${escapeHtml(winner.algorithmName)}</span><br>` +
        safeResults
            .map((r) => `${escapeHtml(r.algorithmName)}: <b>${r.executionTimeMs} ms</b> | Comparisons: ${r.comparisons} | Swaps: ${r.swaps}`)
            .join('<br>');
}

async function fetchLeaderboard() {
    if (!el.leaderboardTableBody) return;
    el.leaderboardTableBody.innerHTML = '<tr><td colspan="6" style="color:#00cfff">Loading...</td></tr>';

    try {
        const res = await fetch(`${API_BASE_URL}/analytics/leaderboard`);
        if (!res.ok) throw new Error('Failed to load analytics leaderboard.');

        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];

        el.leaderboardTableBody.innerHTML = rows.map((row) => {
            return `<tr>
                <td>${escapeHtml(row.algorithmName)}</td>
                <td>${row.executionTimeMs}</td>
                <td>${row.comparisons}</td>
                <td>${row.swaps}</td>
                <td>${row.datasetSize}</td>
                <td>${new Date(row.executedAt).toLocaleString()}</td>
            </tr>`;
        }).join('');

        if (!rows.length) {
            el.leaderboardTableBody.innerHTML = '<tr><td colspan="6">No results yet.</td></tr>';
        }
    } catch (error) {
        const message = toUserFacingApiError('Error', error);
        el.leaderboardTableBody.innerHTML = `<tr><td colspan="6" style="color:#ff4444">${escapeHtml(message)}</td></tr>`;
    }
}

function showAnalyticsTab(tab) {
    el.analyticsDashboard.style.display = tab === 'analytics' ? '' : 'none';
    el.leaderboard.style.display = tab === 'leaderboard' ? '' : 'none';
}

function showAnalyticsDashboard() {
    setMode('analytics');
    showAnalyticsTab('analytics');
}

function hideAnalyticsDashboard() {
    setMode('single');
}

async function runAnalyticsRace(values, algorithmNames = []) {
    showAnalyticsDashboard();
    el.analyticsResults.innerHTML = '<span style="color:#00cfff">Processing... Please wait.</span>';

    try {
        const response = await fetch(`${API_BASE_URL}/analytics/race`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        if (!response.ok) throw new Error('Failed to run analytics race.');

        const data = await response.json();
        let results = Array.isArray(data.results) ? data.results : [];

        if (algorithmNames.length) {
            results = results.filter((entry) => algorithmNames.includes(entry.algorithmName) || results.length <= 3);
        }

        renderAnalyticsResults(results);
    } catch (error) {
        const message = toUserFacingApiError('Error', error);
        el.analyticsResults.innerHTML = `<span style="color:#ff4444">${escapeHtml(message)}</span>`;
    }
}

async function runAnalyticsMode(values) {
    return runAnalyticsRace(values);
}

function syncChartFullscreenState() {
    const isChartFullscreen = document.fullscreenElement === el.chartPanel;
    state.fullscreen = isChartFullscreen;
    el.chartPanel.classList.toggle('expanded', isChartFullscreen);
    document.body.classList.toggle('chart-fullscreen-active', isChartFullscreen);
    el.expandChartBtn.classList.toggle('hidden', isChartFullscreen);
    el.exitExpandBtn.classList.toggle('hidden', !isChartFullscreen);
    rerenderActiveMode();
}

// Feature 1: Click-to-expand / fullscreen chart panel
function setFullscreen(expanded) {
    state.fullscreen = expanded;
    el.chartPanel.classList.toggle('expanded', expanded);
    document.body.classList.toggle('chart-fullscreen-active', expanded);
    el.expandChartBtn.classList.toggle('hidden', expanded);
    el.exitExpandBtn.classList.toggle('hidden', !expanded);
    rerenderActiveMode();
}

async function toggleFullscreen() {
    if (!el.chartPanel) return;

    const isChartFullscreen = document.fullscreenElement === el.chartPanel;

    if (!isChartFullscreen) {
        if (typeof el.chartPanel.requestFullscreen === 'function') {
            try {
                await el.chartPanel.requestFullscreen();
                return;
            } catch (error) {
                // Fallback to CSS-only expanded mode if Fullscreen API is denied/unavailable.
            }
        }
        setFullscreen(true);
        return;
    }

    if (typeof document.exitFullscreen === 'function') {
        try {
            await document.exitFullscreen();
            return;
        } catch (error) {
            // Fallback to CSS-only exit if native fullscreen exit fails.
        }
    }

    setFullscreen(false);
}

// Feature 4: Keyboard shortcuts modal behavior
function openShortcutsModal() {
    el.shortcutsModal.classList.remove('hidden');
}

function closeShortcutsModal() {
    el.shortcutsModal.classList.add('hidden');
}

function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function handleKeydown(event) {
    if (isTypingTarget(event.target)) return;

    if (!el.benchmarkModal.classList.contains('hidden') && event.key === 'Escape') {
        closeBenchmarkModal();
        return;
    }

    if (!el.leaderboardModal.classList.contains('hidden') && event.key === 'Escape') {
        closeModal(el.leaderboardModal);
        return;
    }

    if (!el.shortcutsModal.classList.contains('hidden') && event.key === 'Escape') {
        closeShortcutsModal();
        return;
    }

    // Feature 4: Global keyboard shortcuts
    if (event.code === 'Space') {
        event.preventDefault();
        if (state.playing) pausePlayback(); else play();
        return;
    }

    if (event.code === 'ArrowRight') {
        event.preventDefault();
        stepForward();
        return;
    }

    if (event.code === 'ArrowLeft') {
        event.preventDefault();
        stepBackward();
        return;
    }

    const key = event.key.toLowerCase();

    if (key === 'r') {
        event.preventDefault();
        generateArray();
        return;
    }

    if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
        return;
    }

    if (key === 't') {
        event.preventDefault();
        toggleTheme();
        return;
    }

    if (key === 'm') {
        event.preventDefault();
        toggleSound();
    }
}


// DRY: Blur select after change for dropdowns
function blurSelectAfterChange(event) {
    const select = event.currentTarget;
    if (select && typeof select.blur === 'function') {
        select.blur();
    }
}

function triggerPulse(element) {
    if (!element) return;
    element.classList.remove('anim-pulse');
    void element.offsetWidth; // trigger reflow
    element.classList.add('anim-pulse');
    setTimeout(() => {
        element.classList.remove('anim-pulse');
    }, 350);
}

function bindSelectBlurOnChange(selectElements) {
    selectElements.forEach((select) => {
        if (!select) return;
        select.addEventListener('change', blurSelectAfterChange);
    });
}

function bindSliderBlurOnRelease(sliderElements) {
    sliderElements.forEach((slider) => {
        if (!slider) return;
        slider.addEventListener('mouseup', () => slider.blur());
        slider.addEventListener('touchend', () => slider.blur());
    });
}

function bindEvents() {
    el.generateBtn.addEventListener('click', generateArray);
    if (el.deepBenchmarkBtn) {
        el.deepBenchmarkBtn.addEventListener('click', () => {
            triggerPulse(el.deepBenchmarkBtn);
            runBenchmark();
        });
    }
    if (el.benchmarkRunBtn) {
        el.benchmarkRunBtn.addEventListener('click', () => {
            triggerPulse(el.benchmarkRunBtn);
            runBenchmark();
        });
    }
    if (el.benchmarkCustomSize) {
        el.benchmarkCustomSize.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                runBenchmark();
            }
        });
    }
    if (el.globalLeaderboardBtn) {
        el.globalLeaderboardBtn.addEventListener('click', () => {
            triggerPulse(el.globalLeaderboardBtn);
            showLeaderboard();
        });
    }

    el.arraySize.addEventListener('input', () => {
        updateSliderLabels();
        scheduleArrayRegeneration();
    });
    el.arraySize.addEventListener('change', () => {
        updateSliderLabels();
        if (generateArrayDebounceTimer) {
            clearTimeout(generateArrayDebounceTimer);
            generateArrayDebounceTimer = null;
        }
        refreshArrayForCurrentControls();
    });
    el.maxValue.addEventListener('input', () => {
        updateSliderLabels();
        scheduleArrayRegeneration();
    });
    el.maxValue.addEventListener('change', () => {
        updateSliderLabels();
        if (generateArrayDebounceTimer) {
            clearTimeout(generateArrayDebounceTimer);
            generateArrayDebounceTimer = null;
        }
        refreshArrayForCurrentControls();
    });
    el.initialCondition.addEventListener('change', generateArray);
    el.primaryAlgo.addEventListener('change', handleAlgorithmSwitch);

    // DRY: Blur dropdowns after change
    bindSelectBlurOnChange([el.primaryAlgo, el.initialCondition, el.leftAlgo, el.rightAlgo]);

    // Remove slider focus after drag so spacebar works
    bindSliderBlurOnRelease([el.arraySize, el.maxValue, el.speedSlider]);

    // Feature 2: Theme toggle in navbar
    el.themeToggleBtn.addEventListener('click', () => {
        triggerPulse(el.themeToggleBtn);
        toggleTheme();
    });

    // Feature 5: Compare mode toggle button
    el.compareModeBtn.addEventListener('click', () => {
        triggerPulse(el.compareModeBtn);
        if (state.mode === 'compare') {
            setMode('single');
        } else {
            setMode('compare');
        }
    });

    // Feature 9: Race mode toggle button
    el.raceModeBtn.addEventListener('click', () => {
        triggerPulse(el.raceModeBtn);
        if (state.mode === 'race') {
            setMode('single');
        } else {
            setMode('race');
        }
    });

    el.leftAlgo.addEventListener('change', () => {
        triggerPulse(el.leftAlgo);
        state.selections.compareModeAlgorithms.left = normalizeAlgorithmKey(
            el.leftAlgo.value,
            state.selections.compareModeAlgorithms.left
        );
        if (state.mode === 'compare') prepareCompareMode();
    });
    el.rightAlgo.addEventListener('change', () => {
        triggerPulse(el.rightAlgo);
        state.selections.compareModeAlgorithms.right = normalizeAlgorithmKey(
            el.rightAlgo.value,
            state.selections.compareModeAlgorithms.right
        );
        if (state.mode === 'compare') prepareCompareMode();
    });

    el.playPauseBtn.addEventListener('click', () => {
        triggerPulse(el.playPauseBtn);
        if (state.playing) pausePlayback(); else play();
    });
    el.nextBtn.addEventListener('click', () => { triggerPulse(el.nextBtn); stepForward(); });
    el.prevBtn.addEventListener('click', () => { triggerPulse(el.prevBtn); stepBackward(); });
    el.firstBtn.addEventListener('click', () => { triggerPulse(el.firstBtn); goToStart(); });
    el.lastBtn.addEventListener('click', () => { triggerPulse(el.lastBtn); goToEnd(); });

    el.speedSlider.addEventListener('input', () => {
        state.speed = parseInt(el.speedSlider.value, 10);
        updateAnimationSpeed();
        restartPlaybackIfNeeded();
    });

    el.soundToggle.addEventListener('click', toggleSound);

    // Feature 1: Expand/collapse with button and chart click

    el.expandChartBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFullscreen();
    });
    el.exitExpandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFullscreen();
    });
    el.chartPanel.addEventListener('click', (event) => {
        if (state.mode === 'analytics') return;
        if (event.target.closest('.panel-btn')) return;
        if (event.target.closest('select') || event.target.closest('button')) return;
        toggleFullscreen();
    });

    // Toggle expand/exit button visibility on fullscreen change
    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement === el.chartPanel;
        el.expandChartBtn.classList.toggle('hidden', isFullscreen);
        el.exitExpandBtn.classList.toggle('hidden', !isFullscreen);
        
        // Ensure inline styles are cleaned so classes take effect
        el.expandChartBtn.style.display = '';
        el.exitExpandBtn.style.display = '';
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Initial state
    el.expandChartBtn.classList.remove('hidden');
    el.exitExpandBtn.classList.add('hidden');
    el.expandChartBtn.style.display = '';
    el.exitExpandBtn.style.display = '';
// Animate ALGO ARENA logo
window.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.brand h1');
    if (logo) {
        logo.style.animation = 'logoPulse 2.2s infinite alternate cubic-bezier(.4,0,.2,1)';
    }
});

    // Feature 4: shortcuts modal open/close
    el.shortcutsBtn.addEventListener('click', () => {
        triggerPulse(el.shortcutsBtn);
        openShortcutsModal();
    });
    el.closeShortcutsModal.addEventListener('click', closeShortcutsModal);
    el.shortcutsModal.addEventListener('click', (event) => {
        if (event.target === el.shortcutsModal) closeShortcutsModal();
    });

    if (el.closeBenchmarkModal) {
        el.closeBenchmarkModal.addEventListener('click', () => closeBenchmarkModal());
    }
    if (el.benchmarkModal) {
        el.benchmarkModal.addEventListener('click', (event) => {
            if (event.target === el.benchmarkModal) {
                closeBenchmarkModal();
            }
        });
    }

    if (el.closeLeaderboardModal) {
        el.closeLeaderboardModal.addEventListener('click', () => closeModal(el.leaderboardModal));
    }
    if (el.leaderboardModal) {
        el.leaderboardModal.addEventListener('click', (event) => {
            if (event.target === el.leaderboardModal) {
                closeModal(el.leaderboardModal);
            }
        });
    }

    // Analytics tabs
    el.tabVisual.addEventListener('click', hideAnalyticsDashboard);
    el.tabAnalytics.addEventListener('click', () => {
        showAnalyticsDashboard();
        showAnalyticsTab('analytics');
    });
    el.tabLeaderboard.addEventListener('click', async () => {
        showAnalyticsDashboard();
        showAnalyticsTab('leaderboard');
        await fetchLeaderboard();
    });

    // Feature 4: global keyboard shortcuts
    window.addEventListener('keydown', handleKeydown);

    window.addEventListener('resize', () => {
        rerenderActiveMode();
    });

    // FRESH REDESIGN
    const pseudoCodeElement = document.getElementById('pseudoCode') || document.querySelector('.pseudo-code-text');
    const pseudoModal = document.getElementById('pseudoModal');
    const pseudoModalCode = document.getElementById('pseudoModalCode');
    const pseudoModalClose = document.getElementById('pseudoModalClose');
    const pseudoModalAlgoName = document.getElementById('pseudoModalAlgoName');

    if (pseudoCodeElement && pseudoModal && pseudoModalCode && pseudoModalClose && pseudoModalAlgoName) {
        const openPseudoModal = () => {
            const selectedLabel = el.primaryAlgo.options[el.primaryAlgo.selectedIndex]?.textContent || el.primaryAlgo.value;
            pseudoModalAlgoName.innerText = `${selectedLabel} — Pseudocode`;
            pseudoModalCode.innerText = pseudoCodeElement.innerText;
            pseudoModal.classList.add('open');
            document.body.classList.add('pseudo-modal-open');
        };

        const closePseudoModal = () => {
            pseudoModal.classList.remove('open');
            document.body.classList.remove('pseudo-modal-open');
        };

        pseudoCodeElement.addEventListener('click', openPseudoModal);

        pseudoModalClose.addEventListener('click', closePseudoModal);

        pseudoModal.addEventListener('click', (e) => {
            if (e.target.id === 'pseudoModal') {
                closePseudoModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePseudoModal();
            }
        });
    }
}

function initThemeFromStorage() {
    const saved = localStorage.getItem('algoArenaTheme') || localStorage.getItem('theme'); /* PIVOT COMPARING FIX + LIGHT MODE */
    setTheme(saved === 'light' ? 'light' : 'dark'); /* PIVOT COMPARING FIX + LIGHT MODE */
}

function init() {
    if (el.benchmarkCustomSize) {
        el.benchmarkCustomSize.min = String(BENCHMARK_MIN_SIZE);
        el.benchmarkCustomSize.max = String(BENCHMARK_MAX_SIZE);
    }

    syncAlgorithmSelectionsFromUI();
    state.race.selectedAlgorithms = [...RACE_ALGOS];
    applyAlgorithmSelectionsToUI();

    bindEvents();
    updateSliderLabels();
    initThemeFromStorage();

    state.speed = parseInt(el.speedSlider.value, 10);
    updateAnimationSpeed();
    updateStudyPanelUI(ALGO_KEY_TO_NAME[el.primaryAlgo.value] || 'Bubble Sort');
    clearStepDetails();

    generateArray();
    setMode('single');
    syncChartFullscreenState();
}

window.addEventListener('load', init);
