import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface ListsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function ListsLecture(props: ListsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Creating and manipulating lists</li>
          <li>List methods and operations</li>
          <li>Indexing and slicing</li>
          <li>List comprehensions</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface ListsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function ListsLectureIcon(props: ListsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Lists" summary="Work with Python's most versatile data structure." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { ListsLecture, ListsLectureIcon };
