import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface RecursionLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function RecursionLecture(props: RecursionLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Understanding recursion</li>
          <li>Simple Tree Traversal</li>
          <li></li>
          <li>Binary file operations</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface RecursionLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function RecursionLectureIcon(props: RecursionLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Recursion" summary="Understand and implement recursive functions in Python." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { RecursionLecture, RecursionLectureIcon };
