import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface FilesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FilesLecture(props: FilesLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Reading and writing files</li>
          <li>Working with CSV and JSON</li>
          <li>File contexts with 'with' statement</li>
          <li>Binary file operations</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface FilesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function FilesLectureIcon(props: FilesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Opening and Editing Files" summary="Master file I/O operations in Python." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FilesLecture, FilesLectureIcon };
