import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface Exercises3LectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function Exercises3Lecture(props: Exercises3LectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Exercises 3</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Exercise content to be added</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface Exercises3LectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function Exercises3LectureIcon(props: Exercises3LectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Exercises 3" summary="Walk through advanced exercises combining multiple concepts." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { Exercises3Lecture, Exercises3LectureIcon };
