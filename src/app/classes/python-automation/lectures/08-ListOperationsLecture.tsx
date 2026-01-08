import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface ListOperationsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ListOperationsLecture(props: ListOperationsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Advanced list operations</li>
          <li>Sorting and filtering</li>
          <li>Introduction to NumPy arrays</li>
          <li>Performance considerations</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface ListOperationsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function ListOperationsLectureIcon(props: ListOperationsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="List Operations and Arrays" summary="Advanced techniques for working with collections." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ListOperationsLecture, ListOperationsLectureIcon };
