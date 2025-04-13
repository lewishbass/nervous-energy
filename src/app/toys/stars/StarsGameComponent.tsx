'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

type CellState = 'empty' | 'star' | 'blocked';
type CellError = 'underfull' | 'empty' | 'filled' | 'oneleft' | 'overfull'; 

// Define a ref type for external components to use
export interface StarsGameRef {
  board: CellState[][];
  boxIndex: number[][];
  toggleCell: (row: number, col: number, reverse?: boolean) => void;
  resetGame: () => void;
  generateNewPuzzle: () => void;
}

interface GameProps {
  size?: number;
  customBoard?: number[][] | null;
  enable?: boolean;
  autoBlock?: boolean;
  autoStar?: boolean;
	showError?: boolean;
	showMessages?: boolean;
}

const StarsGameComponent = forwardRef<StarsGameRef, GameProps>(({
  size = 5,
  customBoard = null,
  enable = true,
  autoBlock = true,
  autoStar = false,
	showError = true,
	showMessages = false,
}, ref) => {
  // Initialize empty board
  const initializeBoard = (): CellState[][] => {
    return Array(size).fill(null).map(() => Array(size).fill('empty'));
  };

	const initializePuzzle = (): number[][] => {
		if (customBoard) {
			return [...customBoard];	
		}
    const b = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        b[i][j] = i;
      }
    }
    for (let i = 2; i < size; i++) {
      b[0][i] = 1;
    }
    return b;
  };

  const [isComplete, setIsComplete] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState<string>('');

  const [board, setBoard] = useState<CellState[][]>(initializeBoard());
  const [boxIndex, setBoxIndex] = useState<number[][]>(initializePuzzle());
  const [errorSquare, setErrorSquare] = useState<CellError[][]>(Array(size).fill(Array(size).fill('empty')));

  // Expose the internal state and methods via ref
  useImperativeHandle(ref, () => ({
    board,
    boxIndex,
    toggleCell,
    resetGame,
    generateNewPuzzle
  }), [board, boxIndex]);

  const [verticalLines, setVerticalLines] = useState<boolean[][]>(Array(size).fill(Array(size-1).fill(false)));
  const [horizontalLines, setHorizontalLines] = useState<boolean[][]>(Array(size-1).fill(Array(size).fill(false)));

  // Set the lines to draw the boxes
  useEffect(() => {
    const vertical_lines = Array(size).fill(null).map(() => Array(size-1).fill(false));
    const horizontal_lines = Array(size-1).fill(null).map(() => Array(size).fill(false));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (i < boxIndex.length && j+1 < boxIndex[i].length && boxIndex[i][j] != boxIndex[i][j+1]){
          vertical_lines[i][j] = true;
        }
        if(j+1 < boxIndex.length && i < boxIndex[j].length && boxIndex[j][i] != boxIndex[j+1][i]){
          horizontal_lines[j][i] = true;
        }
      }
    }
    setVerticalLines(vertical_lines);
    setHorizontalLines(horizontal_lines);
  }, [boxIndex, size]);

  // Determine the box boundaries (for the "one star per box" rule)
  const getBoxIndex = (row: number, col: number): number => {
    return boxIndex[row][col];
  };

  const getBoxColor = (index: number): string => {
    const colors = [
      'bg-red-200 dark:bg-red-500/25',
      'bg-blue-200 dark:bg-blue-500/25',
      'bg-green-200 dark:bg-green-500/25',
      'bg-yellow-200 dark:bg-yellow-500/25',
      'bg-purple-200 dark:bg-purple-500/25',
      'bg-indigo-200 dark:bg-indigo-500/25',
      'bg-orange-200 dark:bg-orange-500/25',
    ];

    return colors[index % colors.length] || 'bg-gray-200 dark:bg-gray-500/25';
  };
  const getErrorColor = (index: CellError): string => {
    const colors = {
      'underfull' : 'outline-yellow-200 dark:outline-yellow-500',
      'oneleft' : 'outline-blue-200 dark:outline-blue-500',
      'empty' : 'outline-[#0000] dark:outline-[#fff0]',//'outline-gray-200 dark:outline-gray-500',
      'filled' : 'outline-green-200 dark:outline-green-500',
      'overfull' : 'outline-red-200 dark:outline-red-500',
    };
    return colors[index] || 'outline-gray-200 dark:outline-gray-500/25';
  };

  // Toggle cell state when clicked
  const toggleCell = (row: number, col: number, reverse: boolean = false) => {
    const newBoard = [...board];
    if (newBoard[row][col] === 'empty') {
      newBoard[row][col] = reverse ? 'star' : 'blocked';
    } else if (newBoard[row][col] === 'blocked') {
      newBoard[row][col] = reverse ? 'empty' : 'star';
    } else {
      newBoard[row][col] = reverse ? 'blocked' : 'empty';
    }
    let squareError = firstOrderCheck(newBoard, boxIndex);
    let newBoardFilled = fillFirstOrder(newBoard, boxIndex, squareError);

    for (let i = 0; i < 20; i++){
      squareError = firstOrderCheck(newBoardFilled, boxIndex);
      newBoardFilled = fillFirstOrder(newBoardFilled, boxIndex, squareError);
    }

    setBoard(newBoardFilled);
    validateBoard(newBoard);
  };

  // Check if the board is valid and complete
  const validateBoard = (currentBoard: CellState[][]) => {
    let valid = true;
    let complete = true;
    let invalidReason = '';

    // Track stars in rows, columns, and boxes
    const rowStars = Array(size).fill(0);
    const colStars = Array(size).fill(0);
    const boxStars = Array(size).fill(0);

    // Check each cell
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (currentBoard[row][col] === 'star') {
          // Count stars in row, column, and box
          rowStars[row]++;
          colStars[col]++;
          boxStars[getBoxIndex(row, col)]++;

          // Check for adjacent stars
          if (
            (row > 0 && currentBoard[row - 1][col] === 'star') ||
            (row < size - 1 && currentBoard[row + 1][col] === 'star') ||
            (col > 0 && currentBoard[row][col - 1] === 'star') ||
            (col < size - 1 && currentBoard[row][col + 1] === 'star') ||
            (row > 0 && col > 0 && currentBoard[row - 1][col - 1] === 'star') ||
            (row > 0 && col < size - 1 && currentBoard[row - 1][col + 1] === 'star') ||
            (row < size - 1 && col > 0 && currentBoard[row + 1][col - 1] === 'star') ||
            (row < size - 1 && col < size - 1 && currentBoard[row + 1][col + 1] === 'star')
          ) {
            valid = false;
            invalidReason = 'Stars cannot be adjacent to each other';
          }
        }
      }
    }

    // Check if any row has more than one star
    if (rowStars.some(count => count > 1)) {
      valid = false;
      invalidReason = 'Each row must have exactly one star';
    }

    // Check if any column has more than one star
    if (colStars.some(count => count > 1)) {
      valid = false;
      invalidReason = 'Each column must have exactly one star';
    }

    // Check if any box has more than one star
    if (boxStars.some(count => count > 1)) {
      valid = false;
      invalidReason = 'Each box must have exactly one star';
    }

    // Check if the board is complete (each row, column, and box has exactly one star)
    if (rowStars.some(count => count !== 1) ||
      colStars.some(count => count !== 1) ||
      boxStars.some(count => count !== 1)) {
      complete = false;
    }
    
    setErrorSquare(firstOrderCheck(currentBoard, boxIndex));

    setIsValid(valid);
    setMessage(valid ? (complete ? 'Puzzle solved!' : '') : invalidReason);
    setIsComplete(complete && valid);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(initializeBoard());
    setIsComplete(false);
    setIsValid(true);
    setMessage('');
    setErrorSquare(Array(size).fill(Array(size).fill('empty')));
  };

  // Generate a new random puzzle
  const generateNewPuzzle = () => {
    setBoard(initializeBoard());
    setBoxIndex(initializePuzzle());
    setIsComplete(false);
    setIsValid(true);
    setMessage('');
    setErrorSquare(Array(size).fill(Array(size).fill('empty')));
  };

  // Initialize the game
  useEffect(() => {
    generateNewPuzzle();
  }, [size]);
  
  const firstOrderCheck = (board: CellState[][], puzzle: number[][]):CellError[][] => {
    const groups: number[][][] = [];
    
    // box groups
    for (let i = 0; i < size; i++) {
      groups.push([]);
    }
    for (let x = 0; x < size; x++){
      for (let y = 0; y < size; y++){
        groups[puzzle[x][y]].push([x, y]);
      }
    }

    // column groups
    for (let x = 0; x < size; x++){
      groups.push([]);
      for (let y = 0; y < size; y++){
        groups[groups.length-1].push([x, y]);
      }
    }

    // row groups
    for (let y = 0; y < size; y++){
      groups.push([]);
      for (let x = 0; x < size; x++){
        groups[groups.length-1].push([x, y]);
      }
    }

    // star groups
    for (let x = 0; x < size; x++){
      for (let y = 0; y < size; y++){
        if(board[x][y] == 'star'){
          groups.push([]);
          for(let dx = -1; dx <= 1; dx++){
            for(let dy = -1; dy <= 1; dy++){
              if(x+dx < 0 || x+dx >= size || y+dy < 0 || y+dy >= size) continue;
              groups[groups.length-1].push([x+dx, y+dy]);
            }
          }
        }
      }
    }
    const minStars: number[][] = Array(size).fill(null).map(() => Array(size).fill(size));
    const maxStars: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
    const space: number[][] = Array(size).fill(null).map(() => Array(size).fill(size));
    const returnValue: CellError[][] = Array(size).fill(null).map(() => Array(size).fill(0)); // return code -1, 0, 1, 2 for underfull, none, full and overfull
    //check group
    for (let i = 0; i < groups.length; i++){
      const group = groups[i];
      let stars = 0;
      let free_space = 0;
      for (let j = 0; j < group.length; j++){
        const x = group[j][0];
        const y = group[j][1];
        if(board[x][y] == 'star'){
          stars++;
        }
        if (board[x][y] == 'empty'){
          free_space++;
        }
      }
      for (let j = 0; j < group.length; j++){
        const x = group[j][0];
        const y = group[j][1];
        
        maxStars[x][y] = Math.max(maxStars[x][y], stars);
        minStars[x][y] = Math.min(minStars[x][y], stars);
        space[x][y] = (stars == 0) ? Math.min(space[x][y], free_space) : space[x][y];

      }
      
      
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // returnValueStates
        // 'underfull' | 'empty' | 'filled' | 'oneleft' | 'overfull';
        returnValue[x][y] = 'empty';
        if (maxStars[x][y] == 1) returnValue[x][y] = 'filled';
        if (maxStars[x][y] > 1) returnValue[x][y] = 'overfull';
        if (space[x][y] == 0) returnValue[x][y] = 'underfull';
        if (space[x][y] == 1 && board[x][y] == 'empty' && maxStars[x][y] == 0) returnValue[x][y] = 'oneleft';
        
      }
    }
    return returnValue;
  } //returns matrix of none, full and overfull 0, 1, 2

  const fillFirstOrder = (board: CellState[][], puzzle: number[][], errors: CellError[][]): CellState[][] => {
    const newBoard = [...board];
    for (let x = 0; x < size; x++){
      for (let y = 0; y < size; y++){
        if(errors[x][y] == 'filled' && board[x][y] == 'empty' && autoBlock){
          newBoard[x][y] = 'blocked';
        }
        if(errors[x][y] == 'oneleft' && autoStar){
          newBoard[x][y] = 'star';
        }
      }
    }
    return newBoard;

  }
  
  return (
    <div className="flex flex-col items-center gap-4" style={{ pointerEvents: enable ? 'auto' : 'none' }}>
			{showMessages && <div className={`mb-4 p-2 rounded h-[2.5em] ${message ? '' : 'opacity-0'} ${isValid ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} ${isComplete ? 'animate-pulse' : ''}`}
				style={{ transition: 'opacity 0.2s ease' }}>
				{message}
			</div>}
      
      <div
        className="relative grid gap-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border-black dark:border-white"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          minWidth: `5vw`,
          borderWidth: "5px",
        }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => toggleCell(rowIndex, colIndex)}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleCell(rowIndex, colIndex, true);
              }}
              className={`
                flex items-center justify-center 
                cursor-pointer transition-all
                ${getBoxColor(getBoxIndex(rowIndex, colIndex))}
                ${getErrorColor(errorSquare[rowIndex][colIndex])}
                ${showError ? 'outline-16 -outline-offset-16' :'outline-0 -outline-offset-0'}
                 
                hover:opacity-80
              `}
              style={{
                transition: 'all 0.5s ease',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="-6 -6 36 36" style={{filter: 'drop-shadow(1px 1px 2px #0004)'}}>
                <path style={{transition: 'all 0.15s ease', transformOrigin: '12px 12px'}} transform={ cell != 'star' ? 'scale(0.5)':'' } opacity={cell == 'star' ? 1 : 0} fill="#fd0" stroke="#fd0" strokeWidth={4} strokeLinecap="round" strokeLinejoin='round' d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                <path style={{transition: 'all 0.15s ease', transformOrigin: '12px 12px'}} transform={ cell != 'blocked' ? 'scale(0.5)':'' } opacity={cell == 'blocked' ? 1 : 0} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} stroke="red" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ))
        ))}
        {/* grid bordering boxes */}
        <div className="absolute w-full h-full pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute h-full w-full text-black dark:text-white pointer-events-none" 
            viewBox={`0 0 ${size} ${size}`} 
            stroke="currentColor" 
            preserveAspectRatio="none"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {verticalLines.map((col, rowIndex) => (
              col.map((line, colIndex) => (
                line && <line key={`${rowIndex}-${colIndex+1}`} x1={colIndex+1} y1={rowIndex} x2={colIndex+1} y2={rowIndex + 1} strokeWidth={0.05} strokeLinecap='round'/>
              ))
            ))}
            {horizontalLines.map((row, rowIndex) => (
              row.map((line, colIndex) => (
                line && <line key={`${rowIndex+1}-${colIndex}`} x1={colIndex} y1={rowIndex+1} x2={colIndex + 1} y2={rowIndex+1} strokeWidth={0.05} strokeLinecap='round'/>
              ))
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
});

StarsGameComponent.displayName = 'StarsGameComponent';

export default StarsGameComponent;
