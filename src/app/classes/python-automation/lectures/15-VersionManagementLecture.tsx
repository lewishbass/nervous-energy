'use client';

import React, { useState, useEffect } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import Prism from 'prismjs';
import { CodeBlock } from '@/components/CodeBlock';
import { copyToClipboard } from '@/scripts/clipboard';
import GraphVisualizer, { type GraphData } from './lecture-components/GraphVisualizer';

import '@/styles/code.css';
import './lecture.css';

interface VersionManagementLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function VersionManagementLecture(props: VersionManagementLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  // 4/6/2026 8 pm EST (UTC-5) = 2026-04-07T01:00:00Z
  const UNLOCK_TIME = new Date('2026-01-07T01:00:00Z');
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
    setSolutionsUnlocked(new Date() >= UNLOCK_TIME);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  /* ── Graph data for edit history (linear) ── */
  const editHistoryGraph: GraphData = {
    nodes: [
      { id: 'blank', label: 'Blank', x: 5, y: 50, color: '#94a3b8' },
      { id: 'e1', label: 'Edit 1', x: 24, y: 50 },
      { id: 'e2', label: 'Edit 2', x: 43, y: 50 },
      { id: 'e3', label: 'Edit 3', x: 62, y: 50 },
      { id: 'e4', label: 'Edit 4', x: 81, y: 50 },
      { id: 'now', label: 'Now', x: 97, y: 50, highlight: true },
    ],
    edges: [
      { source: 'blank', target: 'e1', directed: true },
      { source: 'e1', target: 'e2', directed: true },
      { source: 'e2', target: 'e3', directed: true },
      { source: 'e3', target: 'e4', directed: true },
      { source: 'e4', target: 'now', directed: true },
    ],
  };

  /* ── Graph data for clone → commit → push flow ── */
  const commitFlowGraph: GraphData = {
    nodes: [
      { id: 'origin1', label: 'Origin', x: 50, y: 5, color: '#6366f1' },
      { id: 'clone', label: 'Clone', x: 25, y: 22, color: '#10b981' },
      { id: 'c1', label: 'Commit', x: 25, y: 40, color: '#10b981' },
      { id: 'c2', label: 'Commit', x: 25, y: 58, color: '#10b981' },
      { id: 'c3', label: 'Commit', x: 25, y: 76, color: '#10b981' },
      { id: 'push', label: 'Push', x: 50, y: 92, color: '#f59e0b' },
      { id: 'origin2', label: 'Origin', x: 50, y: 22, color: '#6366f1' },
      { id: 'origin3', label: 'Origin', x: 50, y: 40, color: '#6366f1' },
      { id: 'origin4', label: 'Origin', x: 50, y: 58, color: '#6366f1' },
      { id: 'origin5', label: 'Origin', x: 50, y: 76, color: '#6366f1' },
    ],
    edges: [
      { source: 'origin1', target: 'clone', directed: true, label: 'clone' },
      { source: 'origin1', target: 'origin2', directed: true },
      { source: 'clone', target: 'c1', directed: true },
      { source: 'origin2', target: 'origin3', directed: true },
      { source: 'c1', target: 'c2', directed: true },
      { source: 'origin3', target: 'origin4', directed: true },
      { source: 'c2', target: 'c3', directed: true },
      { source: 'origin4', target: 'origin5', directed: true },
      { source: 'c3', target: 'push', directed: true, label: 'push' },
      { source: 'origin5', target: 'push', directed: true },
    ],
  };

  /* ── Graph data for branch & merge ── */
  const branchMergeGraph: GraphData = {
    nodes: [
      { id: 'm1', label: 'Main', x: 50, y: 5, color: '#6366f1' },
      { id: 'a1', label: 'Alice', x: 25, y: 20, color: '#10b981' },
      { id: 'b1', label: 'Bob', x: 75, y: 20, color: '#f59e0b' },
      { id: 'm2', label: 'Main', x: 50, y: 20, color: '#6366f1' },
      { id: 'a2', label: 'A-2', x: 25, y: 38, color: '#10b981' },
      { id: 'b2', label: 'B-2', x: 75, y: 38, color: '#f59e0b' },
      { id: 'm3', label: 'Main', x: 50, y: 38, color: '#6366f1' },
      { id: 'a3', label: 'A-3', x: 25, y: 56, color: '#10b981' },
      { id: 'b3', label: 'B-3', x: 75, y: 56, color: '#f59e0b' },
      { id: 'm4', label: 'Main', x: 50, y: 56, color: '#6366f1' },
      { id: 'merge_a', label: 'Merge', x: 50, y: 74, highlight: true },
      { id: 'merge_b', label: 'Merge', x: 50, y: 92, highlight: true },
    ],
    edges: [
      { source: 'm1', target: 'a1', directed: true, label: 'pull' },
      { source: 'm1', target: 'b1', directed: true, label: 'pull' },
      { source: 'm1', target: 'm2', directed: true },
      { source: 'a1', target: 'a2', directed: true },
      { source: 'b1', target: 'b2', directed: true },
      { source: 'm2', target: 'm3', directed: true },
      { source: 'a2', target: 'a3', directed: true },
      { source: 'b2', target: 'b3', directed: true },
      { source: 'm3', target: 'm4', directed: true },
      { source: 'a3', target: 'merge_a', directed: true, label: 'push' },
      { source: 'm4', target: 'merge_a', directed: true },
      { source: 'b3', target: 'merge_b', directed: true, label: 'push' },
      { source: 'merge_a', target: 'merge_b', directed: true },
    ],
  };

  /* ── Graph data for diverging branches ── */
  const divergingBranchGraph: GraphData = {
    nodes: [
      { id: 'm1', label: 'Main', x: 50, y: 5, color: '#6366f1' },
      { id: 'a1', label: 'Alice', x: 25, y: 18, color: '#10b981' },
      { id: 'f1', label: 'Fork', x: 80, y: 18, color: '#ef4444' },
      { id: 'm2', label: 'Main', x: 50, y: 18, color: '#6366f1' },
      { id: 'a2', label: 'A-2', x: 25, y: 34, color: '#10b981' },
      { id: 'f2', label: 'F-2', x: 80, y: 34, color: '#ef4444' },
      { id: 'm3', label: 'Main', x: 50, y: 34, color: '#6366f1' },
      { id: 'merge_a', label: 'Merge', x: 50, y: 50, highlight: true },
      { id: 'f3', label: 'F-3', x: 80, y: 50, color: '#ef4444' },
      { id: 'm4', label: 'Main', x: 50, y: 66, color: '#6366f1' },
      { id: 'f4', label: 'F-4', x: 80, y: 66, color: '#ef4444' },
      { id: 'm5', label: 'Main', x: 50, y: 82, color: '#6366f1' },
      { id: 'f5', label: 'F-5', x: 80, y: 82, color: '#ef4444' },
    ],
    edges: [
      { source: 'm1', target: 'a1', directed: true },
      { source: 'm1', target: 'f1', directed: true },
      { source: 'm1', target: 'm2', directed: true },
      { source: 'a1', target: 'a2', directed: true },
      { source: 'f1', target: 'f2', directed: true },
      { source: 'm2', target: 'm3', directed: true },
      { source: 'a2', target: 'merge_a', directed: true, label: 'push' },
      { source: 'm3', target: 'merge_a', directed: true },
      { source: 'f2', target: 'f3', directed: true },
      { source: 'merge_a', target: 'm4', directed: true },
      { source: 'f3', target: 'f4', directed: true },
      { source: 'm4', target: 'f4', directed: true, label: 'pull' },
      { source: 'm4', target: 'm5', directed: true },
      { source: 'f4', target: 'f5', directed: true },
    ],
  };

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Version Management with Git</h2>
        <h3 className="tc2 lecture-section-header">Track and manage changes to your code</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You&apos;ll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('what-is-version-management')}>What is Version Management?</li>
          <li className="lecture-link" onClick={() => scrollToSection('ctrl-z-and-ctrl-y')}>CTRL-Z and CTRL-Y</li>
          <li className="lecture-link" onClick={() => scrollToSection('how-version-management-works')}>How Version Management Works</li>
          <li className="lecture-link" onClick={() => scrollToSection('simple-git-repository')}>Simple Git Repository</li>
          <li className="lecture-link" onClick={() => scrollToSection('branches')}>Branches</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-1')}>Exercise 1 — Clone and Push</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-2')}>Exercise 2 — Tic-Tac-Toe</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-3')}>Exercise 3 — Weather API</li>
        </ul>
      </section>

      {/* What is Version Management? */}
      <section className="lecture-section mini-scroll" id="what-is-version-management">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>What is Version Management?</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          When working on a group project, we often use tools like Google Docs/Slides that allow people to see each others changes in real time.
          This allows each person to work on individual parts of the document while observing how their work fits into the larger project.
          People can correct each others work, add content, and make sure the project is progressing smoothly without needing to constantly ask each other for updates.
        </p>
        <p className="lecture-paragraph">
          This real time collaboration is useful for smaller team projects, but what about much larger projects, that might span over years, contain many files and have entire separate teams working on different parts of the project?
        </p>
        <p className="lecture-paragraph">
          If multiple people try to edit the same program file at the same time, when <span className="lecture-bold">George</span> tries to run the script to test his math implementation, it might not work because <span className="lecture-bold">Alice</span> is in the middle of changing the way the program handles user input.
        </p>
        <p className="lecture-paragraph">
          If <span className="lecture-bold">Alice</span> reworks the user input system, but realizes later that her changes break the math implementation, how can she easily revert her changes without needing to manually undo all of her code edits?
        </p>
        <p className="lecture-paragraph">
          If <span className="lecture-bold">Joe</span> makes his own version of the program based on <span className="lecture-bold">Alice</span> and <span className="lecture-bold">George&apos;s</span> work, but then <span className="lecture-bold">Alice</span> and <span className="lecture-bold">George</span> fix a deadly security risk, how does <span className="lecture-bold">Joe</span> update his version without needing to manually copy over all of the changes across all of the files?
        </p>
        <p className="lecture-paragraph">
          If the intern <span className="lecture-bold">Jeff</span> accidentally deletes the entire project, how do we undo that and find out who did it?
        </p>
        <p className="lecture-paragraph">
          Additionally if <span className="lecture-bold">Jeff</span> is assigned to work on something low stakes like adding colors to the buttons, but gets too big for his britches, how do we make sure he doesn&apos;t do something stupid like rewrite the user password system without anyone noticing?
        </p>
        <p className="lecture-paragraph">
          If we removed an obsolete feature like floppy disk support, but someone realizes they need to use a floppy disk, how do they find and access the old version that still has floppy disk support?
        </p>
        <p className="lecture-paragraph">
          <span className="lecture-bold">Version Control</span> is a system designed to manage individual contributions to large projects through a set of rules for combining and tracking changes to files.
        </p>
      </section>

      {/* CTRL-Z and CTRL-Y */}
      <section className="lecture-section mini-scroll" id="ctrl-z-and-ctrl-y">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>CTRL-Z and CTRL-Y</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The simplest version control system you might be familiar with is the undo and redo buttons found in many programs.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Action</th>
                <th className="lecture-table-header">Shortcut</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Undo</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">CTRL-Z</code></td>
                <td className="lecture-table-cell">Reverts the most recent change, allowing you to step back through your edit history one change at a time.</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Redo</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">CTRL-Y</code></td>
                <td className="lecture-table-cell">Reapplies the most recently undone change, allowing you to step forward through your edit history if you undo something by mistake.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Internally, the program keeps track of recent edits, and when they are undone, applies the <span className="lecture-bold">inverse</span> of the edit to the document.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Edit</th>
                <th className="lecture-table-header">Inverse</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Types &quot;hello&quot; on line 1 row 5</td>
                <td className="lecture-table-cell">Deletes 5 letters from line 1 row 5</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Deletes line 3 &quot;quote the raven&quot;</td>
                <td className="lecture-table-cell">Inserts &quot;quote the raven&quot; at line 3</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Changes font from Arial to Times New Roman</td>
                <td className="lecture-table-cell">Changes font from Times New Roman to Arial</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Moves a picture from (124, 420) to (500, 500)</td>
                <td className="lecture-table-cell">Moves the picture from (500, 500) back to (124, 420)</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Scales a shape from 100% to 150%</td>
                <td className="lecture-table-cell">Scales the shape from 150% back down to 100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Each edit or change can be applied forwards or backwards, and represent anything from text edits to pictures, formatting and objects.
          This allows programs to effectively store a <span className="lecture-bold">timeline</span> of all edits to your project.
        </p>
        <p className="lecture-paragraph">
          By starting at blank, and applying all these edits in order, you can reconstruct the entire history of the project step by step.
        </p>

        <GraphVisualizer
          graph={editHistoryGraph}
          height={120}
          directed
          caption="a linear edit history — each node is a change to the project"
          className="my-4"
          nodeRadius={30}
          fontSize={12}
        />

        <p className="lecture-paragraph">
          Additionally, storing a history of edits to the project is computationally cheaper than storing a snapshot of the project after every change.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Edit Name</th>
                <th className="lecture-table-header">Edit Size</th>
                <th className="lecture-table-header">Snapshot Size</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Type &quot;hello&quot; on line 1 row 5</td>
                <td className="lecture-table-cell">10 bytes</td>
                <td className="lecture-table-cell">10 KB</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Deletes line 3 &quot;quote the raven&quot;</td>
                <td className="lecture-table-cell">20 bytes</td>
                <td className="lecture-table-cell">9.98 KB</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Changes font from Arial to Times New Roman</td>
                <td className="lecture-table-cell">5 bytes</td>
                <td className="lecture-table-cell">9.985 KB</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Moves a picture from (124, 420) to (500, 500)</td>
                <td className="lecture-table-cell">15 bytes</td>
                <td className="lecture-table-cell">9.97 KB</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Scales a shape from 100% to 150%</td>
                <td className="lecture-table-cell">8 bytes</td>
                <td className="lecture-table-cell">9.962 KB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          This is the base concept behind version control — by adding additional data to each edit, we can apply this whole system in a <span className="lecture-bold">non-linear</span> fashion to larger projects.
        </p>
      </section>

      {/* How Version Management Works */}
      <section className="lecture-section mini-scroll" id="how-version-management-works">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>How Version Management Works</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Version Control works by storing the definitive copy of the project, and history of all changes, on an external server (like GitHub).
          When you want to make changes to the project, you first download or <span className="lecture-bold">clone</span> the project to your local computer, and then make changes to the files on your computer.
        </p>
        <p className="lecture-paragraph">
          When you want to save your changes to the project, you <span className="lecture-bold">commit</span> your changes, which packages your changes along with some metadata about the changes.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Metadata</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Commit Message</td>
                <td className="lecture-table-cell">A short description of what you changed, written by you</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Author</td>
                <td className="lecture-table-cell">Your name and email address</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Timestamp</td>
                <td className="lecture-table-cell">The date and time the commit was made</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Hash</td>
                <td className="lecture-table-cell">A unique identifier for this commit (e.g. <code className="lecture-code-inline">a3f7b2c</code>)</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Parent Hash</td>
                <td className="lecture-table-cell">The hash of the previous commit this one is based on</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Commit messages are important, as they describe what you changed, and are essential for going back to revert changes, remember your work, or communicating to your teammates what you did.
        </p>
        <p className="lecture-paragraph">
          When you are done making changes, you <span className="lecture-bold">push</span> your commits to the server. This stores a snapshot of the previous version of the project and applies your changes to the project on the server, making it available for everyone else to see and use.
        </p>
        <p className="lecture-paragraph">
          When you want to get the latest version of the project, you <span className="lecture-bold">pull</span> from the server, which downloads all the latest changes other people have performed and applies them to your local copy of the project.
        </p>

        <GraphVisualizer
          graph={commitFlowGraph}
          height={380}
          directed
          caption="clone the project, make commits locally, then push them back to the origin"
          className="my-4"
          nodeRadius={30}
          fontSize={12}
        />

        <p className="lecture-paragraph">
          If mistakes are made, you can view the history of commits to the project and <span className="lecture-bold">revert</span> to a previous version of the project before the mistake was made, or even revert just the specific commit that introduced the mistake without losing all the other work done after that.
        </p>
      </section>

      {/* Simple Git Repository */}
      <section className="lecture-section mini-scroll" id="simple-git-repository">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Simple Git Repository</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Git</span> is a popular version control system, and its sister website <span className="lecture-bold">GitHub</span> is one of the most popular ways to host Git repositories.
        </p>
        <p className="lecture-paragraph">
          Once you publish a repository to GitHub, you can pull and edit it from any computer, and share it with anyone else in the world.
        </p>
        <p className="lecture-paragraph">
          The <span className="lecture-bold">CLI</span> is the original way to interact with Git, but there are several <span className="lecture-bold">GUIs</span> that allow for better visualization of the commit history and easier access to Git&apos;s features, without needing to remember all the commands.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Command</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git init</code></td>
                <td className="lecture-table-cell">Initialize a new Git repository in the current directory</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git clone &lt;url&gt;</code></td>
                <td className="lecture-table-cell">Download a repository from a remote server</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git status</code></td>
                <td className="lecture-table-cell">Show the current state of your working directory and staged changes</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git add &lt;file&gt;</code></td>
                <td className="lecture-table-cell">Stage a file for the next commit</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git commit -m &quot;msg&quot;</code></td>
                <td className="lecture-table-cell">Save staged changes with a descriptive message</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git push</code></td>
                <td className="lecture-table-cell">Upload your commits to the remote server</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git pull</code></td>
                <td className="lecture-table-cell">Download and apply the latest changes from the remote server</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git log</code></td>
                <td className="lecture-table-cell">View the commit history of the repository</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git diff</code></td>
                <td className="lecture-table-cell">Show changes between your working directory and the last commit</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">git revert &lt;hash&gt;</code></td>
                <td className="lecture-table-cell">Create a new commit that undoes the changes from a specific commit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          We will be using VS Code&apos;s built-in Git GUI for the exercises.
        </p>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Open the folder you want to track changes in</li>
          <li>Navigate to the <span className="lecture-bold">Source Control</span> tab on the left sidebar</li>
          <li>Click <span className="lecture-bold">&quot;Initialize Repository&quot;</span></li>
          <li>Set your username and email in the terminal:
            <CodeBlock className="lecture-codeblock" language="bash" caption="configure your Git identity"
              code={`git config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"`} />
            GitHub uses this information to assign <span className="lecture-bold">blame</span> to commits.
          </li>
          <li>Observe the staged changes — this should indicate for each file in the repository that is being added</li>
          <li>Type <span className="lecture-bold">&quot;Initial Commit&quot;</span> into the message box and click <span className="lecture-bold">Commit</span></li>
          <li>Open a file in the repository, make some changes. Click on the file in the changes section to view a <span className="lecture-bold">diff</span> of the changes you made. Add a message and commit the changes.</li>
        </ul>
      </section>

      {/* Branches */}
      <section className="lecture-section mini-scroll" id="branches">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Branches</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          When you clone a repository, you are creating a local <span className="lecture-bold">branch</span> of the project.
          This is its own small, independent version of the project that you can make changes to without affecting the main version.
        </p>
        <p className="lecture-paragraph">
          When you <span className="lecture-bold">push</span> your changes to the server, it performs a <span className="lecture-bold">merge</span>, which combines your changes with the main version of the project on the server.
          This is an important operation, as someone else might have edited the same file, and Git needs to know how to combine the changes without losing any work.
        </p>
        <p className="lecture-paragraph">
          If Git can&apos;t automatically merge the changes, it will indicate that there is a <span className="lecture-bold">merge conflict</span>, and you will need to manually resolve the conflict by choosing which changes to keep.
        </p>

        <GraphVisualizer
          graph={branchMergeGraph}
          height={380}
          directed
          caption="Alice and Bob both branch off, make commits, and merge back to Main"
          className="my-4"
          nodeRadius={28}
          fontSize={12}
        />

        <p className="lecture-paragraph">
          Not all branches are meant to be merged back to the main branch. Some diverge so much that they are essentially their own separate version of the project, while optionally pulling updates from the main branch to stay up to date with the latest changes.
        </p>

        <GraphVisualizer
          graph={divergingBranchGraph}
          height={380}
          directed
          caption="Alice merges back, while the fork diverges and only occasionally pulls from Main"
          className="my-4"
          nodeRadius={28}
          fontSize={12}
        />
      </section>

      {/* Exercise 1 */}
      <section className="lecture-section mini-scroll" id="exercise-1">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 1 — Clone and Push</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Clone a Git repository, add a file, edit a file, and push your changes.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Open the command palette with <code className="lecture-code-inline">CTRL-SHIFT-P</code>, and select <span className="lecture-bold">&quot;Git: Clone&quot;</span>.
          </li>
          <li className="lecture-exercise-item">
            Type in the URL:
            <span onClick={() => copyToClipboard('https://github.com/lewishbass/GitExample.git')} className="cursor-pointer select-none font-bold text-blue-500 ml-2">https://github.com/lewishbass/GitExample.git</span>
            <br />and select a folder to clone the repository into.
          </li>
          <li className="lecture-exercise-item">
            Read the <span className="lecture-bold">README</span> file for instructions on how to edit the repository.
          </li>
          <li className="lecture-exercise-item">
            Make the requested changes, stage them in the Source Control panel, write a commit message, and <span className="lecture-bold">commit</span>.
          </li>
          <li className="lecture-exercise-item">
            Push your commits to the remote repository using the <span className="lecture-bold">Push</span> button or <code className="lecture-code-inline">git push</code>.
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="bash" caption="clone, edit, commit, and push"
              code={`# 1. Clone the repository\ngit clone https://github.com/lewishbass/GitExample.git\ncd GitExample\n\n# 2. Make your changes (edit files, add new files, etc.)\n\n# 3. Stage all changes\ngit add .\n\n# 4. Commit with a descriptive message\ngit commit -m "Added my changes per README instructions"\n\n# 5. Push to the remote\ngit push`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 6, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 2 */}
      <section className="lecture-section mini-scroll" id="exercise-2">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 2 — Tic-Tac-Toe</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Implement a simple tic-tac-toe game. It should display the current board state, prompt the user for their moves, and detect when someone has won.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Initialize a 3×3 array to represent the tic-tac-toe board, and a variable to track whose turn it is.
            <CodeBlock className="lecture-codeblock" language="python" caption="board and player initialization"
              code={`board = [['', '', ''], ['', '', ''], ['', '', '']]\ncurrent_player = 'x'`} />
          </li>
          <li className="lecture-exercise-item">
            Create a method <code className="lecture-code-inline">printBoard(board)</code> that prints the current state of the board in a readable format using two nested for loops.
            <CodeBlock className="lecture-codeblock" language="python" caption="iterate over rows and cells"
              code={`def printBoard(board):\n    for row in board:\n        for cell in row:\n            # print each cell`} />
          </li>
          <li className="lecture-exercise-item">
            Create a method <code className="lecture-code-inline">checkRow(row)</code> that takes an array of three cells, and returns <code className="lecture-code-inline">&apos;x&apos;</code> if they are all x, <code className="lecture-code-inline">&apos;o&apos;</code> if they are all o, and <code className="lecture-code-inline">None</code> otherwise.
          </li>
          <li className="lecture-exercise-item">
            Create a method <code className="lecture-code-inline">checkWin(board)</code> that uses <code className="lecture-code-inline">checkRow</code> to check each row, column, and diagonal.
            <CodeBlock className="lecture-codeblock" language="python" caption="checking the diagonals"
              code={`checkRow([board[0][0], board[1][1], board[2][2]])  # main diagonal\ncheckRow([board[0][2], board[1][1], board[2][0]])  # anti-diagonal`} />
          </li>
          <li className="lecture-exercise-item">
            Create a method <code className="lecture-code-inline">getMove(player)</code> that prompts the user to enter their move in the format <code className="lecture-code-inline">&quot;row,col&quot;</code> and returns the row and column as integers.
          </li>
          <li className="lecture-exercise-item">
            Create a method <code className="lecture-code-inline">applyMove(board, row, col, player)</code> that returns the board updated with the player&apos;s move.
          </li>
          <li className="lecture-exercise-item">
            Use a <code className="lecture-code-inline">while True</code> loop to run the game logic:
            <CodeBlock className="lecture-codeblock" language="python" caption="main game loop outline"
              code={`while True:\n    # clear the console (optional)\n    # switch / print whose turn it is\n    # print the board\n    # get the user input for their move\n    # apply the move to the board\n    # check for a win — if there is one, print the winner and break`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="tic-tac-toe solution"
              code={`import os

board = [['', '', ''], ['', '', ''], ['', '', '']]
current_player = 'x'

def printBoard(board):
    print("  0   1   2")
    for i, row in enumerate(board):
        cells = []
        for cell in row:
            cells.append(cell if cell else ' ')
        print(f"{i} " + " | ".join(cells))
        if i < 2:
            print("  -----------")

def checkRow(row):
    if row[0] == row[1] == row[2] and row[0] != '':
        return row[0]
    return None

def checkWin(board):
    # check rows
    for row in board:
        result = checkRow(row)
        if result:
            return result
    # check columns
    for col in range(3):
        result = checkRow([board[0][col], board[1][col], board[2][col]])
        if result:
            return result
    # check diagonals
    result = checkRow([board[0][0], board[1][1], board[2][2]])
    if result:
        return result
    result = checkRow([board[0][2], board[1][1], board[2][0]])
    if result:
        return result
    return None

def getMove(player):
    while True:
        try:
            move = input(f"Player {player}, enter row,col: ")
            row, col = move.split(',')
            return int(row), int(col)
        except:
            print("Invalid input. Use format: row,col")

def applyMove(board, row, col, player):
    board[row][col] = player
    return board

while True:
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"Player {current_player}'s turn")
    printBoard(board)
    row, col = getMove(current_player)
    board = applyMove(board, row, col, current_player)
    winner = checkWin(board)
    if winner:
        os.system('cls' if os.name == 'nt' else 'clear')
        printBoard(board)
        print(f"Player {winner} wins!")
        break
    current_player = 'o' if current_player == 'x' else 'x'`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 6, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 3 */}
      <section className="lecture-section mini-scroll" id="exercise-3">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 3 — Weather API</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Look up a weather forecast from an <span className="lecture-bold">API</span> and suggest what to wear.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Go to the docs for the Open-Meteo API at
            <span onClick={() => copyToClipboard('https://open-meteo.com/en/docs')} className="cursor-pointer select-none font-bold text-blue-500 ml-2">https://open-meteo.com/en/docs</span>
          </li>
          <li className="lecture-exercise-item">
            Create an API request URL with the following parameters:
            <CodeBlock className="lecture-codeblock" language="python" caption="building the API URL"
              code={`lat = 40.7128   # New York City latitude\nlon = -74.0060  # New York City longitude\nurl = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,uv_index&timezone=auto&temperature_unit=fahrenheit"`} />
          </li>
          <li className="lecture-exercise-item">
            Fetch the data from the API using the <code className="lecture-code-inline">requests</code> library and print the output.
            <CodeBlock className="lecture-codeblock" language="python" caption="fetching data from the API"
              code={`import requests\n\nresponse = requests.get(url)\ndata = response.json()\nprint(data)`} />
          </li>
          <li className="lecture-exercise-item">
            Parse the output to get the predicted temperature, precipitation and UV index for the next day (hours 24–47 in the hourly arrays).
            <CodeBlock className="lecture-codeblock" language="python" caption="extracting tomorrow's data"
              code={`temps = data["hourly"]["temperature_2m"][24:48]\nprecip = data["hourly"]["precipitation"][24:48]\nuv = data["hourly"]["uv_index"][24:48]`} />
          </li>
          <li className="lecture-exercise-item">
            Calculate the min and max temperature for the next day.
            <br />If the min is below 50°F, suggest bringing a coat.
            <br />If the max is above 80°F, suggest wearing a t-shirt.
          </li>
          <li className="lecture-exercise-item">
            Calculate the total precipitation.
            <br />If the total precipitation is above 0.5, suggest bringing an umbrella.
          </li>
          <li className="lecture-exercise-item">
            Calculate the max UV index.
            <br />If the max UV index is above 5, suggest bringing sunscreen.
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="weather forecast solution"
              code={`import requests

lat = 40.7128
lon = -74.0060
url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,uv_index&timezone=auto&temperature_unit=fahrenheit"

response = requests.get(url)
data = response.json()

# extract tomorrow's data (hours 24-47)
temps = data["hourly"]["temperature_2m"][24:48]
precip = data["hourly"]["precipitation"][24:48]
uv = data["hourly"]["uv_index"][24:48]

min_temp = min(temps)
max_temp = max(temps)
total_precip = sum(precip)
max_uv = max(uv)

print(f"Tomorrow's forecast:")
print(f"  Temperature: {min_temp:.1f}°F – {max_temp:.1f}°F")
print(f"  Total precipitation: {total_precip:.2f} mm")
print(f"  Max UV index: {max_uv:.1f}")
print()

suggestions = []
if min_temp < 50:
    suggestions.append("🧥 Bring a coat — it will be cold!")
if max_temp > 80:
    suggestions.append("👕 Wear a t-shirt — it will be hot!")
if total_precip > 0.5:
    suggestions.append("☂️  Bring an umbrella — rain expected!")
if max_uv > 5:
    suggestions.append("🧴 Bring sunscreen — high UV!")

if suggestions:
    print("Suggestions:")
    for s in suggestions:
        print(f"  {s}")
else:
    print("Looks like a nice day — no special gear needed!")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 6, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>
    </LectureTemplate>
  );
}

interface VersionManagementLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function VersionManagementLectureIcon(props: VersionManagementLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Version Management" summary="An intro to version management with Git" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { VersionManagementLecture, VersionManagementLectureIcon };
