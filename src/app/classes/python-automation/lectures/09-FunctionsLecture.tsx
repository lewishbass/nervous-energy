import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface FunctionsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FunctionsLecture(props: FunctionsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Defining and calling functions</li>
          <li>Return values</li>
          <li>Positional, optional and arbitrary arguments</li>
          <li>Scope and lifetime</li>
          <li>First-Class Functions</li> {/*https://en.wikipedia.org/wiki/First-class_function*/}
          <li>Lambda functions</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface FunctionsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function FunctionsLectureIcon(props: FunctionsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Creating and Using Functions" summary="Build reusable code with functions." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { FunctionsLecture, FunctionsLectureIcon };
