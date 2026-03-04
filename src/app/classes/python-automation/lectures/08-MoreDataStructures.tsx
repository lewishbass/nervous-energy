'use client';
import React, { useEffect } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { LectureEquation } from './lecture-components/LectureEquation';
import { GraphVisualizer, linkedListGraph, binaryTreeGraph, heapGraph } from './lecture-components/GraphVisualizer';

import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

interface MoreDataStructuresLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function MoreDataStructures(props: MoreDataStructuresLectureProps | null) {
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

  return (
    <MathJaxContext>
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Advanced Data Structures</h2>
        <h3 className="tc2 lecture-section-header">Performance, Algorithms, Accessing and Modifying</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You&#39;ll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('big-o-notation')}>Big O Notation</li>
          <li className="lecture-link" onClick={() => scrollToSection('graphs')}>Graphs</li>
          <li className="lecture-link" onClick={() => scrollToSection('linked-lists')}>Linked Lists</li>
          <li className="lecture-link" onClick={() => scrollToSection('binary-trees')}>Binary Trees</li>
          <li className="lecture-link" onClick={() => scrollToSection('heaps')}>Heaps</li>
          <li className="lecture-link" onClick={() => scrollToSection('hash-tables')}>Hash Tables</li>
          <li className="lecture-link" onClick={() => scrollToSection('hashing')}>Hashing</li>
        </ul>
      </section>

      {/* ── Big O Notation ── */}
      <section className="lecture-section mini-scroll" id="big-o-notation">
        <h3 className="lecture-section-header">Big O Notation</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          Modern computers are so fast that most problems can be solved with brute force.
          However, some problems increase exponentially with the size of the input, and if you aren&#39;t careful, simple operations can take years to run.
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Big O notation</span> describes how fast an algorithm&#39;s run time grows as the size of the input grows.
          <span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) = f(n) \\)'}</MathJax></span> where <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> is the size of the input, and <span className="lecture-equation-inline"><MathJax inline>{'\\( f(n) \\)'}</MathJax></span> is how many operations it takes to run as a function of <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span>.
        </p>

        <p className="lecture-paragraph">
          Operations can be <span className="lecture-bold">comparisons</span>, <span className="lecture-bold">memory access</span>, <span className="lecture-bold">math operations</span> or any basic operation that takes a <span className="lecture-bold">constant</span> amount of time to execute.
        </p>

        <p className="lecture-paragraph">
          It works by evaluating the behavior of the tail end of a function, and ignoring constant and linear factors.
        </p>

        <LectureEquation>
          <MathJax inline>{'\\( f(n) = O(g(n)) \\)'}</MathJax>
          <span> if there exists some constant </span>
          <MathJax inline>{'\\( c \\)'}</MathJax>
          <span> and index </span>
          <MathJax inline>{'\\( n_0 \\)'}</MathJax>
          <span> such that for all </span>
          <MathJax inline>{'\\( n > n_0 \\)'}</MathJax>
          <span>, </span>
          <MathJax inline>{'\\( f(n) \\leq c \\cdot g(n) \\)'}</MathJax>
        </LectureEquation>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Examples of Big O Simplification</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Expression</th>
                <th className="lecture-table-header">Simplifies To</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(10{,}000{,}000) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(584n + 863) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(82n^2 + 9000n + 100000) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n^2) \\)'}</MathJax></span></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(2^n + n^2) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(2^n) \\)'}</MathJax></span></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(0.0001n + 1{,}000{,}000) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log_{10}(n)) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          You can see that this isolates the term that becomes dominant as <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> approaches infinity, and ignores constant factors.
          You might think that <span className="lecture-equation-inline"><MathJax inline>{'\\( n^{1000} \\)'}</MathJax></span> dominates <span className="lecture-equation-inline"><MathJax inline>{'\\( 2^n \\)'}</MathJax></span> in <span className="lecture-equation-inline"><MathJax inline>{'\\( O(2^n + n^{1000}) \\)'}</MathJax></span>:
        </p>

        <LectureEquation>
          <MathJax inline>{'\\( f(n) = \\frac{2^n}{n^{1000}} \\)'}</MathJax>
          <span style={{ margin: '0 1.5rem' }} />
          <MathJax inline>{'\\( f(10) \\approx 10^{-997} \\)'}</MathJax>
          <span style={{ margin: '0 1.5rem' }} />
          <MathJax inline>{'\\( f(1023) \\approx 10^{7} \\)'}</MathJax>
        </LectureEquation>

        <p className="lecture-paragraph">
          The geometric term eventually grows to dominate the polynomial term no matter what.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Common Big O Complexities</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Big O</th>
                <th className="lecture-table-header">Name</th>
                <th className="lecture-table-header">Description</th>
                <th className="lecture-table-header">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#16a34a', fontWeight: 700 }}>Constant</td>
                <td className="lecture-table-cell">Always runs at the same speed regardless of input size</td>
                <td className="lecture-table-cell">Accessing an array element by index, adding to end of a list, checking if a number is even</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#22c55e', fontWeight: 700 }}>Logarithmic</td>
                <td className="lecture-table-cell">Grows slowly as input size increases</td>
                <td className="lecture-table-cell">Binary search in a sorted array, Euclid&#39;s GCD algorithm</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#65a30d', fontWeight: 700 }}>Linear</td>
                <td className="lecture-table-cell">Grows linearly with the size of the input</td>
                <td className="lecture-table-cell">Iterating through a list, finding the max in an unsorted array, vector addition</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n \\log n) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#ca8a04', fontWeight: 700 }}>Quasilinear</td>
                <td className="lecture-table-cell">Grows faster than linear but slower than quadratic</td>
                <td className="lecture-table-cell">Efficient sorting algorithms like mergesort and heapsort</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n^2) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#ea580c', fontWeight: 700 }}>Quadratic</td>
                <td className="lecture-table-cell">Grows quadratically with the size of the input</td>
                <td className="lecture-table-cell">Bubble sort, selection sort, insertion sort, checking all pairs for duplicates</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(2^n) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#dc2626', fontWeight: 700 }}>Exponential</td>
                <td className="lecture-table-cell">Grows exponentially with the size of the input</td>
                <td className="lecture-table-cell">Brute force traveling salesman, generating all subsets of a set</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(n!) \\)'}</MathJax></span></td>
                <td className="lecture-table-cell" style={{ color: '#991b1b', fontWeight: 700 }}>Factorial</td>
                <td className="lecture-table-cell">Grows factorially with the size of the input</td>
                <td className="lecture-table-cell">Brute force traveling salesman, generating all permutations of a set</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Graphs ── */}
      <section className="lecture-section mini-scroll" id="graphs">
        <h3 className="lecture-section-header">Graphs</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          A <span className="lecture-bold">graph</span> is a common computational structure that consists of <span className="lecture-bold">nodes</span> and <span className="lecture-bold">edges</span>.
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Nodes</span> can store data, have names, and represent places, people, words, concepts, or any other thing you can think of.
          <span className="lecture-bold"> Edges</span> represent relationships between nodes, and can be <span className="lecture-bold">directed</span> or <span className="lecture-bold">weighted</span>.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Directed</td>
                <td className="lecture-table-cell">Edges represent a one-way relationship - twitter follower, web page link, supply chain</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Undirected</td>
                <td className="lecture-table-cell">Relation between nodes is symmetric - facebook friend, neighbors, classmates</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">Weighted</td>
                <td className="lecture-table-cell">Edges have weights representing distance, strength, or cost - physical distance, travel time, similarity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Graph Examples</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Graph</th>
                <th className="lecture-table-header">Nodes</th>
                <th className="lecture-table-header">Edges</th>
                <th className="lecture-table-header">Directed</th>
                <th className="lecture-table-header">Weighted</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Country Map</td>
                <td className="lecture-table-cell">Cities</td>
                <td className="lecture-table-cell">Roads</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✓</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Twitter</td>
                <td className="lecture-table-cell">Users</td>
                <td className="lecture-table-cell">Follows</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">✗</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Traffic Flow</td>
                <td className="lecture-table-cell">Intersections</td>
                <td className="lecture-table-cell">Travel Time</td>
                <td className="lecture-table-cell">✓</td>
                <td className="lecture-table-cell">✓</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Word Similarity</td>
                <td className="lecture-table-cell">Words</td>
                <td className="lecture-table-cell">Shared Mentions</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✓</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Word Edit</td>
                <td className="lecture-table-cell">Words</td>
                <td className="lecture-table-cell">One Letter Difference</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✗</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Kevin Bacon</td>
                <td className="lecture-table-cell">Actors</td>
                <td className="lecture-table-cell">Co-appeared in a Movie</td>
                <td className="lecture-table-cell">✗</td>
                <td className="lecture-table-cell">✗</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Special Graphs</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Description</th>
                <th className="lecture-table-header">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Dense</td>
                <td className="lecture-table-cell">Every node is connected to every other node, <span className="lecture-equation-inline"><MathJax inline>{'\\( n^2 \\)'}</MathJax></span> edges</td>
                <td className="lecture-table-cell">NBA season matchups</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Bipartite</td>
                <td className="lecture-table-cell">Nodes divided into two groups; edges only connect nodes from different groups</td>
                <td className="lecture-table-cell">Actors and movies</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Tree</td>
                <td className="lecture-table-cell">One unique path between any two nodes, <span className="lecture-equation-inline"><MathJax inline>{'\\( n-1 \\)'}</MathJax></span> edges for <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> nodes</td>
                <td className="lecture-table-cell">Family trees, org charts</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">DAG</td>
                <td className="lecture-table-cell">Directed graph with no cycles; represents ordered relationships</td>
                <td className="lecture-table-cell">Crafting recipes, course prerequisites</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <GraphVisualizer
            graph={{
              nodes: [
                { id: 'alice',  label: 'Alice',  x: 50, y: 15 },
                { id: 'bob',    label: 'Bob',    x: 15, y: 45 },
                { id: 'carol',  label: 'Carol',  x: 85, y: 45 },
                { id: 'dave',   label: 'Dave',   x: 10, y: 85 },
                { id: 'eve',    label: 'Eve',    x: 50, y: 88 },
                { id: 'frank',  label: 'Frank',  x: 90, y: 85 },
              ],
              edges: [
                { source: 'alice', target: 'bob',   directed: true },
                { source: 'alice', target: 'carol',  directed: true },
                { source: 'bob',   target: 'alice',  directed: true },
                { source: 'bob',   target: 'dave',   directed: true },
                { source: 'carol', target: 'frank',  directed: true },
                { source: 'carol', target: 'bob',    directed: true },
                { source: 'dave',  target: 'eve',    directed: true },
                { source: 'eve',   target: 'alice',  directed: true },
                { source: 'eve',   target: 'carol',  directed: true },
                { source: 'frank', target: 'alice',  directed: true },
              ],
            }}
            height={280}
            nodeRadius={32}
            fontSize={13}
            caption="A directed graph of Twitter follows - arrows show who follows whom"
          />
        </div>
      </section>
      
      {/* ── Linked Lists ── */}
      <section className="lecture-section mini-scroll" id="linked-lists">
        <h3 className="lecture-section-header">Linked Lists</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Linked lists</span> are a graph used to store data in a chain of nodes and edges.
          The node at the start is called the <span className="lecture-bold">root node</span> or <span className="lecture-bold">head</span>.
          Each node has a value and a directed edge to the next node in the list.
          They can be traversed by starting at the head and following the edges one by one until you reach the desired element.
        </p>

          <div className="mb-4 mx-auto">
            <GraphVisualizer
              graph={linkedListGraph([3, 7, 1, 9, 4])}
              height={120}
              directed
              caption="A linked list - the highlighted node is the head"
            />
          </div>
      </section>

      {/* ── Binary Trees ── */}
      <section className="lecture-section mini-scroll" id="binary-trees">
        <h3 className="lecture-section-header">Binary Trees</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          A <span className="lecture-bold">binary tree</span> is a <span className="lecture-bold">directed tree</span> graph and a data structure used to sort and store data.
          It is like a linked list, but each node has two children instead of one.
        </p>

          <div className="mb-4 mx-auto">
            <GraphVisualizer
              graph={binaryTreeGraph([50, 25, 75, 12, 37, 62, 87])}
              height={260}
              directed
              caption="A balanced binary search tree - left children are less, right children are greater"
            />
          </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Definitions</span>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Depth</td>
                <td className="lecture-table-cell">The number of edges from a node to the root</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Height</td>
                <td className="lecture-table-cell">The depth of the deepest node in the tree</td>
              </tr>
              <tr className="">
                <td className="lecture-table-header">Leaf</td>
                <td className="lecture-table-cell">A node with no children</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          The left child is always less than the parent, and the right child is always greater than the parent.
          This makes it easy to search for and insert new values in a tree.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Search Algorithm</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Step</th>
                <th className="lecture-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">1</td>
                <td className="lecture-table-cell">Start at the head node and compare the value to the current node</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">2</td>
                <td className="lecture-table-cell">If the value is less than the current node, follow the left edge to the left child</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">3</td>
                <td className="lecture-table-cell">If the value is greater than the current node, follow the right edge to the right child</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">4</td>
                <td className="lecture-table-cell">Repeat until you find the value, or reach a leaf node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          A full binary tree of depth <span className="lecture-equation-inline"><MathJax inline>{'\\( d \\)'}</MathJax></span> has <span className="lecture-equation-inline"><MathJax inline>{'\\( 2^{d+1} - 1 \\)'}</MathJax></span> nodes.
          A balanced binary tree with <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> nodes has a depth of <span className="lecture-equation-inline"><MathJax inline>{'\\( \\log_2(n+1) - 1 \\)'}</MathJax></span>.
          Searching for an entry will cover at most the depth of the tree, so it has a time complexity of <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span>.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Add Value Algorithm</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Step</th>
                <th className="lecture-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">1</td>
                <td className="lecture-table-cell">Search for the value you want to add</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">2</td>
                <td className="lecture-table-cell">Record the last leaf node you visit before reaching a null value</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">3</td>
                <td className="lecture-table-cell">If the value is less than the last leaf node, add it as the left child</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">4</td>
                <td className="lecture-table-cell">If the value is greater than the last leaf node, add it as the right child</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Adding a value to a binary tree also has a time complexity of <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span> because it consists of a search followed by a constant time operation to add the new node.
          To build a tree from nothing using <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> values, it will take <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span> to add each value and you must add <span className="lecture-equation-inline"><MathJax inline>{'\\( n \\)'}</MathJax></span> values, so it will take <span className="lecture-equation-inline"><MathJax inline>{'\\( O(n \\log n) \\)'}</MathJax></span> time to build a tree from an unsorted list.
          Once the tree is built, you can read its values in order to get a sorted list in <span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span> time.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Sorting with a Binary Tree</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Steps</th>
                <th className="lecture-table-header">Time Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Search for location → append value → repeat for all values → read tree in order</td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( (O(\\log n) + O(1)) \\times n + O(n) = O(n \\log n) \\)'}</MathJax></span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          The shape of the tree depends on the order the values are added. If you add values from a pre-sorted list, you will end up with a lopsided tree that is essentially a linked list, and searching for values will take <span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span> time instead of <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span>.
        </p>

          <div className="mb-4 mx-auto">
            <GraphVisualizer
              graph={binaryTreeGraph([1, 2, 3, 4, 5])}
              height={300}
              directed
              caption="A lopsided tree built from sorted input - degenerates into a linked list"
            />
          </div>
      </section>

      {/* ── Heaps ── */}
      <section className="lecture-section mini-scroll" id="heaps">
        <h3 className="lecture-section-header">Heaps</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          A <span className="lecture-bold">heap</span> is similar to a binary tree, but designed to remain balanced.
        </p>

        <p className="lecture-paragraph">
          Instead of requiring the left and right child to be greater and less than the parent, it requires that they are <span className="lecture-bold">both less than the parent</span>.
          This means that the largest value is always at the root of the tree.
        </p>

          <div className="mb-4 mx-auto">
            <GraphVisualizer
              graph={heapGraph([4, 10, 3, 5, 1, 8, 7])}
              height={250}
              directed
              caption="A max heap - the highlighted root always holds the largest value"
            />
          </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Add Value Algorithm</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Step</th>
                <th className="lecture-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">1</td>
                <td className="lecture-table-cell">Add the new value as a leaf at the end of the tree</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">2</td>
                <td className="lecture-table-cell">Compare it to its parent</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">3</td>
                <td className="lecture-table-cell">If it is greater than its parent, swap it with its parent</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">4</td>
                <td className="lecture-table-cell">If it is less than its parent, stop</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          This takes <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span> time, while preventing the tree from becoming lopsided.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Remove Max Value Algorithm</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Step</th>
                <th className="lecture-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">1</td>
                <td className="lecture-table-cell">Remove the root node and set it to none</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">2</td>
                <td className="lecture-table-cell">Swap the none value with the greater of its children</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">3</td>
                <td className="lecture-table-cell">Keep swapping until you reach the end of the tree</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Sorting with a Heap</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Steps</th>
                <th className="lecture-table-header">Time Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Add value to the heap → repeat for each element → remove root element → repeat until heap is empty</td>
                <td className="lecture-table-cell"><span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\times n + O(\\log n) \\times n = O(n \\log n) \\)'}</MathJax></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Hash Tables ── */}
      <section className="lecture-section mini-scroll" id="hash-tables">
        <h3 className="lecture-section-header">Hash Tables</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          If you have a dataset you want to store and access by a key - for example, students have a <span className="lecture-bold">name</span> and an <span className="lecture-bold">SSN</span> - you want to find a student&#39;s name given their SSN, i.e. index the information by SSN.
        </p>

        <p className="lecture-paragraph">
          You could store the data in an unordered list, but searching for a student would require iterating over each student - <span className="lecture-equation-inline"><MathJax inline>{'\\( O(n) \\)'}</MathJax></span>:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="linear search - O(n)"
          code={`def findStudent(ssn):
    for i in range(len(students)):
        if students[i].ssn == ssn:
            return students[i].name
    return None`} />

        <p className="lecture-paragraph">
          If you sort the list by SSN, you can use binary search to find a student in <span className="lecture-equation-inline"><MathJax inline>{'\\( O(\\log n) \\)'}</MathJax></span> time:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="binary search - O(log n)"
          code={`def findStudent(ssn):
    left, right = 0, len(students) - 1
    while left <= right:
        mid = (left + right) // 2
        if students[mid].ssn == ssn:
            return students[mid].name
        elif students[mid].ssn < ssn:
            left = mid + 1
        else:
            right = mid - 1
    return None`} />

        <p className="lecture-paragraph">
          Each SSN is unique, so you could use it to directly represent an index in a very long (mostly empty) list. This works in <span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span> time, but requires a huge amount of memory:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="direct indexing - O(1) but huge memory"
          code={`def findStudent(ssn):
    return students[ssn]`} />

        <p className="lecture-paragraph">
          A <span className="lecture-bold">hash table</span> is a way to keep this <span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span> time complexity without using a huge amount of memory.
          The idea is to use a <span className="lecture-bold">hash function</span> to map the SSNs which range from 000-00-0000 to 999-99-9999 into a smaller range of indices, for example 0–999.
        </p>

        <LectureEquation>
          <MathJax inline>{'\\( \\text{hash}(ssn) = ssn \\bmod 1000 \\)'}</MathJax>
        </LectureEquation>

        <CodeBlock className="lecture-codeblock" language="python" caption="hash table lookup - O(1)"
          code={`def findStudent(ssn):
    index = ssn % 1000
    return students[index]`} />

        <p className="lecture-paragraph">
          This stores all our students in a much smaller list, using less memory, and is still accessible in <span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span> time.
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">Wait!</span> What if two students have the same last three digits of their SSN?
          <code className="lecture-code-inline">findStudent(123456789)</code> would return the same data as <code className="lecture-code-inline">findStudent(987654321)</code>.
          This is called a <span className="lecture-bold">collision</span>, and is a common problem with hash tables. It can be solved in two ways:
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">1. Chaining (Buckets):</span> Instead of storing a single student at each index, store a list or <span className="lecture-bold">bucket</span> of students:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="collision handling - chaining"
          code={`def findStudent(ssn):
    index = ssn % 1000
    bucket = students[index]
    for student in bucket:
        if student.ssn == ssn:
            return student.name
    return None`} />

        <p className="lecture-paragraph">
          This uses some brute strength to search the buckets, but each bucket is so small that if the students are stored in a binary tree it is still <span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span> time on average.
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">2. Open Addressing:</span> When you go to insert a student at <code className="lecture-code-inline">students[index]</code>, check if the index is already occupied. If it is, find the next open index and insert the student there. When you search, if the index is occupied by a different student, keep searching until you find the right student or an empty index:
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="collision handling - open addressing"
          code={`def findStudent(ssn):
    index = ssn % 1000
    while students[index] is not None:
        if students[index].ssn == ssn:
            return students[index].name
        index = (index + 1) % 1000  # wrap around
    return None`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">Open addressing</span> is more memory efficient than using buckets, but can lead to long search times if there are many collisions.
          If the probing is implemented in a smarter manner, this is still <span className="lecture-equation-inline"><MathJax inline>{'\\( O(1) \\)'}</MathJax></span> time and more memory efficient than chaining.
          Python uses a slightly more complicated version of open addressing to implement its built-in dictionaries.
        </p>
      </section>

      {/* ── Hashing ── */}
      <section className="lecture-section mini-scroll" id="hashing">
        <h3 className="lecture-section-header">Hashing</h3>
        <div className="lecture-header-decorator" />

        <p className="lecture-paragraph">
          In our student/SSN scenario, mapping the SSN onto the index of a small array is easy. But what if a student walks into the office and wants to know their lunch money balance?
          You ask the student for their SSN to look them up in the system, and they immediately reply - <span className="lecture-bold">&ldquo;My what?&rdquo;</span>
        </p>

        <p className="lecture-paragraph">
          One solution is to assign them a unique student ID number and keep it on a student ID card.
          A better solution is to index the data using their <span className="lecture-bold">name</span>.
          But how do we map a name (a string) onto the index of an array (an integer)?
        </p>

        <p className="lecture-paragraph">
          A true <span className="lecture-bold">hash function</span> should evenly distribute all kinds of data of different types and lengths across a fixed range of indices, and be fast to compute.
          Python uses <span className="lecture-bold">SipHash</span>, which takes the binary representation of the string, interprets it as an integer, and then performs a series of cryptographic operations to produce a hash value that is uniformly distributed across the range of possible hash values.
        </p>

        <div className="mb-4 mx-auto">
          <span className="lecture-link">Dictionaries with Non-Integer Keys</span>
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Use Case</th>
                <th className="lecture-table-header">Key</th>
                <th className="lecture-table-header">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">DNS Lookup</td>
                <td className="lecture-table-cell">Domain name</td>
                <td className="lecture-table-cell">IP address</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Filesystem</td>
                <td className="lecture-table-cell">File name</td>
                <td className="lecture-table-cell">File data</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Stock Market</td>
                <td className="lecture-table-cell">Stock ticker</td>
                <td className="lecture-table-cell">Price quote</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Social Media</td>
                <td className="lecture-table-cell">Username</td>
                <td className="lecture-table-cell">User data</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Email</td>
                <td className="lecture-table-cell">Email address</td>
                <td className="lecture-table-cell">Inbox data</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Log In System</td>
                <td className="lecture-table-cell">Username</td>
                <td className="lecture-table-cell">Password hash</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Since hash functions are <span className="lecture-bold">not injective</span> (not one-to-one), two different inputs can produce the same output and cause collisions.
          These collisions are expected and accounted for, but if many inputs collide at a single point, it can cause the table to perform slowly.
          If a malicious actor can find out what hash function we are using, they can intentionally create entries that cause collisions, slowing down the system.
        </p>

        <p className="lecture-paragraph">
          This isn&#39;t just a hypothetical with students and lunch money - hash maps are used to map domain names to IP addresses, manage filesystems, stock market data, banking, medical records, government data...
          If unprotected, a single person could take down shopping platforms, traffic lights, or stall a whole area&#39;s internet by sending lots of colliding requests.
        </p>

        <p className="lecture-paragraph">
          To protect against this, dictionaries that use hash tables keep a <span className="lecture-bold">secret key</span> that is used to <span className="lecture-bold">salt</span> the hash function - affecting it randomly - so that even if the attacker knows what function you use, they can&#39;t easily create collisions.
        </p>
      </section>
    </LectureTemplate>
    </MathJaxContext>
  );
}

interface MoreDataStructuresLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function MoreDataStructuresIcon(props: MoreDataStructuresLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="More Data Structures" summary="Big O notation, graphs, linked lists, trees, heaps, and hash tables." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { MoreDataStructures, MoreDataStructuresIcon };
