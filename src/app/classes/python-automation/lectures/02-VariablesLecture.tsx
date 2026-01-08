import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface VariablesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function VariablesLecture(props: VariablesLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate
      displayMode={displayMode}
      className={className}
      style={style}
      exitFSCallback={exitFSCallback}
    >
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Understanding variables in Python</li>
          <li>Working with different data types</li>
          <li>Type conversion and casting</li>
          <li>Variable naming conventions</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface VariablesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function VariablesLectureIcon(props: VariablesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon
      title="Variables and Data Types"
      summary="Learn the fundamentals of variables and data types in Python."
      displayMode={displayMode}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}

export { VariablesLecture, VariablesLectureIcon };
