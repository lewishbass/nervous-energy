import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface DecoratorsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function DecoratorsLecture(props: DecoratorsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Understanding decorators</li>
          <li>Creating custom decorators</li>
          <li>Generators and yield</li>
          <li>Iterator protocols</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface DecoratorsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function DecoratorsLectureIcon(props: DecoratorsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Decorators and Generators" summary="Master advanced Python patterns and techniques." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { DecoratorsLecture, DecoratorsLectureIcon };
