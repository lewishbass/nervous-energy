import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface LoopsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FlowControlLecture(props: LoopsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>For and while loops</li>
          <li>Loop control with break and continue</li>
          <li>Iterating over sequences</li>
          <li>Nested loops</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface LoopsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function FlowControlLectureIcon(props: LoopsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="If, Else, For, While" summary="Master repetitive tasks with loops." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FlowControlLecture, FlowControlLectureIcon };
