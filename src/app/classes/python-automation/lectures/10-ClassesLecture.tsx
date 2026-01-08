import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface ClassesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ClassesLecture(props: ClassesLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Object-oriented programming basics</li>
          <li>Creating classes and objects</li>
          <li>Exception handling with try/except</li>
          <li>Custom error types</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface ClassesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function ClassesLectureIcon(props: ClassesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Classes and Error Handling" summary="Introduction to OOP and robust error handling." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ClassesLecture, ClassesLectureIcon };
