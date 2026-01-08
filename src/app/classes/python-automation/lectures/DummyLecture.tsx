import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface DummyLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function DummyLecture(props: DummyLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate
      displayMode={displayMode}
      className={className}
      style={style}
      exitFSCallback={exitFSCallback}
    >
      <section className="mb-4">
        Placeholder
      </section>
    </LectureTemplate>
  );
}

interface DummyLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}
function DummyLectureIcon(props: DummyLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};

  return (
    <LectureIcon
      title="Placeholder Lecture"
      summary="This is a placeholder lecture icon."
      displayMode={displayMode}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}

export { DummyLecture, DummyLectureIcon };


