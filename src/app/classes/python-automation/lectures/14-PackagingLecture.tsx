import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface PackagingLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function PackagingLecture(props: PackagingLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Packaging Python projects</li>
          <li>Using setuptools and pip</li>
          <li>Creating distributable packages</li>
          <li>Version management</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface PackagingLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function PackagingLectureIcon(props: PackagingLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Packing and Distributing Code" summary="Share your Python projects with the world." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { PackagingLecture, PackagingLectureIcon };
