import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface InlineLogicLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function InlineLogicLecture(props: InlineLogicLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>List comprehensions</li>
          <li>Dictionary comprehensions</li>
          <li>Inline conditionals</li>
          <li>Writing concise Pythonic code</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface InlineLogicLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function InlineLogicLectureIcon(props: InlineLogicLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Inline Logic and Flow" summary="Write elegant, concise Python code." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { InlineLogicLecture, InlineLogicLectureIcon };
