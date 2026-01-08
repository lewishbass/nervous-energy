import React from 'react';
import Image from 'next/image';
import { LectureTemplate, LectureIcon } from './LectureTemplate';

interface SetupLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function SetupLecture(props: SetupLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  const isScroll = displayMode === 'scrollable';

  return (
    <LectureTemplate
      displayMode={displayMode}
      className={className}
      style={style}
      exitFSCallback={exitFSCallback}
    >
      <section className={` ${isScroll ? 'mb-4' : 'text-center m-[10vh]'}`}>
        <h2 className={`tc1 font-bold ${isScroll ? 'text-2xl' : 'text-[8vw]'}`}>Setting Up Python</h2>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Sections</h3>
        <div className="flex flex-row">
          <ul className="list-disc list-inside tc2 space-y-1">
            <li>What is Python?</li>
            <li>Installing Python and pip with conda</li>
            <li>Setting up virtual environments</li>
            <li>Configuring VS Code for Python</li>
            <li>Using Jupyter Notebooks</li>
            <li>Installing essential packages</li>
          </ul>
          <div className="relative w-full aspect-square max-w-[150px] mx-auto hidden sm:block">
            <Image
              src="/images/classes/python-automation/python-icon.svg"
              alt="Python Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">What is Python?</h3>
        <div className="flex-1">
          <div className="flex flex-row">
            <div className="mr-0 sm:mr-6">
              <p className="tc2 mb-3"> Python is a high-level programming language designed with a focus on readability and streamlined syntax.</p>
              <p className="tc2 mb-3"> It was developed in the late 1980s by Guido van Rossum and Python 3 (released in 2008) is the most popular programming language today.</p>
              <p className="tc2 mb-3"> Python remains dominant in <span className="font-bold">data science</span>, <span className="font-bold">machine learning</span> and <span className="font-bold">scientific computing</span> thanks to its powerful libraries, community support and portability.</p>
            </div>
            <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto rounded-lg overflow-hidden shadow-lg hidden sm:block">
              <Image
                src="/images/classes/python-automation/Guido_van_Rossum.webp"
                alt="Guido van Rossum - Creator of Python"
                fill
                className="object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 text-center">
                Guido van Rossum
              </p>
            </div>
          </div>
        </div>


      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Installing Python and pip with conda</h3>
        <p className="tc2 mb-3"> Python environments are like self contained boxes that have all the software needed to execute your program. They contain the version of Python used to run your code, and any necessary packages and dependencies.</p>
        <p className="tc2 mb-3"></p>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Setting up virtual environments</h3>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Configuring VS Code for Python</h3>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Using Jupyter Notebooks</h3>
      </section>

      <section className="mb-4">
        <h3 className="text-xl font-semibold tc1 mb-2">Installing essential packages</h3>
      </section>

    </LectureTemplate>
  );
}

interface SetupLectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
function SetupLectureIcon(props: SetupLectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};

  return (
    <LectureIcon
      title="Setting Up Python"
      summary="Get your development environment ready for Python automation projects."
      displayMode={displayMode}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}

export { SetupLecture, SetupLectureIcon };
