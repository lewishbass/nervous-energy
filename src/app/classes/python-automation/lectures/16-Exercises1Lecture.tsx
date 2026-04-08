'use client';
import React, { useEffect, useState } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';
import Link from 'next/link';

interface Exercises1LectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function Exercises1Lecture(props: Exercises1LectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  // 4/8/2026 8 pm EST (UTC-5) = 2026-04-09T01:00:00Z
  const UNLOCK_TIME = new Date('2026-04-09T01:00:00Z');
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

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Exercises 1</h2>
        <h3 className="tc2 lecture-section-header">Putting It All Together — Games and Utilities</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">Exercises</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('connect-4')}>Exercise 1 — Connect 4</li>
          <li className="lecture-link" onClick={() => scrollToSection('wordle')}>Exercise 2 — Wordle</li>
          <li className="lecture-link" onClick={() => scrollToSection('robot')}>Exercise 3 — Robot</li>
          <li className="lecture-link" onClick={() => scrollToSection('maze')}>Exercise 4 — Maze</li>
          <li className="lecture-link" onClick={() => scrollToSection('scrabble')}>Exercise 5 — Scrabble Cheating</li>
          <li className="lecture-link" onClick={() => scrollToSection('blackjack')}>Exercise 6 — BlackJack</li>
        </ul>
      </section>

      {/* Exercise 1 — Connect 4 */}
      <section className="lecture-section mini-scroll" id="connect-4">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 1 — Connect 4</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Build a two-player terminal Connect 4 game on a 6×7 grid. Players take turns dropping pieces into columns until someone connects four in a row horizontally, vertically, or diagonally.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Initialize a 6-row by 7-column grid filled with empty strings, and a variable to track the current player (<code className="lecture-code-inline">&apos;X&apos;</code> or <code className="lecture-code-inline">&apos;O&apos;</code>).
            <CodeBlock className="lecture-codeblock" language="python" caption="board initialization"
              code={`ROWS, COLS = 6, 7\nboard = [['' for _ in range(COLS)] for _ in range(ROWS)]\ncurrent_player = 'X'`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">print_board(board)</code> function that displays the grid with column numbers along the top, and each cell showing the player token or a dot for empty.
            <CodeBlock className="lecture-codeblock" language="python" caption="example output format"
              code={`# 0 1 2 3 4 5 6
# . . . . . . .
# . . . . . . .
# . . X . . . .
# . . O X . . .
# . O X O . . .
# X O X X . . .`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">drop_piece(board, col, player)</code> function that places the player&apos;s token in the lowest empty row of the chosen column. Return <code className="lecture-code-inline">True</code> if the move was valid, <code className="lecture-code-inline">False</code> if the column is full.
            <CodeBlock className="lecture-codeblock" language="python" caption="iterate from the bottom row upward"
              code={`def drop_piece(board, col, player):\n    for row in range(ROWS - 1, -1, -1):\n        if board[row][col] == '':\n            board[row][col] = player\n            return True\n    return False  # column is full`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">check_win(board, player)</code> function that returns <code className="lecture-code-inline">True</code> if the given player has four tokens in a row. Check all horizontal, vertical, and both diagonal directions.
            <CodeBlock className="lecture-codeblock" language="python" caption="checking horizontal runs"
              code={`# check horizontal\nfor row in range(ROWS):\n    for col in range(COLS - 3):\n        if all(board[row][col + i] == player for i in range(4)):\n            return True`} />
          </li>
          <li className="lecture-exercise-item">
            Use a <code className="lecture-code-inline">while True</code> loop to run the game. Prompt the current player for a column, validate the input, apply the move, check for a win, then switch players.
            <CodeBlock className="lecture-codeblock" language="python" caption="main game loop skeleton"
              code={`while True:\n    print_board(board)\n    col = int(input(f"Player {current_player}, choose column (0-6): "))\n    if drop_piece(board, col, current_player):\n        if check_win(board, current_player):\n            print_board(board)\n            print(f"Player {current_player} wins!")\n            break\n        current_player = 'O' if current_player == 'X' else 'X'`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="connect 4 solution"
              code={`import os

ROWS, COLS = 6, 7

def make_board():
    return [['' for _ in range(COLS)] for _ in range(ROWS)]

def print_board(board):
    os.system('cls' if os.name == 'nt' else 'clear')
    print(' '.join(str(c) for c in range(COLS)))
    for row in board:
        print(' '.join(cell if cell else '.' for cell in row))
    print()

def drop_piece(board, col, player):
    for row in range(ROWS - 1, -1, -1):
        if board[row][col] == '':
            board[row][col] = player
            return True
    return False

def check_win(board, player):
    # horizontal
    for r in range(ROWS):
        for c in range(COLS - 3):
            if all(board[r][c + i] == player for i in range(4)):
                return True
    # vertical
    for r in range(ROWS - 3):
        for c in range(COLS):
            if all(board[r + i][c] == player for i in range(4)):
                return True
    # diagonal down-right
    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            if all(board[r + i][c + i] == player for i in range(4)):
                return True
    # diagonal down-left
    for r in range(ROWS - 3):
        for c in range(3, COLS):
            if all(board[r + i][c - i] == player for i in range(4)):
                return True
    return False

board = make_board()
current_player = 'X'

while True:
    print_board(board)
    try:
        col = int(input(f"Player {current_player}, choose column (0-{COLS-1}): "))
        if col < 0 or col >= COLS:
            print("Invalid column.")
            continue
    except ValueError:
        print("Please enter a number.")
        continue
    if not drop_piece(board, col, current_player):
        print("That column is full!")
        continue
    if check_win(board, current_player):
        print_board(board)
        print(f"Player {current_player} wins!")
        break
    current_player = 'O' if current_player == 'X' else 'X'`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 2 — Wordle */}
      <section className="lecture-section mini-scroll" id="wordle">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 2 — Wordle</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Recreate the Wordle game in the terminal. The program picks a random 5-letter word, and the player has 6 attempts to guess it. After each guess, color-coded feedback shows which letters are correct, misplaced, or absent.
        </p>

        <a
          className="lecture-link-blue lecture-text inline-block mb-4 select-none"
          href="/images/classes/python-automation/5letterwords.txt"
          download
        >
          &#x2B07; Download 5letterwords.txt
        </a>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Load a list of valid 5-letter words from a file. For testing you can start with a small hardcoded list.
            <CodeBlock className="lecture-codeblock" language="python" caption="loading words from a file"
              code={`with open("words.txt", "r") as f:\n    words = [line.strip().lower() for line in f if len(line.strip()) == 5]`} />
          </li>
          <li className="lecture-exercise-item">
            Pick a random word from the list as the secret answer using <code className="lecture-code-inline">random.choice()</code>.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import random\nanswer = random.choice(words)`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">score_guess(guess, answer)</code> function that returns a list of 5 symbols: <code className="lecture-code-inline">&apos;G&apos;</code> (green — correct position), <code className="lecture-code-inline">&apos;Y&apos;</code> (yellow — wrong position), <code className="lecture-code-inline">&apos;X&apos;</code> (grey — not in word). Handle duplicate letters carefully.
            <CodeBlock className="lecture-codeblock" language="python" caption="scoring a guess"
              code={`def score_guess(guess, answer):\n    result = ['X'] * 5\n    answer_chars = list(answer)\n    # first pass: mark greens\n    for i in range(5):\n        if guess[i] == answer[i]:\n            result[i] = 'G'\n            answer_chars[i] = None\n    # second pass: mark yellows\n    for i in range(5):\n        if result[i] == 'X' and guess[i] in answer_chars:\n            result[i] = 'Y'\n            answer_chars[answer_chars.index(guess[i])] = None\n    return result`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">display_result(guess, result)</code> function that prints the guess with color codes — use ANSI escape codes or symbols to distinguish green, yellow, and grey.
            <CodeBlock className="lecture-codeblock" language="python" caption="ANSI color codes for terminal output"
              code={`GREEN  = '\\033[42m'  # green background\nYELLOW = '\\033[43m'  # yellow background\nGREY   = '\\033[100m' # grey background\nRESET  = '\\033[0m'\n\ndef display_result(guess, result):\n    colors = {'G': GREEN, 'Y': YELLOW, 'X': GREY}\n    row = ''\n    for letter, score in zip(guess, result):\n        row += colors[score] + f' {letter.upper()} ' + RESET\n    print(row)`} />
          </li>
          <li className="lecture-exercise-item">
            Loop up to 6 times, prompting the player for a guess each round. Validate that the guess is a 5-letter word. Display the scored result after each attempt. End early if the player guesses correctly.
            <CodeBlock className="lecture-codeblock" language="python" caption="main game loop"
              code={`for attempt in range(1, 7):\n    guess = input(f"Attempt {attempt}/6: ").strip().lower()\n    if len(guess) != 5:\n        print("Please enter a 5-letter word.")\n        continue\n    result = score_guess(guess, answer)\n    display_result(guess, result)\n    if all(r == 'G' for r in result):\n        print("You win!")\n        break\nelse:\n    print(f"The answer was: {answer.upper()}")`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="wordle solution"
              code={`import random

GREEN  = '\\033[42m'
YELLOW = '\\033[43m'
GREY   = '\\033[100m'
RESET  = '\\033[0m'

words = ["crane", "stare", "brave", "flint", "glyph", "plumb", "crisp",
         "vivid", "jazzy", "query", "pixel", "epoch", "knave", "dwarf", "oxide"]

answer = random.choice(words)

def score_guess(guess, answer):
    result = ['X'] * 5
    answer_chars = list(answer)
    for i in range(5):
        if guess[i] == answer[i]:
            result[i] = 'G'
            answer_chars[i] = None
    for i in range(5):
        if result[i] == 'X' and guess[i] in answer_chars:
            result[i] = 'Y'
            answer_chars[answer_chars.index(guess[i])] = None
    return result

def display_result(guess, result):
    colors = {'G': GREEN, 'Y': YELLOW, 'X': GREY}
    row = ''
    for letter, score in zip(guess, result):
        row += colors[score] + f' {letter.upper()} ' + RESET
    print(row)

print("Welcome to Wordle! Guess the 5-letter word.")
attempt = 0
while attempt < 6:
    guess = input(f"Attempt {attempt + 1}/6: ").strip().lower()
    if len(guess) != 5 or not guess.isalpha():
        print("Please enter a valid 5-letter word.")
        continue
    attempt += 1
    result = score_guess(guess, answer)
    display_result(guess, result)
    if all(r == 'G' for r in result):
        print(f"\\nYou got it in {attempt}!")
        break
else:
    print(f"\\nBetter luck next time! The answer was: {answer.upper()}")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 3 — Robot */}
      <section className="lecture-section mini-scroll" id="robot">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 3 — Robot</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Use the built-in <code className="lecture-code-inline">Robot</code> class in the{' '}
          <Link href="/toys/python-playground" className="lecture-link-blue">Python Playground</Link>{' '}
          to move a robot around the visualizer and draw shapes. Open the playground, then drag the cyan bar on the right edge of the variable viewer to reveal the visualizer panel.
        </p>

        <table className="lecture-table">
          <thead>
            <tr className="lecture-table-row">
              <th className="lecture-table-header">Method</th>
              <th className="lecture-table-header">Returns</th>
              <th className="lecture-table-header">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">Robot(name=None)</code></td>
              <td className="lecture-table-cell">Robot</td>
              <td className="lecture-table-cell">Creates a new robot at position (0, 0) facing right (angle 0). Optionally give it a name.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">robot.move(distance)</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Moves the robot forward by <code className="lecture-code-inline">distance</code> units in its current direction.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">robot.turn(radians)</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Rotates the robot by <code className="lecture-code-inline">radians</code>. Use <code className="lecture-code-inline">math.pi / 2</code> for 90°, <code className="lecture-code-inline">math.pi</code> for 180°.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">robot.speak()</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Prints <code className="lecture-code-inline">&quot;Beep boop!&quot;</code> to the console.</td>
            </tr>
          </tbody>
        </table>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">Robot</code> and use <code className="lecture-code-inline">move()</code> and <code className="lecture-code-inline">turn()</code> to draw a square (4 sides of equal length, turning 90° between each).
            <CodeBlock className="lecture-codeblock" language="python" caption="hint — turning 90 degrees"
              code={`import math
r = Robot()
r.move(100)
r.turn(math.pi / 2)  # turn 90 degrees left`} />
          </li>
          <li className="lecture-exercise-item">
            Draw an equilateral triangle. Each turn should be <code className="lecture-code-inline">2 * math.pi / 3</code> (120°). Use a loop.
          </li>
          <li className="lecture-exercise-item">
            Draw a circle approximation by moving a small distance and turning a small angle, repeating many times. Try 360 steps of 1° each (<code className="lecture-code-inline">math.pi / 180</code>).
          </li>
          <li className="lecture-exercise-item">
            Create two robots with different names and have them draw shapes simultaneously by alternating between them in a loop.
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="robot solution — square, triangle, circle"
              code={`import math

# Square
r = Robot(name="square")
for _ in range(4):
    r.move(100)
    r.turn(math.pi / 2)

# Triangle
t = Robot(name="triangle")
for _ in range(3):
    t.move(100)
    t.turn(2 * math.pi / 3)

# Circle approximation
c = Robot(name="circle")
for _ in range(360):
    c.move(1)
    c.turn(math.pi / 180)`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 4 — Maze */}
      <section className="lecture-section mini-scroll" id="maze">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 4 — Maze</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Use the built-in <code className="lecture-code-inline">Maze</code> class in the{' '}
          <Link href="/toys/python-playground" className="lecture-link-blue">Python Playground</Link>{' '}
          to navigate a randomly generated maze. The maze is rendered in the visualizer panel — open it by dragging the cyan bar on the right edge of the variable viewer.
        </p>

        <table className="lecture-table">
          <thead>
            <tr className="lecture-table-row">
              <th className="lecture-table-header">Method</th>
              <th className="lecture-table-header">Returns</th>
              <th className="lecture-table-header">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">Maze(width=10, height=10)</code></td>
              <td className="lecture-table-cell">Maze</td>
              <td className="lecture-table-cell">Creates a new randomly generated maze of the given size and spawns the runner at the top-left.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.move()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Moves the runner one step in its current facing direction. Returns <code className="lecture-code-inline">True</code> on success, <code className="lecture-code-inline">False</code> if blocked by a wall.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.turn(direction)</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Points the runner in an absolute direction: <code className="lecture-code-inline">&apos;up&apos;</code>, <code className="lecture-code-inline">&apos;down&apos;</code>, <code className="lecture-code-inline">&apos;left&apos;</code>, or <code className="lecture-code-inline">&apos;right&apos;</code>.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.turnLeft()</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Rotates the runner 90° to the left relative to its current facing direction.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.turnRight()</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Rotates the runner 90° to the right relative to its current facing direction.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.checkFront()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Returns <code className="lecture-code-inline">True</code> if the cell directly ahead is open (not a wall).</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.checkBack()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Returns <code className="lecture-code-inline">True</code> if the cell directly behind is open.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.checkLefthand()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Returns <code className="lecture-code-inline">True</code> if the cell to the left is open.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.checkRighthand()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Returns <code className="lecture-code-inline">True</code> if the cell to the right is open.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.look()</code></td>
              <td className="lecture-table-cell">dict</td>
              <td className="lecture-table-cell">Returns a dictionary mapping each absolute direction to <code className="lecture-code-inline">True</code> if that direction is blocked by a wall.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.hasWon()</code></td>
              <td className="lecture-table-cell">bool</td>
              <td className="lecture-table-cell">Returns <code className="lecture-code-inline">True</code> if the runner has reached the goal cell in the bottom-right.</td>
            </tr>
            <tr className="lecture-table-row">
              <td className="lecture-table-cell"><code className="lecture-code-inline">maze.reset()</code></td>
              <td className="lecture-table-cell">None</td>
              <td className="lecture-table-cell">Sends the runner back to the starting position and resets its facing direction to right.</td>
            </tr>
          </tbody>
        </table>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">Maze()</code> and write a loop that keeps the runner moving until it wins. Use <code className="lecture-code-inline">checkFront()</code> to decide when to turn.
            <CodeBlock className="lecture-codeblock" language="python" caption="basic movement loop"
              code={`m = Maze()\nwhile not m.hasWon():\n    if m.checkFront():\n        m.move()\n    else:\n        m.turnRight()`} />
          </li>
          <li className="lecture-exercise-item">
            Implement the <span className="lecture-bold">left-hand rule</span>: always try to turn left first, then go straight, then turn right, then turn back. This guarantees solving any simply-connected maze.
            <CodeBlock className="lecture-codeblock" language="python" caption="left-hand rule skeleton"
              code={`m = Maze()\nwhile not m.hasWon():\n    if m.checkLefthand():\n        m.turnLeft()\n        m.move()\n    elif m.checkFront():\n        m.move()\n    elif m.checkRighthand():\n        m.turnRight()\n        m.move()\n    else:\n        m.turnRight()\n        m.turnRight()  # turn 180`} />
          </li>
          <li className="lecture-exercise-item">
            Try different maze sizes, e.g. <code className="lecture-code-inline">Maze(5, 5)</code> or <code className="lecture-code-inline">Maze(20, 20)</code>, and see how your solution performs.
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="maze solution — left-hand rule"
              code={`m = Maze(10, 10)\n\nwhile not m.hasWon():\n    if m.checkLefthand():\n        m.turnLeft()\n        m.move()\n    elif m.checkFront():\n        m.move()\n    elif m.checkRighthand():\n        m.turnRight()\n        m.move()\n    else:\n        m.turnRight()\n        m.turnRight()  # dead end — turn 180\n\nprint("Maze solved!")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 5 — Scrabble Cheating */}
      <section className="lecture-section mini-scroll" id="scrabble">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 5 — Scrabble Cheating</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Write a program that reads a dictionary from a file and finds all valid Scrabble words that can be formed from a given set of tiles, sorted by point value.
        </p>

        <a
          className="lecture-link-blue lecture-text inline-block mb-4 select-none"
          href="/images/classes/python-automation/10kwords.txt"
          download
        >
          &#x2B07; Download 10kwords.txt
        </a>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Load a word list from a file (one word per line). Filter for words with only alphabetic characters.
            <CodeBlock className="lecture-codeblock" language="python" caption="loading the dictionary"
              code={`with open("words.txt", "r") as f:\n    dictionary = set(line.strip().lower() for line in f if line.strip().isalpha())`} />
          </li>
          <li className="lecture-exercise-item">
            Define the Scrabble letter point values as a dictionary.
            <CodeBlock className="lecture-codeblock" language="python" caption="scrabble letter scores"
              code={`SCORES = {\n    'a':1,'e':1,'i':1,'o':1,'u':1,'l':1,'n':1,'s':1,'t':1,'r':1,\n    'b':3,'c':3,'m':3,'p':3,\n    'f':4,'h':4,'v':4,'w':4,'y':4,\n    'k':5,\n    'j':8,'x':8,\n    'q':10,'z':10\n}`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">can_form(word, tiles)</code> function that returns <code className="lecture-code-inline">True</code> if every letter in <code className="lecture-code-inline">word</code> can be supplied by the available tiles. Use <code className="lecture-code-inline">collections.Counter</code> to compare letter counts.
            <CodeBlock className="lecture-codeblock" language="python" caption="checking if a word can be formed from tiles"
              code={`from collections import Counter\n\ndef can_form(word, tiles):\n    tile_counts = Counter(tiles)\n    for letter in word:\n        if tile_counts[letter] <= 0:\n            return False\n        tile_counts[letter] -= 1\n    return True`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">word_score(word)</code> function that returns the total Scrabble point value of a word.
            <CodeBlock className="lecture-codeblock" language="python"
              code={`def word_score(word):\n    return sum(SCORES.get(letter, 0) for letter in word)`} />
          </li>
          <li className="lecture-exercise-item">
            Prompt the player for their tile letters, find all dictionary words that can be formed, sort them by score (descending), and print the top results.
            <CodeBlock className="lecture-codeblock" language="python" caption="searching and displaying results"
              code={`tiles = input("Enter your tiles: ").strip().lower()\nvalid_words = [w for w in dictionary if can_form(w, tiles)]\nvalid_words.sort(key=word_score, reverse=True)\nfor word in valid_words[:20]:\n    print(f"{word_score(word):3}  {word}")`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="scrabble cheating solution"
              code={`from collections import Counter

SCORES = {
    'a':1,'e':1,'i':1,'o':1,'u':1,'l':1,'n':1,'s':1,'t':1,'r':1,
    'b':3,'c':3,'m':3,'p':3,
    'f':4,'h':4,'v':4,'w':4,'y':4,
    'k':5,
    'j':8,'x':8,
    'q':10,'z':10
}

def word_score(word):
    return sum(SCORES.get(c, 0) for c in word)

def can_form(word, tile_counter):
    word_counter = Counter(word)
    for letter, count in word_counter.items():
        if tile_counter[letter] < count:
            return False
    return True

try:
    with open("words.txt", "r") as f:
        dictionary = [line.strip().lower() for line in f if line.strip().isalpha()]
except FileNotFoundError:
    # fallback small list for testing
    dictionary = ["crane","stare","rates","tears","cares","saner","earns",
                  "snare","nears","lanes","lean","real","rent","sent","ten","set"]

tiles = input("Enter your tiles (e.g. aeilnrst): ").strip().lower()
tile_counter = Counter(tiles)

valid = [(word_score(w), w) for w in dictionary if can_form(w, tile_counter)]
valid.sort(reverse=True)

if not valid:
    print("No valid words found.")
else:
    print(f"\\nFound {len(valid)} word(s). Top results:")
    for score, word in valid[:20]:
        print(f"  {score:3}  {word}")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 6 — BlackJack */}
      <section className="lecture-section mini-scroll" id="blackjack">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 6 — BlackJack</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Build a single-player Blackjack game against a dealer. The player draws cards aiming to get as close to 21 as possible without going over. Aces count as 1 or 11.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Define a deck of 52 cards as a list of tuples <code className="lecture-code-inline">(rank, suit)</code>. Shuffle it using <code className="lecture-code-inline">random.shuffle()</code>.
            <CodeBlock className="lecture-codeblock" language="python" caption="building and shuffling the deck"
              code={`import random\n\nranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']\nsuits = ['♠','♥','♦','♣']\ndeck = [(r, s) for r in ranks for s in suits]\nrandom.shuffle(deck)`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">hand_value(hand)</code> function that calculates the total value of a hand. Face cards are worth 10, Aces are worth 11 but drop to 1 if the hand would bust.
            <CodeBlock className="lecture-codeblock" language="python" caption="calculating hand value with flexible aces"
              code={`def hand_value(hand):\n    total, aces = 0, 0\n    for rank, suit in hand:\n        if rank in ('J', 'Q', 'K'):\n            total += 10\n        elif rank == 'A':\n            total += 11\n            aces += 1\n        else:\n            total += int(rank)\n    while total > 21 and aces:\n        total -= 10\n        aces -= 1\n    return total`} />
          </li>
          <li className="lecture-exercise-item">
            Create a <code className="lecture-code-inline">display_hand(label, hand, hide_second=False)</code> function that prints the cards in a hand. If <code className="lecture-code-inline">hide_second</code> is <code className="lecture-code-inline">True</code>, replace the second card with <code className="lecture-code-inline">&apos;[?]&apos;</code> (for the dealer&apos;s hidden card).
          </li>
          <li className="lecture-exercise-item">
            Deal two cards each to the player and the dealer (dealer&apos;s second card is hidden). Let the player hit or stand until they bust or stand.
            <CodeBlock className="lecture-codeblock" language="python" caption="player's turn loop"
              code={`while hand_value(player_hand) < 21:\n    action = input("Hit or Stand? (h/s): ").strip().lower()\n    if action == 'h':\n        player_hand.append(deck.pop())\n        display_hand("Player", player_hand)\n        if hand_value(player_hand) > 21:\n            print("Bust!")\n            break\n    elif action == 's':\n        break`} />
          </li>
          <li className="lecture-exercise-item">
            Play out the dealer&apos;s turn: the dealer must hit until their hand value is 17 or higher. Then compare totals to determine the winner.
            <CodeBlock className="lecture-codeblock" language="python" caption="dealer logic and outcome"
              code={`while hand_value(dealer_hand) < 17:\n    dealer_hand.append(deck.pop())\n\nplayer_total = hand_value(player_hand)\ndealer_total = hand_value(dealer_hand)\n\nif player_total > 21:\n    print("You bust — dealer wins.")\nelif dealer_total > 21 or player_total > dealer_total:\n    print("You win!")\nelif player_total < dealer_total:\n    print("Dealer wins.")\nelse:\n    print("Push — it's a tie!")`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python" caption="blackjack solution"
              code={`import random

ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
suits = ['♠','♥','♦','♣']

def make_deck():
    deck = [(r, s) for r in ranks for s in suits]
    random.shuffle(deck)
    return deck

def hand_value(hand):
    total, aces = 0, 0
    for rank, _ in hand:
        if rank in ('J', 'Q', 'K'):
            total += 10
        elif rank == 'A':
            total += 11
            aces += 1
        else:
            total += int(rank)
    while total > 21 and aces:
        total -= 10
        aces -= 1
    return total

def display_hand(label, hand, hide_second=False):
    cards = [f"{r}{s}" for r, s in hand]
    if hide_second and len(cards) > 1:
        cards[1] = '[?]'
        total_str = '?'
    else:
        total_str = str(hand_value(hand))
    print(f"{label}: {' '.join(cards)}  (total: {total_str})")

deck = make_deck()
player_hand = [deck.pop(), deck.pop()]
dealer_hand = [deck.pop(), deck.pop()]

print("\\n=== BLACKJACK ===")
display_hand("Dealer", dealer_hand, hide_second=True)
display_hand("Player", player_hand)

# player's turn
if hand_value(player_hand) == 21:
    print("Blackjack!")
else:
    while hand_value(player_hand) < 21:
        action = input("\\nHit or Stand? (h/s): ").strip().lower()
        if action == 'h':
            player_hand.append(deck.pop())
            display_hand("Player", player_hand)
            if hand_value(player_hand) > 21:
                print("Bust! Dealer wins.")
                exit()
        elif action == 's':
            break

# dealer's turn
print("\\nDealer reveals hand:")
display_hand("Dealer", dealer_hand)
while hand_value(dealer_hand) < 17:
    dealer_hand.append(deck.pop())
    display_hand("Dealer", dealer_hand)

p = hand_value(player_hand)
d = hand_value(dealer_hand)
print(f"\\nPlayer: {p}  Dealer: {d}")
if d > 21 or p > d:
    print("You win!")
elif p < d:
    print("Dealer wins.")
else:
    print("Push — it's a tie!")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">April 8, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>
    </LectureTemplate>
  );
}

interface Exercises1LectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function Exercises1LectureIcon(props: Exercises1LectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Exercises 1" summary="Walk through simple exercises combining multiple concepts." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { Exercises1Lecture, Exercises1LectureIcon };
