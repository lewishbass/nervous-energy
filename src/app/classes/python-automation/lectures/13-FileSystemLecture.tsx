import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface FileSystemLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FileSystemLecture(props: FileSystemLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Navigating the file system</li>
          <li>Creating and deleting files/folders</li>
          <li>Path manipulation with os module</li>
          <li>Automating file operations</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface FileSystemLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function FileSystemLectureIcon(props: FileSystemLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="File System Automation" summary="Automate file and directory operations." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FileSystemLecture, FileSystemLectureIcon };
