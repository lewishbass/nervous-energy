import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface StringsLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function StringsLecture(props: StringsLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Input and output operations</li>
          <li>Special characters</li> {/*endl="\r" demo*/}
          <li>Slicing</li>
          <li>f-strings</li>
          <li>Built-in string methods</li>
          <li>String manipulation techniques</li>
          <li>Regular expressions</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface StringsLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function StringsLectureIcon(props: StringsLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Strings and IO" summary="Master string operations." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { StringsLecture, StringsLectureIcon };
