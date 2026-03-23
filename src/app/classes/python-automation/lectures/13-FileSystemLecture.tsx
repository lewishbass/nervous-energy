'use client';
import React, { useEffect, useState } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';

import '@/styles/code.css';
import './lecture.css';

interface FileSystemLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function FileSystemLecture(props: FileSystemLectureProps | null) {
	const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

	// 3/23/2026 8 pm EST (UTC-5) = 2026-03-24T01:00:00Z
	const UNLOCK_TIME = new Date('2026-03-24T01:00:00Z');

	const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);

	useEffect(() => {
		Prism.highlightAll();
		setSolutionsUnlocked(new Date() >= UNLOCK_TIME);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">File System Automation</h2>
        <h3 className="tc2 lecture-section-header">Navigating, Creating, and Manipulating Files and Directories</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">What You&apos;ll Learn</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('file-system')}>File System</li>
          <li className="lecture-link" onClick={() => scrollToSection('paths')}>Paths</li>
          <li className="lecture-link" onClick={() => scrollToSection('suffixes-extensions')}>File Suffixes and Extensions</li>
          <li className="lecture-link" onClick={() => scrollToSection('absolute-relative-paths')}>Absolute vs Relative Paths</li>
          <li className="lecture-link" onClick={() => scrollToSection('creating-directories')}>Creating Directories</li>
          <li className="lecture-link" onClick={() => scrollToSection('navigating-directories')}>Navigating Directories</li>
          <li className="lecture-link" onClick={() => scrollToSection('deleting-trashing')}>Deleting and Trashing Files</li>
          <li className="lecture-link" onClick={() => scrollToSection('moving-copying')}>Moving and Copying Files</li>
          <li className="lecture-link" onClick={() => scrollToSection('finding-files')}>Finding Files</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-1')}>Exercise 1</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-2')}>Exercise 2</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-3')}>Exercise 3</li>
        </ul>
      </section>

      {/* File System */}
      <section className="lecture-section mini-scroll" id="file-system">
        <h3 className="lecture-section-header">File System</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          All your computer&apos;s data is stored in one long list. A <span className="lecture-bold">file system</span> is a way of allocating space, organizing data, and keeping track of where everything is.
        </p>

        <div className="my-6 ml-2">
          {([
            { icon: '💾', label: 'Physical Device', desc: 'Hardware that stores raw data', examples: 'Hard drives, SSDs, USB drives', accent: 'border-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-500/20', tag: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
            { icon: '🗂️', label: 'Partitions',       desc: 'Logical divisions of a physical device', examples: 'C:\\  D:\\  /dev/sda1', accent: 'border-purple-500', bg: 'bg-purple-500/10 dark:bg-purple-500/20', tag: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
            { icon: '⚙️', label: 'File System',       desc: 'Structure that organises blocks into files and directories', examples: 'NTFS, FAT32, ext4, APFS', accent: 'border-indigo-500', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', tag: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' },
            { icon: '📁', label: 'Directories',       desc: 'Special files that contain links to other files and directories', examples: 'Documents/, src/, node_modules/', accent: 'border-amber-500', bg: 'bg-amber-500/10 dark:bg-amber-500/20', tag: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
            { icon: '📄', label: 'Files',              desc: 'Individual pieces of data', examples: 'report.txt, photo.jpg, main.py', accent: 'border-emerald-500', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', tag: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
          ] as const).map((layer, i, arr) => (
            <div key={i} className="flex items-stretch gap-4">
              {/* Connector column */}
              <div className="flex flex-col items-center" style={{ minWidth: '2.5rem' }}>
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl border-2 ${layer.accent} ${layer.bg}`}>
                  {layer.icon}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-0.5 flex-1 my-1" style={{ background: 'linear-gradient(to bottom, rgb(99 102 241 / 0.4), rgb(99 102 241 / 0.05))' }} />
                )}
              </div>
              {/* Content */}
              <div className={`pb-5 pt-1 flex-1 ${i < arr.length - 1 ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="lecture-bold" style={{ fontSize: displayMode === 'slideshow' ? '1.4vw' : undefined }}>{layer.label}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${layer.tag}`} style={{ fontSize: displayMode === 'slideshow' ? '0.65vw' : '0.65rem' }}>{layer.examples}</span>
                </div>
                <p className="tc2 lecture-paragraph mb-0" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : undefined }}>{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="lecture-paragraph">
          The physical device stores information in <span className="lecture-bold">blocks</span> of data, which can be marked available, or owned by a specific file.
        </p>
        <p className="lecture-paragraph">
          The file system creates a master table that tracks which blocks each file occupies on the physical device, how much space it takes up, and other metadata like creation date, permissions, etc. When you access a file, the file system looks it up in the master table to find its location and retrieve it for you.
        </p>
        <p className="lecture-paragraph">
          Directories are a special type of file that contain links to other files and directories.
        </p>

        <CodeBlock className="lecture-codeblock" language="text" caption={'directory entry for "/home/user/"'}
          code={`Directory "/home/user/"
├── Entry: "."          → current directory, points to itself
├── Entry: ".."         → parent directory, points to the directory above
├── Entry: "documents"  → no suffix — directory
├── Entry: "file.txt"   → suffix .txt — text file
└── Entry: "photo.jpg"  → suffix .jpg — image file`} />
      </section>

      {/* Paths */}
      <section className="lecture-section mini-scroll" id="paths">
        <h3 className="lecture-section-header">Paths</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Directories can be nested inside each other to create a hierarchical structure.
          The base directory is called the <span className="lecture-bold">root</span>.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">OS</th>
                <th className="lecture-table-header">Root Symbol</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Linux</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">/</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Windows</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">C:\</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">macOS</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">/</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          A <span className="lecture-bold">path</span> is a direction to find a specific file in a specific location. Starting from the root directory, each name denotes the next child directory to navigate into.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">OS</th>
                <th className="lecture-table-header">Example Path</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell">Linux / macOS</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">/home/user/documents/file.txt</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell">Windows</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">C:\users\lewis\Desktop\program.py</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Each name in the path is separated by a special character called the <span className="lecture-bold">path separator</span>, which is <code className="lecture-code-inline">/</code> for Linux and macOS, and <code className="lecture-code-inline">\</code> for Windows.
        </p>
        <p className="lecture-paragraph">
          To navigate between folders in the terminal, type <code className="lecture-code-inline">cd path</code>.
          It is repetitive to type out the full path each time you want to navigate, so list the files in the current directory with <code className="lecture-code-inline">ls</code> (or <code className="lecture-code-inline">dir</code> on Windows), and use relative paths to navigate more quickly.
        </p>
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">.</code> symbol marks the current directory, and <code className="lecture-code-inline">..</code> marks the parent directory, so you can use them to navigate relative to your current location. Type <code className="lecture-code-inline">cd</code> followed by the name of the directory you want to navigate to, or type <code className="lecture-code-inline">cd ..</code> to return to the parent directory.
        </p>

        <CodeBlock className="lecture-codeblock" language="bash" caption="navigating with the terminal"
          code={`ls                  # list files in the current directory
cd documents        # navigate into the "documents" folder
cd ..               # go back up one level
cd ../pictures      # go up one level, then into "pictures"`} />
      </section>
      
      {/* File Suffixes and Extensions */}
      <section className="lecture-section mini-scroll" id="suffixes-extensions">
        <h3 className="lecture-section-header">File Suffixes and Extensions</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Each file is marked with a suffix (<code className="lecture-code-inline">.txt</code>, <code className="lecture-code-inline">.jpg</code>, <code className="lecture-code-inline">.py</code>) that tells the operating system how to interpret that file.
          When a file is opened, the operating system checks which program is associated with that file type, launches the program, and passes the file to it.
        </p>
        <p className="lecture-paragraph">
          When you click on an image in your file explorer, it launches the media viewer program and tells it to display that image. When you click a directory, the OS sees that it has no extension and navigates to that path in the file explorer itself.
        </p>
        <p className="lecture-paragraph">
          In Linux, when a file or directory name starts with a dot, it is hidden from the file explorer by default. In Windows, a folder&apos;s hidden status is determined by an associated file attribute.
        </p>
        <p className="lecture-paragraph">
          Changing the extension of a file can change which program your computer uses to open it, but it <span className="lecture-bold">does not change the actual contents</span> of the file. In addition, if you specify a program to open a file with, it will open regardless of the extension. This means that if you manually execute a Python program with the command <code className="lecture-code-inline">python file.txt</code>, it will run the code inside that file, even though it has a <code className="lecture-code-inline">.txt</code> extension.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Extension</th>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Opened With</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.py</code></td>
                <td className="lecture-table-cell">Python script</td>
                <td className="lecture-table-cell">Python interpreter</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.txt</code></td>
                <td className="lecture-table-cell">Plain text</td>
                <td className="lecture-table-cell">Text editor</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.jpg</code></td>
                <td className="lecture-table-cell">Image</td>
                <td className="lecture-table-cell">Image viewer</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.csv</code></td>
                <td className="lecture-table-cell">Tabular data</td>
                <td className="lecture-table-cell">Spreadsheet / text editor</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">.html</code></td>
                <td className="lecture-table-cell">Web page</td>
                <td className="lecture-table-cell">Web browser</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Absolute vs Relative Paths */}
      <section className="lecture-section mini-scroll" id="absolute-relative-paths">
        <h3 className="lecture-section-header">Absolute vs Relative Paths</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          An <span className="lecture-bold">absolute path</span> is a path that starts from the root directory and specifies the complete location of a file or directory. But it takes too much time to write out this long path every time, and mostly we want to operate in a folder close to where we are currently working.
        </p>
        <p className="lecture-paragraph">
          A <span className="lecture-bold">relative path</span> specifies a location relative to the current working directory. If you are currently in the directory <code className="lecture-code-inline">C:/users/lewis/Desktop</code> and you want to access the file <code className="lecture-code-inline">C:/users/lewis/Documents/file.txt</code>, you can use the relative path <code className="lecture-code-inline">../Documents/file.txt</code> instead of the full absolute path.
        </p>
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">..</code> in the relative path tells the operating system to go up one level to <code className="lecture-code-inline">C:/users/lewis/</code>, and then navigate down to <code className="lecture-code-inline">Documents/file.txt</code>.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Type</th>
                <th className="lecture-table-header">Example</th>
                <th className="lecture-table-header">When to Use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><span className="lecture-bold">Absolute</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">C:\users\lewis\Documents\file.txt</code></td>
                <td className="lecture-table-cell">Accessing computer-wide resources, external programs, datasets</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><span className="lecture-bold">Relative</span></td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">../Documents/file.txt</code></td>
                <td className="lecture-table-cell">Working within your project directory</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock className="lecture-codeblock" language="python" caption="converting a relative path to an absolute path"
          code={`import os

# get the absolute path of a relative path
abs_path = os.path.abspath("../Documents/file.txt")
print(abs_path)  # C:\\users\\lewis\\Documents\\file.txt`} />
      </section>

      {/* Creating Directories */}
      <section className="lecture-section mini-scroll" id="creating-directories">
        <h3 className="lecture-section-header">Creating Directories</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">os</code> module provides functions for interacting with the file system. The first step is to import the module with <code className="lecture-code-inline">import os</code>.
        </p>
        <p className="lecture-paragraph">
          To create a new directory, use the <code className="lecture-code-inline">os.mkdir()</code> function and pass in the name of the directory you want to create as a string argument. This will create a new folder in the current working directory.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="create a single directory"
          code={`import os

os.mkdir("my_folder")`} />

        <p className="lecture-paragraph">
          If the directory already exists, <code className="lecture-code-inline">os.mkdir()</code> will raise a <code className="lecture-code-inline text-red-400">FileExistsError</code>. To avoid this, you can check if the directory exists before trying to create it using <code className="lecture-code-inline">os.path.exists()</code>.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="check before creating"
          code={`if not os.path.exists("my_folder"):
    os.mkdir("my_folder")`} />

        <p className="lecture-paragraph">
          You can also use <code className="lecture-code-inline">os.makedirs()</code> to create nested directories in one step. For example, <code className="lecture-code-inline">os.makedirs(&quot;parent/child/grandchild&quot;)</code> will create the entire directory structure if it does not already exist. This takes the optional argument <code className="lecture-code-inline">exist_ok</code>, which if set to <code className="lecture-code-inline">True</code>, will not raise an error if the directory already exists.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="create nested directories safely"
          code={`os.makedirs("parent/child/grandchild", exist_ok=True)`} />
      </section>

      {/* Navigating Directories */}
      <section className="lecture-section mini-scroll" id="navigating-directories">
        <h3 className="lecture-section-header">Navigating Directories</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">os</code> module provides most of the functions you need for inspecting, navigating, and manipulating the file system.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Function</th>
                <th className="lecture-table-header">Purpose</th>
                <th className="lecture-table-header">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.getcwd()</code></td>
                <td className="lecture-table-cell">Get current working directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">&quot;C:\\users\\lewis&quot;</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.mkdir(path)</code></td>
                <td className="lecture-table-cell">Create a single directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.mkdir(&quot;data&quot;)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.makedirs(path)</code></td>
                <td className="lecture-table-cell">Create nested directories</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.makedirs(&quot;a/b/c&quot;)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.listdir(path)</code></td>
                <td className="lecture-table-cell">List contents of a directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.listdir(&quot;.&quot;)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.remove(path)</code></td>
                <td className="lecture-table-cell">Delete a file</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.remove(&quot;old.txt&quot;)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.rmdir(path)</code></td>
                <td className="lecture-table-cell">Delete an empty directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.rmdir(&quot;empty_dir&quot;)</code></td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.path.isdir(path)</code></td>
                <td className="lecture-table-cell">Check if path is a directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.path.isdir(&quot;data&quot;)</code></td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.chdir(path)</code></td>
                <td className="lecture-table-cell">Change working directory</td>
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.chdir(&quot;..&quot;)</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          Using <code className="lecture-code-inline">chdir</code> to navigate through the file system changes your current working directory and where all future file system actions take place. This can be useful for working within a specific folder, but if you forget to return to your original directory, you might end up creating files in the wrong place.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="navigating and listing directory contents"
          code={`import os

print(os.getcwd())           # print current directory
print(os.listdir("."))       # list files in current directory

os.chdir("my_project")      # move into "my_project"
print(os.getcwd())           # now inside "my_project"

os.chdir("..")               # go back to original directory`} />
      </section>

      {/* Deleting and Trashing Files */}
      <section className="lecture-section mini-scroll" id="deleting-trashing">
        <h3 className="lecture-section-header">Deleting and Trashing Files</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">os</code> module provides functions for deleting files and directories:
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Function</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.remove(path)</code></td>
                <td className="lecture-table-cell">Permanently delete a single file</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.rmdir(path)</code></td>
                <td className="lecture-table-cell">Delete an empty directory</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">shutil.rmtree(path)</code></td>
                <td className="lecture-table-cell">Recursively delete a directory and all its contents</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="lecture-paragraph">
          But these operations delete files <span className="lecture-bold">permanently</span>, and do not take advantage of the recycling bin safety net.
          The <code className="lecture-code-inline">send2trash</code> library provides a safer way to delete files by sending them to the trash instead of permanently deleting them.
        </p>

        <CodeBlock className="lecture-codeblock" language="python" caption="permanent deletion vs safe trash — be careful with os.remove!"
          code={`import os
import send2trash

# DANGEROUS - permanently deletes all .log files
for filename in os.listdir("logs"):
    filepath = os.path.join("logs", filename)
    os.remove(filepath)          # gone forever!

# SAFE - sends all .log files to the recycling bin
for filename in os.listdir("logs"):
    filepath = os.path.join("logs", filename)
    send2trash.send2trash(filepath)  # recoverable from trash`} />
      </section>

      {/* Moving and Copying Files */}
      <section className="lecture-section mini-scroll" id="moving-copying">
        <h3 className="lecture-section-header">Moving and Copying Files</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <code className="lecture-code-inline">os</code> module only provides a function for renaming files. The <code className="lecture-code-inline">shutil</code> module provides functions for copying and moving files and directories.
        </p>

        <div className="mb-4 mx-auto">
          <table className="lecture-table">
            <thead>
              <tr>
                <th className="lecture-table-header">Function</th>
                <th className="lecture-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">os.rename(src, dst)</code></td>
                <td className="lecture-table-cell">Rename a file or directory</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">shutil.copy(src, dst)</code></td>
                <td className="lecture-table-cell">Copy a file (content only)</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">shutil.copy2(src, dst)</code></td>
                <td className="lecture-table-cell">Copy a file with metadata (timestamps, permissions)</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-cell"><code className="lecture-code-inline">shutil.copytree(src, dst)</code></td>
                <td className="lecture-table-cell">Recursively copy an entire directory tree</td>
              </tr>
              <tr className="">
                <td className="lecture-table-cell"><code className="lecture-code-inline">shutil.move(src, dst)</code></td>
                <td className="lecture-table-cell">Move a file or directory to a new location</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock className="lecture-codeblock" language="python" caption="copying, moving, and renaming files"
          code={`import shutil
import os

# copy a file
shutil.copy("report.txt", "backup/report.txt")

# copy with metadata preserved
shutil.copy2("report.txt", "backup/report.txt")

# copy an entire directory
shutil.copytree("my_project", "my_project_backup")

# move a file to a different folder
shutil.move("report.txt", "archive/report.txt")

# rename a file
os.rename("old_name.txt", "new_name.txt")`} />
      </section>

      {/* Finding Files */}
      <section className="lecture-section mini-scroll" id="finding-files">
        <h3 className="lecture-section-header">Finding Files</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Python provides several ways to search for files within directories:
        </p>

        <p className="lecture-paragraph">
          <span className="lecture-bold">os.walk()</span> — recursively walks through a directory tree, yielding the directory path, subdirectories, and filenames at each level. Useful for searching through every file in a folder.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="find all .py files using os.walk()"
          code={`import os

for dirpath, dirnames, filenames in os.walk("my_project"):
    for filename in filenames:
        if filename.endswith(".py"):
            print(os.path.join(dirpath, filename))`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">glob</span> — matches files using shell-style wildcard patterns. The <code className="lecture-code-inline">*</code> character matches any sequence of characters, and <code className="lecture-code-inline">**</code> matches directories recursively.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="find files with glob patterns"
          code={`import glob

# all .txt files in the current directory
txt_files = glob.glob("*.txt")

# all .py files in any subdirectory (recursive)
py_files = glob.glob("**/*.py", recursive=True)`} />

        <p className="lecture-paragraph">
          <span className="lecture-bold">pathlib</span> — an object-oriented alternative to <code className="lecture-code-inline">os.path</code>. Provides the <code className="lecture-code-inline">Path.glob()</code> method for pattern matching and many convenient methods for inspecting files.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="find files with pathlib"
          code={`from pathlib import Path

# all .csv files recursively
for p in Path("data").glob("**/*.csv"):
    print(p, p.stat().st_size, "bytes")`} />

        <p className="lecture-paragraph">
          You can also filter results by file size, modification date, or other attributes using <code className="lecture-code-inline">os.path.getsize()</code> and <code className="lecture-code-inline">os.path.getmtime()</code>.
        </p>
        <CodeBlock className="lecture-codeblock" language="python" caption="filter files by size — find files larger than 1 MB"
          code={`import os

for dirpath, dirnames, filenames in os.walk("."):
    for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        size = os.path.getsize(filepath)
        if size > 1_000_000:  # greater than 1 MB
            print(f"{filepath} — {size / 1_000_000:.2f} MB")`} />
      </section>

      {/* Exercise 1 */}
      <section className="lecture-section mini-scroll" id="exercise-1">
        <h3 className="lecture-section-header">Exercise 1 — Keyword Search</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Write a program that searches through all files in a directory for a keyword and reports close matches.
        </p>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Use <code className="lecture-code-inline">os.walk()</code> to iterate over every file in a given directory and its subdirectories.</li>
          <li>For each file, open it using <code className="lecture-code-inline">with open(filepath) as f</code> and read its content.</li>
          <li>Use <code className="lecture-code-inline">difflib.get_close_matches()</code> to search for close matches to the keyword within each line of the file.</li>
          <li>Collect all matches across all files, keeping track of which file and line number each match was found in.</li>
          <li>Print the best matches to the console, sorted by relevance.</li>
        </ul>

        {solutionsUnlocked ? (
        <CodeBlock className="lecture-codeblock" language="python" caption="starter code"
          code={`import os
import difflib

def search_directory(directory, keyword):
    matches = []
    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, "r") as f:
                    for line_num, line in enumerate(f, 1):
                        words = line.split()
                        close = difflib.get_close_matches(keyword, words)
                        if close:
                            matches.append((filepath, line_num, close, line.strip()))
            except:
                pass  # skip binary or unreadable files
    return matches

results = search_directory(".", "function")
for filepath, line_num, close, line in results:
    print(f"{filepath}:{line_num}  matches: {close}")
    print(f"    {line}")`} />
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">🔒</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 23, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 2 */}
      <section className="lecture-section mini-scroll" id="exercise-2">
        <h3 className="lecture-section-header">Exercise 2 — Log File Generator</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Write a program that creates a log directory and generates <code className="lecture-code-inline">.log</code> files for the next 7 days, with random log entries for each hour.
        </p>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Create a directory called <code className="lecture-code-inline">logs</code> using <code className="lecture-code-inline">os.makedirs()</code> with <code className="lecture-code-inline">exist_ok=True</code>.</li>
          <li>For each of the next 7 days, create a file named with the date, e.g. <code className="lecture-code-inline">2025-01-15.log</code>.</li>
          <li>For each hour of the day (0–23), write a log entry with a random message from a predefined list.</li>
          <li>Each log line should include the timestamp and the message.</li>
        </ul>

        {solutionsUnlocked ? (
        <CodeBlock className="lecture-codeblock" language="python" caption="starter code"
          code={`import os
import random
from datetime import datetime, timedelta

messages = [
    "System running normally",
    "User login detected",
    "Backup completed",
    "Warning: disk space low",
    "Error: connection timeout",
    "Scheduled task executed",
    "Cache cleared",
    "New update available",
]

os.makedirs("logs", exist_ok=True)

today = datetime.now()
for day_offset in range(7):
    date = today + timedelta(days=day_offset)
    filename = date.strftime("%Y-%m-%d") + ".log"
    filepath = os.path.join("logs", filename)
    with open(filepath, "w") as f:
        for hour in range(24):
            timestamp = date.replace(hour=hour, minute=0, second=0)
            message = random.choice(messages)
            f.write(f"[{timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {message}\\n")

print("Log files created successfully!")`} />
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">🔒</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 23, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 3 */}
      <section className="lecture-section mini-scroll" id="exercise-3">
        <h3 className="lecture-section-header">Exercise 3 — Recursive Directory Listing</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Create the function <code className="lecture-code-inline">list_all_files(dir_path, depth)</code> that takes in a directory path and prints out the names of all files contained within that directory and its subdirectories.
        </p>

        <ul className="lecture-text list-disc list-inside tc2 space-y-2 ml-4 mb-4">
          <li>Use <code className="lecture-code-inline">os.listdir()</code> to list the contents of the current directory.</li>
          <li>If an entry is a file, print its name with indentation matching the current depth.</li>
          <li>If an entry is a directory, print its name with indentation, then recursively call <code className="lecture-code-inline">list_all_files</code> on that directory to list its contents as well.</li>
          <li>In front of each print, indent to the current depth for visualization using spaces or a pipe character.</li>
        </ul>

        {solutionsUnlocked ? (<>
        <CodeBlock className="lecture-codeblock" language="python" caption="starter code"
          code={`import os

def list_all_files(dir_path, depth=0):
    indent = "│   " * depth
    items = os.listdir(dir_path)
    for item in items:
        full_path = os.path.join(dir_path, item)
        if os.path.isdir(full_path):
            print(f"{indent}├── 📁 {item}/")
            list_all_files(full_path, depth + 1)
        else:
            print(f"{indent}├── 📄 {item}")

list_all_files(".")`} />

        <CodeBlock className="lecture-codeblock" language="text" caption="expected output"
          code={`├── 📁 logs/
│   ├── 📄 2025-01-15.log
│   ├── 📄 2025-01-16.log
│   ├── 📄 2025-01-17.log
├── 📁 my_project/
│   ├── 📄 main.py
│   ├── 📁 utils/
│   │   ├── 📄 helpers.py
├── 📄 readme.txt`} />
        </>) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">🔒</span>
            <span>Solution unlocked after class on <span className="lecture-bold">March 23, 2026 at 8 pm EST</span>.</span>
          </div>
        )}
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
