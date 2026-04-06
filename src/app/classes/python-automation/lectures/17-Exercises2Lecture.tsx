import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface Exercises2LectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function Exercises2Lecture(props: Exercises2LectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Exercises 2</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Exercise content to be added</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface Exercises2LectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function Exercises2LectureIcon(props: Exercises2LectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Exercises 2" summary="Walk through intermediate exercises combining multiple concepts." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { Exercises2Lecture, Exercises2LectureIcon };
