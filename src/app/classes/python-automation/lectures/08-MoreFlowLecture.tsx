import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface MoreFlowLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function MoreFlowLecture(props: MoreFlowLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Iterators</li>
          <li>Generators</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface MoreFlowLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function MoreFlowLectureIcon(props: MoreFlowLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="More Flow Control" summary="Manipulate loops with advanced techniques. 'with' and 'trys'" displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { MoreFlowLecture, MoreFlowLectureIcon };
