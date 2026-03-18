import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface ProjectLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ProjectLecture(props: ProjectLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Project planning and design</li>
          <li>Integrating learned concepts</li>
          <li>Debugging and testing</li>
          <li>Code organization best practices</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface ProjectLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function ProjectLectureIcon(props: ProjectLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Project Completion" summary="Work on your final project with guided support." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ProjectLecture, ProjectLectureIcon };
