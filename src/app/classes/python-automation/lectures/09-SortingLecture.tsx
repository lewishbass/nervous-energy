'use client';
import React, { useEffect } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock, AnimatedCodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';
import { useRouter } from 'next/navigation';
import { ExhaustiveVisualization, BinaryVisualization } from './lecture-components/SearchVisualization';
import { SortVisualizationContainer, SortAlgorithm } from './lecture-components/SortVisualization';

import '@/styles/code.css';
import './lecture.css';

import bookData from "@/app/books/book_info.json";


interface SortingLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function SortingLecture(props: SortingLectureProps | null) {
  const router = useRouter();
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // ── Sorting Algorithms ──────────────────────────────────────────────────

  const bogoSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    while (!(await visualizer.isSorted()).sorted) {
      const i = Math.floor(Math.random() * visualizer.length);
      const j = Math.floor(Math.random() * visualizer.length);
      await visualizer.swap(i, j);
    }
    visualizer.idle = true;
  };

  const improvedBogoSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    let sortedResult = await visualizer.isSorted();
    while (!sortedResult.sorted) {
      const i = Math.floor(Math.random() * (visualizer.length - sortedResult.index)) + sortedResult.index;
      const j = Math.floor(Math.random() * (visualizer.length - sortedResult.index)) + sortedResult.index;
      await visualizer.swap(i, j);
      sortedResult = await visualizer.isSorted();
    }
  };

  const selectionSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    const len = visualizer.length;
    for (let i = 0; i < len - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < len; j++) {
        if (await visualizer.compare(j, minIdx) < 0) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        await visualizer.swap(i, minIdx);
      }
    }
    await visualizer.isSorted();
    visualizer.idle = true;
  };

  const insertionSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    const len = visualizer.length;
    for (let i = 1; i < len; i++) {
      let j = i;
      while (j > 0 && await visualizer.compare(j - 1, j) > 0) {
        await visualizer.swap(j - 1, j);
        j--;
      }
    }
    await visualizer.isSorted();
    visualizer.idle = true;
  };

  const bubbleSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    const len = visualizer.length;
    for (let i = 0; i < len - 1; i++) {
      let swapped = false;
      for (let j = 0; j < len - 1 - i; j++) {
        if (await visualizer.compare(j, j + 1) > 0) {
          await visualizer.swap(j, j + 1);
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    await visualizer.isSorted();
    visualizer.idle = true;
  };

  const quickSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    const partition = async (lo: number, hi: number): Promise<number> => {
      const pivotIdx = hi;
      let i = lo;
      for (let j = lo; j < hi; j++) {
        if (await visualizer.compare(j, pivotIdx) < 0) {
          if (i !== j) await visualizer.swap(i, j);
          i++;
        }
      }
      if (i !== hi) await visualizer.swap(i, hi);
      return i;
    };
    const sort = async (lo: number, hi: number) => {
      if (lo >= hi) return;
      const p = await partition(lo, hi);
      await sort(lo, p - 1);
      await sort(p + 1, hi);
    };
    await sort(0, visualizer.length - 1);
    await visualizer.isSorted();
    visualizer.idle = true;
  };

  const heapSort: SortAlgorithm = async (visualizer) => {
    visualizer.idle = false;
    const len = visualizer.length;
    const siftDown = async (root: number, end: number) => {
      let parent = root;
      while (2 * parent + 1 <= end) {
        let child = 2 * parent + 1;
        if (child + 1 <= end && await visualizer.compare(child, child + 1) < 0) {
          child++;
        }
        if (await visualizer.compare(parent, child) < 0) {
          await visualizer.swap(parent, child);
          parent = child;
        } else {
          break;
        }
      }
    };
    // Build max heap
    for (let i = Math.floor((len - 2) / 2); i >= 0; i--) {
      await siftDown(i, len - 1);
    }
    // Extract elements
    for (let end = len - 1; end > 0; end--) {
      await visualizer.swap(0, end);
      await siftDown(0, end - 1);
    }
    await visualizer.isSorted();
    visualizer.idle = true;
  };







  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Sorting and Filtering</h2>
        <h3 className="tc2 lecture-section-header">Algorithms, Complexity, and Applications</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You'll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('datasets')}>Datasets</li>
          <li className="lecture-link" onClick={() => scrollToSection('binary-search')}>Binary Search and Why to Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('bogo-sort')}>Bogo Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('selection-sort')}>Selection Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('insertion-sort')}>Insertion Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('bubble-sort')}>Bubble Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('merge-sort')}>Merge Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('quick-sort')}>Quick Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('heap-sort')}>Heap Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('bucket-sort')}>Bucket Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('counting-sort')}>Counting Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('radix-sort')}>Radix Sort</li>
          <li className="lecture-link" onClick={() => scrollToSection('built-in-sorts')}>Built in Sorts</li>
          <li className="lecture-link" onClick={() => scrollToSection('filtering-arrays')}>Filtering Arrays</li>
        </ul>
      </section>

      {/* ── Datasets ── */}
      <section className="lecture-section mini-scroll" id="datasets">
        <h3 className="lecture-section-header">Datasets</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Datasets are collections of data-points that we want to perform some operation on.
          A dataset has <span className="lecture-bold">points</span> and <span className="lecture-bold">features</span>.
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Points</span> represent a single entry or instance in the dataset and are typically represented as rows in the table.
        </p>

        <div className="mb-4 mx-auto" style={{ maxWidth: '70%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header text-center">Person</th>
                <th className="lecture-table-header text-center">City</th>
                <th className="lecture-table-header text-center">Book</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell text-center">Alice</td>
                <td className="lecture-table-cell text-center">New York</td>
                <td className="lecture-table-cell text-center">Ringworld</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell text-center">Bob</td>
                <td className="lecture-table-cell text-center">London</td>
                <td className="lecture-table-cell text-center">I, Robot</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell text-center">Charlie</td>
                <td className="lecture-table-cell text-center">Tokyo</td>
                <td className="lecture-table-cell text-center">Excession</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Features</span> represent the attributes or characteristics of each data point and are typically represented as columns in the table.
        </p>

        <div className="mb-4 mx-auto" style={{ maxWidth: '70%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header text-center">Person Features</th>
                <th className="lecture-table-header text-center">City Features</th>
                <th className="lecture-table-header text-center">Book Features</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell text-center">Age</td><td className="lecture-table-cell text-center">Latitude</td><td className="lecture-table-cell text-center">Title</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell text-center">Height</td><td className="lecture-table-cell text-center">Longitude</td><td className="lecture-table-cell text-center">Author</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell text-center">Weight</td><td className="lecture-table-cell text-center">Name</td><td className="lecture-table-cell text-center">Year</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell text-center">Name</td><td className="lecture-table-cell text-center">Elevation</td><td className="lecture-table-cell text-center">Genre</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell text-center">SSN</td><td className="lecture-table-cell text-center">Population</td><td className="lecture-table-cell text-center">Word Count</td></tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Labels</span> are the specific values or categories that we want to predict or classify based on the features.
        </p>

        <div className="mb-4 mx-auto" style={{ maxWidth: '70%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header text-center">Person</th>
                <th className="lecture-table-header text-center">City</th>
                <th className="lecture-table-header text-center">Book</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell text-center">Use age, height, weight to predict <span className="lecture-bold">1-mile time</span></td>
                <td className="lecture-table-cell text-center">Use lat, lon, elevation to predict <span className="lecture-bold">population</span></td>
                <td className="lecture-table-cell text-center">Use year, word count to predict <span className="lecture-bold">genre</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Book Library Dataset</span>
          <div className="max-h-[500px] overflow-y-auto mini-scroll rounded-2xl">
            <table className="lecture-table">
              <thead className="sticky top-0 z-10 bg3">
                <tr className="lecture-table-row h-10">
                  <th className="lecture-table-header">Title</th>
                  <th className="lecture-table-header">Author</th>
                  <th className="lecture-table-header">Year</th>
                  <th className="lecture-table-header">Word Count</th>
                  <th className="lecture-table-header">Genre</th>
                </tr>
              </thead>
              <tbody>
                {bookData.map((book, index) => (
                  <tr key={index} className={`lecture-table-row ${index % 2 === 0 ? 'bg1' : 'bg2'}`}>
                    <td className="lecture-table-cell pl-4 cursor-pointer select-none hover:opacity-70 hover:translate-y-[-1px] transition-all duration-300" onClick={() => router.push(`/books/focus?ISBN=${book.ISBN}`)}>{book.title}</td>
                    <td className="lecture-table-cell">{book.author.split('and')[0]}</td>
                    <td className="lecture-table-cell">{book.year}</td>
                    <td className="lecture-table-cell pl-6 font-courier font-bold">{book.wordcount.toLocaleString().padStart(7, '\u00A0')}</td>
                    <td className="lecture-table-cell border-l-2 border-black/30 dark:border-white/30 bg-blue-500/30 dark:bg-yellow-300/30 text-center">{book.genre.split(',')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Binary Search and Why to Sort ── */}
      <section className="lecture-section mini-scroll" id="binary-search">
        <h3 className="lecture-section-header">Binary Search and Why to Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          A very common operation we want to perform on datasets is searching for a specific data point.
        </p>

        <div className="mb-4 mx-auto" style={{ maxWidth: '70%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header">Dataset</th>
                <th className="lecture-table-header">Search For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Library</td><td className="lecture-table-cell">Find a book by name</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">School</td><td className="lecture-table-cell">Find a student by ID number</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Internet</td><td className="lecture-table-cell">Find a website IP by URL</td></tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          The most basic way to do this is to iterate over each data point, checking along the way if it matches what we&#39;re looking for.
          This is called <span className="lecture-bold">exhaustive search</span>, and since it requires checking each data point, it has a time complexity of O(n).
        </p>
        <ExhaustiveVisualization />

        <p className="lecture-paragraph">
          If we sort the dataset before searching, the sorting operation requires some overhead, but each following search operation can be much faster.
          By checking the middle data point — since the dataset is sorted — if the middle value is less than what we&#39;re looking for, we can guarantee everything to its left is also less, and discard it.
          By comparing the middle point to our target and discounting half the data over and over, we narrow down to the target much faster.
          This is called <span className="lecture-bold">binary search</span>, and it has a time complexity of O(log n).
        </p>
        <BinaryVisualization />

        <p className="lecture-paragraph">
          Sorting algorithms are evaluated based on how many computer resources they use:
        </p>
        <div className="mb-4 mx-auto" style={{ maxWidth: '80%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header">Metric</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell"><span className="lecture-bold">Compare operations</span></td><td className="lecture-table-cell">Reading two values from memory and comparing them</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell"><span className="lecture-bold">Swap operations</span></td><td className="lecture-table-cell">Swapping two values in the array</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell"><span className="lecture-bold">Memory overhead</span></td><td className="lecture-table-cell">External memory used by the algorithm beyond the input</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto" style={{ maxWidth: '100%' }}>
          <span className="lecture-link">Sorting Algorithm Comparison</span>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header">Algorithm</th>
                <th className="lecture-table-header">Best</th>
                <th className="lecture-table-header">Average</th>
                <th className="lecture-table-header">Worst</th>
                <th className="lecture-table-header">Memory</th>
                <th className="lecture-table-header">Stable</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Bogo Sort</td><td className="lecture-table-cell">O(n)</td><td className="lecture-table-cell">O((n+1)!)</td><td className="lecture-table-cell">O(∞)</td><td className="lecture-table-cell">O(1)</td><td className="lecture-table-cell">No</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Selection Sort</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(1)</td><td className="lecture-table-cell">No</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Insertion Sort</td><td className="lecture-table-cell">O(n)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(1)</td><td className="lecture-table-cell">Yes</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Bubble Sort</td><td className="lecture-table-cell">O(n)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(1)</td><td className="lecture-table-cell">Yes</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Merge Sort</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n)</td><td className="lecture-table-cell">Yes</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Quick Sort</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(log n)</td><td className="lecture-table-cell">No</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Heap Sort</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(1)</td><td className="lecture-table-cell">No</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Bucket Sort</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">O(n²)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">Yes</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Counting Sort</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">Yes</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Radix Sort</td><td className="lecture-table-cell">O(nk)</td><td className="lecture-table-cell">O(nk)</td><td className="lecture-table-cell">O(nk)</td><td className="lecture-table-cell">O(n+k)</td><td className="lecture-table-cell">Yes</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bogo Sort ── */}
      <section className="lecture-section mini-scroll" id="bogo-sort">
        <h3 className="lecture-section-header">Bogo Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The silliest approach to sorting — and the slowest algorithm — is <span className="lecture-bold">bogo sort</span>.
          It randomizes the array and then checks if it&#39;s sorted.
          Since the chance of any random array being sorted is 1/n!, on average it requires n!/2 checks, and each check requires n comparisons, giving it an average time complexity of O((n+1)!).
        </p>
        <SortVisualizationContainer algorithm={bogoSort} title="Bogo Sort — O((n+1)!)" />

        <CodeBlock className="lecture-codeblock" language="python" caption="bogo sort in Python"
          code={`import random

def bogo_sort(arr):
    while not is_sorted(arr):
        random.shuffle(arr)
    return arr

def is_sorted(arr):
    return all(arr[i] <= arr[i+1] for i in range(len(arr)-1))`} />

        <p className="lecture-paragraph">
          The improved bogo sort recognizes that if we check whether the array is sorted and find that part of it already is, we probably don&#39;t want to randomize that part.
          Instead, we only randomize the unsorted portion, improving the average time complexity to O((n/2+1)!).
        </p>
        <SortVisualizationContainer algorithm={improvedBogoSort} title="Improved Bogo Sort — O((n/2+1)!)" />
      </section>

      {/* ── Selection Sort ── */}
      <section className="lecture-section mini-scroll" id="selection-sort">
        <h3 className="lecture-section-header">Selection Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Selection sort</span> takes a smarter approach: instead of waiting for the next smallest value to present itself, we go looking for it and then place it at its correct position.
          This makes sure our sorted section of the array grows and never gets out of order.
        </p>
        <SortVisualizationContainer algorithm={selectionSort} title="Selection Sort — O(n²)" />

        <CodeBlock className="lecture-codeblock" language="python" caption="selection sort in Python"
          code={`def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`} />

        <p className="lecture-paragraph">
          It always has to check every remaining element to make sure the next value is the minimum, so it requires the same n²/2 operations every time — O(n²).
          This algorithm does a lot of <span className="lecture-bold">comparing</span> to make sure values are the minimum, but only ever does n <span className="lecture-bold">swaps</span>.
          So while it is far from efficient, if your writing operations are very slow, it might be useful.
        </p>
      </section>

      {/* ── Insertion Sort ── */}
      <section className="lecture-section mini-scroll" id="insertion-sort">
        <h3 className="lecture-section-header">Insertion Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Insertion sort</span> is like the converse of selection sort. Instead of choosing the next value to make sure our sorted section remains in order,
          we always take the next value and choose where it goes to ensure the sorted section stays in order.
        </p>
        <SortVisualizationContainer algorithm={insertionSort} title="Insertion Sort — O(n²)" />

        <CodeBlock className="lecture-codeblock" language="python" caption="insertion sort in Python"
          code={`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`} />

        <p className="lecture-paragraph">
          Since we know the sorted section is in order, we can use binary search to find the correct position for the new value.
          Finding the location takes O(log n) time and we have to do it n times, so the comparison cost is O(n log n).
          However, if sorting is done in place, shifting elements over to accommodate the new value slows it down to O(n²).
          This can be sped up by storing the values in a <span className="lecture-bold">linked list</span> — since a linked list needs to store a value and reference for each node, it takes more memory, but inserting at a location is much faster.
        </p>
      </section>

      {/* ── Bubble Sort ── */}
      <section className="lecture-section mini-scroll" id="bubble-sort">
        <h3 className="lecture-section-header">Bubble Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Bubble sort</span> is an elegant and simple algorithm.
          Instead of worrying about keeping one section of your array in order, just iterate over the array and swap elements next to each other that are out of order.
        </p>
        <SortVisualizationContainer algorithm={bubbleSort} title="Bubble Sort — O(n²)" />

        <CodeBlock className="lecture-codeblock" language="python" caption="bubble sort in Python"
          code={`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break       # already sorted, stop early
    return arr`} />

        <p className="lecture-paragraph">
          Do this enough times, and the larger elements rise to the top like bubbles.
          The optimization shown above — stopping early when no swaps were made in a pass — means bubble sort runs in O(n) on already-sorted data.
        </p>
      </section>

      {/* ── Merge Sort ── */}
      <section className="lecture-section mini-scroll" id="merge-sort">
        <h3 className="lecture-section-header">Merge Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Merge sort</span> uses a divide and conquer strategy.
          It separates the data into two smaller arrays, sorts the smaller arrays, and then merges them together.
          When you are merging two sorted arrays, the next value is always at the front of one of the smaller arrays, so merging takes O(n) time.
        </p>
        <p className="lecture-paragraph">
          By recursively applying this splitting and merging to smaller and smaller arrays — since it splits and merges log n times — it is guaranteed to run in O(n log n).
          This O(n log n) time is much faster: for an array of size 1000, it might work 100 times faster than O(n²).
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="merge sort in Python"
          code={`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`} />

        <p className="lecture-paragraph">
          The downside of merge sort is that it requires O(n) extra memory to store the temporary arrays during merging.
          Because it creates new subarrays rather than sorting in place, it cannot be visualized with simple swap/compare operations.
        </p>
      </section>

      {/* ── Quick Sort ── */}
      <section className="lecture-section mini-scroll" id="quick-sort">
        <h3 className="lecture-section-header">Quick Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Quick sort</span> is the converse of merge sort. Instead of splitting arbitrarily and doing the work during merging, quick sort does the work during splitting.
          You pick a <span className="lecture-bold">pivot</span> element, then partition the array so everything smaller goes to the left and everything larger goes to the right.
          The pivot is now in its final position. Repeat recursively on both sides.
        </p>
        <SortVisualizationContainer algorithm={quickSort} title="Quick Sort — O(n log n) avg" />

        <CodeBlock className="lecture-codeblock" language="python" caption="quick sort in Python"
          code={`def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo >= hi:
        return
    pivot_idx = partition(arr, lo, hi)
    quick_sort(arr, lo, pivot_idx - 1)
    quick_sort(arr, pivot_idx + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i`} />

        <p className="lecture-paragraph">
          Quick sort has an average time complexity of O(n log n) but can degrade to O(n²) if the pivot choices are consistently bad — for example, always picking the smallest or largest element.
          However, it sorts in place with only O(log n) stack memory, making it very cache-friendly and fast in practice.
        </p>
      </section>

      {/* ── Heap Sort ── */}
      <section className="lecture-section mini-scroll" id="heap-sort">
        <h3 className="lecture-section-header">Heap Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Heap sort</span> is similar to selection sort, but instead of iterating over all remaining values to find the smallest in O(n) time,
          they are organized into a <span className="lecture-bold">heap</span> data structure which can find the smallest (or largest) element in O(log n) time.
        </p>
        <p className="lecture-paragraph">
          First, a max-heap is built from the array. Then the largest element (root) is swapped to the end and the heap is restored. This repeats until the array is sorted.
        </p>
        <SortVisualizationContainer algorithm={heapSort} title="Heap Sort — O(n log n)" />

        <CodeBlock className="lecture-codeblock" language="python" caption="heap sort in Python"
          code={`def heap_sort(arr):
    n = len(arr)
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n - 1)
    # Extract elements
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end - 1)
    return arr

def sift_down(arr, root, end):
    while 2 * root + 1 <= end:
        child = 2 * root + 1
        if child + 1 <= end and arr[child] < arr[child + 1]:
            child += 1
        if arr[root] < arr[child]:
            arr[root], arr[child] = arr[child], arr[root]
            root = child
        else:
            break`} />

        <p className="lecture-paragraph">
          Heap sort is guaranteed O(n log n) in all cases and uses O(1) extra memory.
          However, it tends to be slower in practice than quick sort because of poor cache locality — the heap jumps around in memory unpredictably.
        </p>
      </section>

      {/* ── Bucket Sort ── */}
      <section className="lecture-section mini-scroll" id="bucket-sort">
        <h3 className="lecture-section-header">Bucket Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          O(n log n) is generally accepted to be the fastest you can sort general data. But if you can make specific assumptions about your data, this can be beaten.
          O(n) sorting algorithms work by avoiding comparing elements to each other, and instead mapping them to and from domains in order.
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Bucket sort</span> assumes your data is relatively evenly distributed over its domain.
          It <span className="lecture-bold">scatters</span> the data into buckets by index, sorts each bucket individually, then <span className="lecture-bold">gathers</span> them back up.
          This has an average case of O(n), but if your data is skewed or follows some specific pattern, it can devolve into O(n²).
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="bucket sort in Python"
          code={`def bucket_sort(arr, num_buckets=10):
    if not arr:
        return arr
    min_val, max_val = min(arr), max(arr)
    bucket_range = (max_val - min_val) / num_buckets + 1
    buckets = [[] for _ in range(num_buckets)]

    for val in arr:
        idx = int((val - min_val) / bucket_range)
        buckets[idx].append(val)

    result = []
    for bucket in buckets:
        bucket.sort()           # sort each small bucket
        result.extend(bucket)
    return result`} />
      </section>

      {/* ── Counting Sort ── */}
      <section className="lecture-section mini-scroll" id="counting-sort">
        <h3 className="lecture-section-header">Counting Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Counting sort</span> assumes that you have a large dataset but not many unique values.
          For instance, if you had a long list of tasks with only priority 1–5 as integers.
        </p>
        <p className="lecture-paragraph">
          It works by iterating over the array while <span className="lecture-bold">counting</span> how many times each unique value appears,
          then placing them back onto the sorted array based on those counts.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="counting sort in Python"
          code={`def counting_sort(arr):
    if not arr:
        return arr
    min_val, max_val = min(arr), max(arr)
    count = [0] * (max_val - min_val + 1)

    for val in arr:
        count[val - min_val] += 1

    result = []
    for i, c in enumerate(count):
        result.extend([i + min_val] * c)
    return result`} />
      </section>

      {/* ── Radix Sort ── */}
      <section className="lecture-section mini-scroll" id="radix-sort">
        <h3 className="lecture-section-header">Radix Sort</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Radix sort</span> is a variation of counting sort. Items are placed into buckets based on a specific digit (or bit), then the next digit, and so on.
          It works best on data without many significant digits, like small integers and strings.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="radix sort (LSD) in Python"
          code={`def radix_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    for val in arr:
        idx = (val // exp) % 10
        count[idx] += 1

    for i in range(1, 10):
        count[i] += count[i - 1]

    for i in range(n - 1, -1, -1):
        idx = (arr[i] // exp) % 10
        output[count[idx] - 1] = arr[i]
        count[idx] -= 1

    for i in range(n):
        arr[i] = output[i]`} />
      </section>

      {/* ── Built in Sorts ── */}
      <section className="lecture-section mini-scroll" id="built-in-sorts">
        <h3 className="lecture-section-header">Built-in Sorts</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python provides two built-in ways to sort: the <span className="lecture-bold">sorted()</span> function (returns a new list) and the <span className="lecture-bold">.sort()</span> method (sorts in place).
          Under the hood, both use <span className="lecture-bold">Timsort</span> — a hybrid algorithm combining merge sort and insertion sort, designed for real-world data.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="using Python's built-in sort"
          code={`numbers = [64, 34, 25, 12, 22, 11, 90]

# sorted() returns a new list, original unchanged
sorted_nums = sorted(numbers)
print(sorted_nums)   # [11, 12, 22, 25, 34, 64, 90]
print(numbers)       # [64, 34, 25, 12, 22, 11, 90]

# .sort() modifies the list in place
numbers.sort()
print(numbers)       # [11, 12, 22, 25, 34, 64, 90]`} />

        <CodeBlock className="lecture-codeblock" language="python" caption="sorting with key functions"
          code={`# Sort strings by length
words = ["banana", "pie", "Washington", "a"]
print(sorted(words, key=len))
# ['a', 'pie', 'banana', 'Washington']

# Sort by a specific attribute
students = [("Alice", 88), ("Bob", 95), ("Charlie", 72)]
print(sorted(students, key=lambda s: s[1]))
# [('Charlie', 72), ('Alice', 88), ('Bob', 95)]

# Reverse sort
print(sorted(numbers, reverse=True))
# [90, 64, 34, 25, 22, 12, 11]`} />

        <div className="mb-4 mx-auto" style={{ maxWidth: '80%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header">Feature</th>
                <th className="lecture-table-header">sorted()</th>
                <th className="lecture-table-header">.sort()</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Returns</td><td className="lecture-table-cell">New sorted list</td><td className="lecture-table-cell">None (in place)</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Works on</td><td className="lecture-table-cell">Any iterable</td><td className="lecture-table-cell">Lists only</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Original</td><td className="lecture-table-cell">Unchanged</td><td className="lecture-table-cell">Modified</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Algorithm</td><td className="lecture-table-cell">Timsort</td><td className="lecture-table-cell">Timsort</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Complexity</td><td className="lecture-table-cell">O(n log n)</td><td className="lecture-table-cell">O(n log n)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Filtering Arrays ── */}
      <section className="lecture-section mini-scroll" id="filtering-arrays">
        <h3 className="lecture-section-header">Filtering Arrays</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Filtering is the process of selecting only the elements from a collection that meet a specific condition.
          Python offers several ways to filter lists without external libraries.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="filtering with a for loop"
          code={`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = []
for n in numbers:
    if n % 2 == 0:
        evens.append(n)
print(evens)  # [2, 4, 6, 8, 10]`} />

        <CodeBlock className="lecture-codeblock" language="python" caption="filtering with list comprehension"
          code={`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = [n for n in numbers if n % 2 == 0]
print(evens)   # [2, 4, 6, 8, 10]

# Multiple conditions
big_evens = [n for n in numbers if n % 2 == 0 and n > 5]
print(big_evens)   # [6, 8, 10]`} />

        <CodeBlock className="lecture-codeblock" language="python" caption="filtering with filter()"
          code={`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = list(filter(lambda n: n % 2 == 0, numbers))
print(evens)   # [2, 4, 6, 8, 10]

# Filter strings
words = ["hello", "", "world", "", "python"]
non_empty = list(filter(None, words))
print(non_empty)   # ["hello", "world", "python"]`} />

        <div className="mb-4 mx-auto" style={{ maxWidth: '80%' }}>
          <table className="lecture-table">
            <thead>
              <tr className="lecture-table-row">
                <th className="lecture-table-header">Method</th>
                <th className="lecture-table-header">Syntax</th>
                <th className="lecture-table-header">Returns</th>
                <th className="lecture-table-header">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row"><td className="lecture-table-cell">For loop</td><td className="lecture-table-cell consolas">for x in arr: if ...</td><td className="lecture-table-cell">New list</td><td className="lecture-table-cell">Complex logic</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">Comprehension</td><td className="lecture-table-cell consolas">[x for x in arr if ...]</td><td className="lecture-table-cell">New list</td><td className="lecture-table-cell">Simple conditions</td></tr>
              <tr className="lecture-table-row"><td className="lecture-table-cell">filter()</td><td className="lecture-table-cell consolas">filter(fn, arr)</td><td className="lecture-table-cell">Iterator</td><td className="lecture-table-cell">Reusable predicates</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </LectureTemplate>
  );
}

interface SortingLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function SortingLectureIcon(props: SortingLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Sorting and Filtering" summary="Learn how to sort and filter lists" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { SortingLecture, SortingLectureIcon };
