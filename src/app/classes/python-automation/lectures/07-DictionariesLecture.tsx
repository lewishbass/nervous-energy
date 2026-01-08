import React from 'react';
import {LectureTemplate, LectureIcon} from './LectureTemplate';

interface DictionariesLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function DictionariesLecture(props: DictionariesLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};
  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What You'll Learn</h3>
        <ul className="list-disc list-inside tc2 space-y-1">
          <li>Working with dictionaries</li>
          <li>Sets and their operations</li>
          <li>Tuples and immutability</li>
          <li>Choosing the right data structure</li>
        </ul>
      </section>
    </LectureTemplate>
  );
}

interface DictionariesLectureIconProps {
	displayMode?: 'list' | 'card';
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

function DictionariesLectureIcon(props: DictionariesLectureIconProps | null) {
	const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Dictionaries, Sets and Tuples" summary="Explore key-value pairs and unique collections." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { DictionariesLecture, DictionariesLectureIcon };
