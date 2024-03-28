interface Record {
    id: string;
    [key: string]: any;
}

export interface Output {
    score: string;
    id: string;
}

/**
 * Extracts the score (the key) and the value as JSON from the provided data string.
 * 
 * @param data - The input string in the format "score: value".
 * @returns An object containing the extracted score and the parsed JSON value.
 */
function extractScoreAndValue(data: string): { score: string, value: Record } {
    const parts = data.split(': ');
    if (parts.length !== 2) {
        console.error("Invalid data format: missing colon separator")
        process.exit(2);
    }

    const score = parts[0].trim();
    const jsonString = parts[1].trim();

    let parsedValue: any;
    try {
        parsedValue = JSON.parse(jsonString);
    } catch (error: any) {
        console.error("Error Parsing JSON: At least one value contains invalid JSON")
        process.exit(2);
    }

    if (typeof parsedValue !== 'object' || parsedValue === null || !('id' in parsedValue)) {
        console.error("Invalid record in data file")
        process.exit(2);
    }

    return { score, value: parsedValue };
}

/**
 * Reads a file line by line and extracts Output objects from each line.
 * @param filePath Path to the file to be read.
 * @returns Promise that resolves to an array of Output objects extracted from the file.
 */
export async function readFileLineByLine(filePath: string): Promise<Output[]> {
    const file = Bun.file(filePath);
    const output: Output[] = [];

    // Open a stream to the file
    const stream = await file.stream();
    const decoder = new TextDecoder();

    let remainingData = "";

    // Iterate over chunks of data from the stream
    for await (const chunk of stream) {
        const str = decoder.decode(chunk);
        remainingData += str;
        let lines = remainingData.split(/\r?\n/);

        while (lines.length > 1) {
            const { score, value } = extractScoreAndValue(lines.shift()!);
            output.push({
                score: score,
                id: value.id
            });
        }
        remainingData = lines[0];
    }
    return output;
}

/**
 * Sorts an array of Output objects by score in descending order and returns the top N results.
 * @param outputs Array of Output objects to be sorted.
 * @param n Number of top results to be returned.
 * @returns Array of top N Output objects sorted by score in descending order.
 */
export function sortOutputsByScoreDescending(outputs: Output[], n: number): Output[] {
    const heap: Output[] = [];

    // Populate the heap with the first N elements
    for (let i = 0; i < Math.min(n, outputs.length); i++) {
        heap.push(outputs[i]);
        heapifyUp(heap, i);
    }

    // Process remaining elements
    for (let i = n; i < outputs.length; i++) {
        if (parseFloat(outputs[i].score) > parseFloat(heap[0].score)) {
            heap[0] = outputs[i];
            heapifyDown(heap, 0);
        }
    }

    // Sort the heap in descending order
    const sortedHeap = heap.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    return sortedHeap;
}

// Helper function to maintain heap property while pushing an element up
function heapifyUp(heap: Output[], index: number) {
    let currentIndex = index;
    while (currentIndex > 0) {
        const parentIndex = Math.floor((currentIndex - 1) / 2);
        if (parseFloat(heap[currentIndex].score) < parseFloat(heap[parentIndex].score)) {
            [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]];
            currentIndex = parentIndex;
        } else {
            break;
        }
    }
}

// Helper function to maintain heap property while pushing an element down
function heapifyDown(heap: Output[], index: number) {
    let currentIndex = index;
    const length = heap.length;
    while (true) {
        let leftChildIndex = 2 * currentIndex + 1;
        let rightChildIndex = 2 * currentIndex + 2;
        let swapIndex = currentIndex;

        if (leftChildIndex < length && parseFloat(heap[leftChildIndex].score) < parseFloat(heap[swapIndex].score)) {
            swapIndex = leftChildIndex;
        }

        if (rightChildIndex < length && parseFloat(heap[rightChildIndex].score) < parseFloat(heap[swapIndex].score)) {
            swapIndex = rightChildIndex;
        }

        if (swapIndex !== currentIndex) {
            [heap[currentIndex], heap[swapIndex]] = [heap[swapIndex], heap[currentIndex]];
            currentIndex = swapIndex;
        } else {
            break;
        }
    }
}