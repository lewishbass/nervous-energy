import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface BooleanLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function BooleanLecture(props: BooleanLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Boolean logic and operators</li>
          <li>Conditional statements</li>
          <li>If, elif, and else structures</li>
          <li>Logical decision making</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface BooleanLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function BooleanLectureIcon(props: BooleanLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Boolean Logic and If Statements" summary="Learn conditional programming with boolean logic." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { BooleanLecture, BooleanLectureIcon };
