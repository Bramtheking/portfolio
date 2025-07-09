"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Shuffle, Zap } from "lucide-react"

interface AlgorithmStep {
  code: string
  description: string
  highlight?: number[]
}

const algorithms = {
  bubbleSort: {
    name: "Bubble Sort",
    language: "Python",
    steps: [
      {
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Initialize array
data = [64, 34, 25, 12, 22, 11, 90]
print("Original:", data)`,
        description: "Setting up Bubble Sort algorithm with sample data",
      },
      {
        code: `# Starting bubble sort...
# Pass 1: Compare adjacent elements
if 64 > 34: swap → [34, 64, 25, 12, 22, 11, 90]
if 64 > 25: swap → [34, 25, 64, 12, 22, 11, 90]
if 64 > 12: swap → [34, 25, 12, 64, 22, 11, 90]`,
        description: "First pass - largest element bubbles to the end",
      },
      {
        code: `# Pass 2: Continue sorting...
if 34 > 25: swap → [25, 34, 12, 22, 11, 64, 90]
if 34 > 12: swap → [25, 12, 34, 22, 11, 64, 90]
if 34 > 22: swap → [25, 12, 22, 34, 11, 64, 90]`,
        description: "Second pass - second largest finds its position",
      },
      {
        code: `# Final result after all passes:
sorted_data = [11, 12, 22, 25, 34, 64, 90]
print("Sorted:", sorted_data)

# Time Complexity: O(n²)
# Space Complexity: O(1)
print("✅ Bubble Sort Complete!")`,
        description: "Algorithm completed - array is now sorted!",
      },
    ],
  },
  quickSort: {
    name: "Quick Sort",
    language: "JavaScript",
    steps: [
      {
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

const data = [10, 7, 8, 9, 1, 5];
console.log("Original:", data);`,
        description: "Quick Sort setup with divide-and-conquer approach",
      },
      {
        code: `function partition(arr, low, high) {
    let pivot = arr[high]; // Choose last element as pivot
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
        description: "Partitioning around pivot element",
      },
      {
        code: `// Recursive calls in action:
// quickSort([10, 7, 8, 9, 1, 5], 0, 5)
//   ├── partition: pivot=5, result=[1, 5, 8, 9, 10, 7]
//   ├── quickSort([1], 0, 0) ✓
//   └── quickSort([8, 9, 10, 7], 2, 5)
//       ├── partition: pivot=7, result=[7, 9, 10, 8]
//       └── Continue recursively...`,
        description: "Recursive partitioning in progress",
      },
      {
        code: `// Final sorted array:
const result = [1, 5, 7, 8, 9, 10];
console.log("Sorted:", result);

// Performance Analysis:
// Best Case: O(n log n)
// Average Case: O(n log n)  
// Worst Case: O(n²)
console.log("🚀 Quick Sort Complete!");`,
        description: "Quick Sort finished - optimal performance achieved!",
      },
    ],
  },
  binarySearch: {
    name: "Binary Search",
    language: "Java",
    steps: [
      {
        code: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
        description: "Binary Search implementation - divide and conquer",
      },
      {
        code: `// Searching for target = 7 in sorted array
int[] sortedArray = {1, 3, 5, 7, 9, 11, 13, 15};
int target = 7;

// Step 1: Initial bounds
// left = 0, right = 7, mid = 3
// arr[3] = 7 == target ✓ FOUND!

System.out.println("Target found at index: " + 3);`,
        description: "Lucky! Found target on first comparison",
      },
      {
        code: `// Let's search for target = 11
target = 11;

// Step 1: left=0, right=7, mid=3, arr[3]=7 < 11
//         → Search right half: left=4
// Step 2: left=4, right=7, mid=5, arr[5]=11 == 11
//         → FOUND at index 5!

System.out.println("Target 11 found at index: " + 5);`,
        description: "Demonstrating the search process step by step",
      },
      {
        code: `// Performance comparison:
// Linear Search: O(n) - checks every element
// Binary Search: O(log n) - eliminates half each time

// For 1 million elements:
// Linear: up to 1,000,000 comparisons
// Binary: maximum 20 comparisons!

System.out.println("⚡ Binary Search: Logarithmic efficiency!");`,
        description: "Binary Search complete - exponentially faster than linear!",
      },
    ],
  },
}

export default function CodeTerminal() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<keyof typeof algorithms>("bubbleSort")
  const [currentStep, setCurrentStep] = useState(0)
  const [displayedCode, setDisplayedCode] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(15)
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
  const [isExecuting, setIsExecuting] = useState(false)

  const typingRef = useRef<NodeJS.Timeout>()
  const playRef = useRef<NodeJS.Timeout>()

  const currentAlgorithmData = algorithms[currentAlgorithm]
  const currentStepData = currentAlgorithmData.steps[currentStep]

  // Auto-advance through steps
  useEffect(() => {
    if (isPlaying && !isTyping) {
      playRef.current = setTimeout(() => {
        if (currentStep < currentAlgorithmData.steps.length - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          setIsPlaying(false)
          setCurrentStep(0)
        }
      }, 3000)
    }
    return () => {
      if (playRef.current) clearTimeout(playRef.current)
    }
  }, [isPlaying, isTyping, currentStep, currentAlgorithmData.steps.length])

  // Typing animation effect - 2.5x faster
  useEffect(() => {
    if (currentStepData) {
      setDisplayedCode("")
      setIsTyping(true)

      let i = 0
      const code = currentStepData.code

      const typeChar = () => {
        if (i < code.length) {
          setDisplayedCode(code.slice(0, i + 1))
          i++
          // Made 2.5x faster: reduced from 20-100ms to 8-40ms
          const delay = code[i - 1] === "\n" ? 40 : Math.random() * 32 + 8
          typingRef.current = setTimeout(typeChar, delay)
        } else {
          setIsTyping(false)
        }
      }

      typeChar()
    }

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [currentStep, currentAlgorithm])

  const handleAlgorithmChange = (algorithm: keyof typeof algorithms) => {
    setCurrentAlgorithm(algorithm)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetVisualization = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setArray([64, 34, 25, 12, 22, 11, 90])
  }

  const shuffleArray = () => {
    const newArray = [...array].sort(() => Math.random() - 0.5)
    setArray(newArray)
  }

  const executeAlgorithm = async () => {
    setIsExecuting(true)
    // Simulate algorithm execution
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExecuting(false)
  }

  return (
    <section id="code-terminal" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Interactive Algorithm Visualizer
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch algorithms come to life! Explore sorting and searching algorithms with real-time visualizations and
            step-by-step explanations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Algorithm Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(algorithms).map(([key, algo]) => (
              <Button
                key={key}
                variant={currentAlgorithm === key ? "default" : "outline"}
                onClick={() => handleAlgorithmChange(key as keyof typeof algorithms)}
                className={`${
                  currentAlgorithm === key
                    ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white"
                    : "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                {algo.name}
                <Badge variant="secondary" className="ml-2">
                  {algo.language}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Control Panel */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={togglePlayPause}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

            <Button
              onClick={resetVisualization}
              variant="outline"
              className="border-orange-400/50 text-orange-400 hover:bg-orange-400/10 bg-transparent"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              onClick={shuffleArray}
              variant="outline"
              className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 bg-transparent"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Shuffle Data
            </Button>

            <Button
              onClick={executeAlgorithm}
              disabled={isExecuting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Zap className="mr-2 h-4 w-4" />
              {isExecuting ? "Executing..." : "Execute"}
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-gray-400">Slow</span>
            <input
              type="range"
              min="5"
              max="50"
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(Number(e.target.value))}
              className="w-32 accent-cyan-400"
            />
            <span className="text-gray-400">Fast</span>
          </div>

          {/* Main Terminal */}
          <Card className="bg-gray-900/50 border-cyan-400/30 backdrop-blur-sm">
            <CardHeader className="bg-gray-800/50 border-b border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300 font-mono text-sm ml-4">
                    ~/algorithms/{currentAlgorithmData.name.toLowerCase().replace(" ", "_")}.
                    {currentAlgorithmData.language === "Python"
                      ? "py"
                      : currentAlgorithmData.language === "JavaScript"
                        ? "js"
                        : "java"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-green-400/50 text-green-400">
                    {currentAlgorithmData.language}
                  </Badge>
                  <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                    Step {currentStep + 1}/{currentAlgorithmData.steps.length}
                  </Badge>
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Typing...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Code Display */}
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-4 border border-gray-700/50">
                    <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {displayedCode}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </pre>
                  </div>

                  {/* Step Description */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-400/30">
                    <h4 className="text-cyan-400 font-semibold mb-2">Current Step:</h4>
                    <p className="text-gray-300">{currentStepData?.description}</p>
                  </div>
                </div>

                {/* Visualization Area */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-purple-400 font-semibold mb-4">Array Visualization</h4>
                    <div className="flex items-end justify-center gap-2 h-32">
                      {array.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t flex items-end justify-center text-white text-xs font-bold transition-all duration-300"
                          style={{
                            height: `${(value / Math.max(...array)) * 100}%`,
                            width: "40px",
                            minHeight: "20px",
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Algorithm Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                      <div className="text-green-400 text-sm font-semibold">Time Complexity</div>
                      <div className="text-white font-mono">
                        {currentAlgorithm === "bubbleSort"
                          ? "O(n²)"
                          : currentAlgorithm === "quickSort"
                            ? "O(n log n)"
                            : "O(log n)"}
                      </div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/30">
                      <div className="text-blue-400 text-sm font-semibold">Space Complexity</div>
                      <div className="text-white font-mono">
                        {currentAlgorithm === "quickSort" ? "O(log n)" : "O(1)"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / currentAlgorithmData.steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-gray-400 text-sm">
              Progress: {currentStep + 1} of {currentAlgorithmData.steps.length} steps
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
