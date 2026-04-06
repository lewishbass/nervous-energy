import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface Exercises1LectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function Exercises1Lecture(props: Exercises1LectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Exercises 1</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
         
          <li>TicTacToe</li>
          <li>Robot</li>
          <li>Maze</li>
        </ul>
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
