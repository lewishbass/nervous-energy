import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface BreakIteratorsInlineLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function BreakIteratorsInlineLecture(props: BreakIteratorsInlineLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Break</li>
          <li>Continue</li>
          <li>Inline If</li>
          <li>Inline For</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface BreakIteratorsInlineLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function BreakIteratorsInlineLectureIcon(props: BreakIteratorsInlineLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Break, Iterators & Inline" summary="Manipulate loops with advanced techniques. break, continue, for/while patterns" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { BreakIteratorsInlineLecture, BreakIteratorsInlineLectureIcon };
