import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface InterfacesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function InterfacesLecture(props: InterfacesLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Command-line interfaces with argparse</li>
          <li>Building GUI applications with Tkinter</li>
          <li>Web interfaces with Flask</li>
          <li>User input validation</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface InterfacesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function InterfacesLectureIcon(props: InterfacesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="CLI and GUI Interfaces" summary="Create user interfaces for your Python programs." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { InterfacesLecture, InterfacesLectureIcon };
