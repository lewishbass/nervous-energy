'use client';
import React from 'react';
import Image from 'next/image';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';

import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import '@/styles/code.css'
import './lecture.css';

interface SetupLectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function SetupLecture(props: SetupLectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  const isScroll = displayMode === 'scrollable';
  const [installTab, setInstallTab] = useState<'linux' | 'windows'>('windows');
  const [vscodeTab, setVscodeTab] = useState<'linux' | 'windows'>('windows');
  const [firstProgramTab, setFirstProgramTab] = useState<'texteditor' | 'vscode' | 'jupyter'>('texteditor');
  const [cliTab, setCliTab] = useState<'linux' | 'windows'>('windows');

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <LectureTemplate
      displayMode={displayMode}
      className={className}
      style={style}
      exitFSCallback={exitFSCallback}
    >
      <section className="lecture-section mini-scroll">
        <h2 className={`tc1 lecture-big-title`}>Setting Up Python</h2>
      </section>

      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">Sections</h3>
        <div className="lecture-header-decorator" />
        <div className="flex flex-row">
          <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
            <li className="lecture-link" onClick={() => scrollToSection('what-is-python')}>What is Python?</li>
            <li className="lecture-link" onClick={() => scrollToSection('python-libraries')}>Python Libraries</li>
            <li className="lecture-link" onClick={() => scrollToSection('virtual-environments')}>Virtual Environments</li>
            <li className="lecture-link" onClick={() => scrollToSection('command-line-interface')}>Command Line Interface</li>
            <li className="lecture-link" onClick={() => scrollToSection('installing-miniconda')}>Installing Miniconda</li>
            <li className="lecture-link" onClick={() => scrollToSection('configuring-vscode')}>Configuring VS Code for Python</li>
            <li className="lecture-link" onClick={() => scrollToSection('jupyter-notebooks')}>Jupyter Notebooks</li>
            <li className="lecture-link" onClick={() => scrollToSection('first-program')}>First Program</li>
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

      <section className="lecture-section mini-scroll" id="what-is-python">
        <h3 className="lecture-section-header">What is Python?</h3>
        <div className="lecture-header-decorator" />
        <div className="flex-1">
          <div className="flex flex-row">
            <div className="mr-0 sm:mr-6">
              <p className="lecture-paragraph"> Python is a high-level programming language designed with a focus on readability and streamlined syntax.</p>
              <p className="lecture-paragraph"> It was developed in the late 1980s by Guido van Rossum and Python 3 (released in 2008) is the most popular programming language today.</p>
              <p className="lecture-paragraph"> Python remains dominant in <span className="lecture-bold">data science</span>, <span className="lecture-bold">machine learning</span> and <span className="lecture-bold">scientific computing</span> thanks to its powerful libraries, community support and portability.</p>
            </div>
            <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto rounded-lg overflow-hidden shadow-lg hidden sm:block">
              <Image
                src="/images/classes/python-automation/Guido_van_Rossum.webp"
                alt="Guido van Rossum - Creator of Python"
                fill
                className="object-cover"
              />
              <p className="lecture-image-caption">
                Guido van Rossum
              </p>
            </div>
          </div>
        </div>

      </section>


      <section className="lecture-section mini-scroll" id="python-libraries">
        <h3 className="lecture-section-header">Python Libraries</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph"> Most of Python's functionality is enabled through libraries. </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <span className="lecture-bold">First party libraries</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://docs.python.org/3/library/os.html" target="_blank" rel="noopener noreferrer">os</a></td>
                  <td className="lecture-table-cell">Operating system interface, file operations</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://docs.python.org/3/library/sys.html" target="_blank" rel="noopener noreferrer">sys</a></td>
                  <td className="lecture-table-cell">Command line integration</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://docs.python.org/3/library/datetime.html" target="_blank" rel="noopener noreferrer">datetime</a></td>
                  <td className="lecture-table-cell">Date and time manipulation</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://docs.python.org/3/library/json.html" target="_blank" rel="noopener noreferrer">json</a></td>
                  <td className="lecture-table-cell">JSON encoding and decoding</td>
                </tr>
                <tr>
                  <td className="lecture-table-header"><a href="https://docs.python.org/3/library/re.html" target="_blank" rel="noopener noreferrer">re</a></td>
                  <td className="lecture-table-cell">Regular expression operations</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <span className="lecture-bold">Third party libraries</span>
            <table className="lecture-table">
              <tbody>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener noreferrer">numpy</a></td>
                  <td className="lecture-table-cell">Fast array operations</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener noreferrer">pandas</a></td>
                  <td className="lecture-table-cell">Large database management</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://matplotlib.org/stable/contents.html" target="_blank" rel="noopener noreferrer">matplotlib</a></td>
                  <td className="lecture-table-cell">Graphing and decorating</td>
                </tr>
                <tr className="lecture-table-row">
                  <td className="lecture-table-header"><a href="https://requests.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">requests</a></td>
                  <td className="lecture-table-cell">HTTP library for API calls</td>
                </tr>
                <tr>
                  <td className="lecture-table-header"><a href="https://selenium-python.readthedocs.io/" target="_blank" rel="noopener noreferrer">selenium</a></td>
                  <td className="lecture-table-cell">Browser automation and web scraping</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="lecture-paragraph">
          Performance sensitive and core libraries are often written in <a className="lecture-link" href="https://en.wikipedia.org/wiki/C_(programming_language)" target="_blank" rel="noopener noreferrer">C</a> or <a className="lecture-link" href="https://en.wikipedia.org/wiki/C%2B%2B" target="_blank" rel="noopener noreferrer">C++</a> for speed, so calling an external function will almost always be faster than reimplementing the same algorithm in pure Python.
        </p>
        <p className="lecture-paragraph">
          These libraries are designed to be modular, easy to use, and easy to install. Compared to other languages, Python modules can be installed from a central source with a single command, imported with a single line, and expected to work across different operating systems and hardware with minimal configuration.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`import numpy as np
randomNumbers = np.random.rand(1000)  # generate 1000 random numbers`}
          language="python"
          caption="importing and using a python library"
        />
        <p className="lecture-paragraph">
          Unfortunately, backwards compatibility is an exception rather than a rule, so some programs will require specific versions of their dependencies.
        </p>
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://pip.pypa.io/en/stable/" target="_blank" rel="noopener noreferrer">Package Installer for Python (pip)</a> is Pythons built in tool for installing and managing third party libraries.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`pip install numpy`}
          language="bash"
          caption="installing a library using pip"
        />
        <p className='lecture-paragraph'>
          This installs the library in the current Python environment, making it available for import in your scripts.
        </p>
        {/*<div className="flex flex-col justify-center mb-3">
          <pre className="code-block line-numbers" data-language="Bash">
            <code className="language-">
              {`pip uninstall numpy`}
            </code>
          </pre>
          <div className="text-center tc3">
            removing a library using pip
          </div>
        </div>*/}
      </section>

      <section className="lecture-section mini-scroll" id="virtual-environments">
        <h3 className="lecture-section-header">Virtual Environments</h3>
        <div className="lecture-header-decorator" />
        <div className="flex flex-row mb-6 gap-8">
          <div>
            <p className="lecture-paragraph">
              Tracking which programs need which versions of which libraries can get complicated quickly.
              Virtual environments are a neat little box that contain all the packages your program needs to run in their exact versions.
              This way, updating a package for one project won't break another project that relies on an older version.
            </p>
            <p className="lecture-paragraph">
              <a className="lecture-link" href="https://docs.conda.io/en/latest/miniconda.html" target="_blank" rel="noopener noreferrer">Miniconda</a> is a popular, minimalist tool for creating, managing, switching and exporting virtual environments.
            </p>
          </div>
          <div className="relative w-full max-w-[150px] mx-auto hidden sm:block rounded-lg overflow-hidden shadow-lg bg-yellow-50/50 dark:bg-slate-800/50">
            <div className="relative mx-3 mt-2 mb-10 w-auto aspect-square">
              <Image
                src="/images/classes/python-automation/anaconda.svg"
                alt="Python Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="lecture-image-caption">
              Anaconda
            </p>
          </div>
        </div>

        <CodeBlock className="lecture-codeblock"
          code={`conda create -n myenv python=3.10 numpy pandas
conda activate myenv`}
          language="bash"
          caption="creating and activating a conda environment with the numpy and pandas libraries"
        />
        <p className="lecture-paragraph">
          Lists of requirements can be saved to a file (typically named <code className="lecture-code-inline">environment.yml</code> or <code className="lecture-code-inline">requirements.txt</code>) and shared with others to recreate the same environment.
        </p>
        <CodeBlock className="lecture-codeblock"
          code={`conda env export > environment.yml
conda env create -f environment.yml`}
          language="bash"
          caption="exporting and creating a conda environment from a YAML file"
        />

        <CodeBlock className="lecture-codeblock"
          code={`name: myenv
channels:
  - defaults
dependencies:
  - python=3.10
  - numpy=1.24.2`}
          language="yaml"
          caption="example environment.yml file"
          filename='environment.yml'
        />

      </section>

      <section className="lecture-section mini-scroll" id="command-line-interface">
        <h3 className="lecture-section-header">Command Line Interface</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          The <a className="lecture-link" href="https://www.w3schools.com/whatis/whatis_cli.asp" target="_blank" rel="noopener noreferrer">Command Line Interface (CLI)</a> or terminal is the original way to execute commands on a computer. Most Python development tools, package managers, and automation scripts are designed to run from the command line.
        </p>
        <p className="lecture-paragraph">
          Windows and Linux/Mac systems have different terminal applications, with some overlap in commands.
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${cliTab === 'windows' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setCliTab('windows'); e.stopPropagation(); }}
            >
              Windows
            </button>
            <button
              className={`lecture-tab ${cliTab === 'linux' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setCliTab('linux'); e.stopPropagation(); }}
            >
              Linux
            </button>
          </div>

          {cliTab === 'windows' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                On Windows, you can open a terminal by searching for "Command Prompt", "PowerShell", or "Windows Terminal" in the Start Menu.
              </p>
              <p className="mb-3">
                <span className="lecture-bold">Common CLI Commands on Windows</span>
              </p>
              <table className="lecture-table">
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">cd [path]</td>
                    <td className="lecture-table-cell">Change directory - navigate to a different folder</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">dir</td>
                    <td className="lecture-table-cell">List files and folders in current directory</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">cd</td>
                    <td className="lecture-table-cell">Print working directory - show your current location</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">mkdir [name]</td>
                    <td className="lecture-table-cell">Make directory - create a new folder</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">python [file]</td>
                    <td className="lecture-table-cell">Run a Python script</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {cliTab === 'linux' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                On Linux and Mac, look for "Terminal" in your applications (some distributions support the <code className="lecture-code-inline">Ctrl+Alt+T</code> shortcut).
              </p>
              <p className="mb-3">
                <span className="lecture-bold">Common CLI Commands on Linux/Mac</span>
              </p>
              <table className="lecture-table">
                <tbody>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">cd [path]</td>
                    <td className="lecture-table-cell">Change directory - navigate to a different folder</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">ls</td>
                    <td className="lecture-table-cell">List files and folders in current directory</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">pwd</td>
                    <td className="lecture-table-cell">Print working directory - show your current location</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">mkdir [name]</td>
                    <td className="lecture-table-cell">Make directory - create a new folder</td>
                  </tr>
                  <tr className="lecture-table-row">
                    <td className="lecture-table-header">python [file]</td>
                    <td className="lecture-table-cell">Run a Python script</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <CodeBlock className="lecture-codeblock"
          code={`cd Documents/Projects
python my_script.py`}
          language="bash"
          caption="navigating to a project folder and running a Python script"
        />

        <p className="lecture-paragraph">
          <span className="tc1 font-semibold">Tip:</span> In most terminals, you can use the up arrow key to recall previous commands, and Tab to auto-complete file and folder names.
        </p>
      </section>
      <section className="lecture-section mini-scroll" id="installing-miniconda">
        <h3 className="lecture-section-header">Installing Miniconda</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          This section will give a quick overview of installing Miniconda, please refer to the <a href="https://www.anaconda.com/docs/getting-started/miniconda/install" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">official documentation</a> for more detailed instructions.
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${installTab === 'windows' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setInstallTab('windows'); e.stopPropagation(); }}
            >
              Windows
            </button>
            <button
              className={`lecture-tab ${installTab === 'linux' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setInstallTab('linux'); e.stopPropagation(); }}
            >
              Linux
            </button>
          </div>

          {installTab === 'linux' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                Download and run the Miniconda installer script for Linux:
              </p>
              <CodeBlock className="lecture-codeblock"
                code={`wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh`}
                language="bash"
                caption="downloading and installing Miniconda on Linux"
              />
              <p className="mb-3">
                Follow the prompts to complete the installation. You may need to restart your terminal or run <code className="lecture-code-inline">source ~/.bashrc</code> to activate conda.
              </p>
            </div>
          )}

          {installTab === 'windows' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                Download the Miniconda installer for Windows using PowerShell:
              </p>
              <CodeBlock className="lecture-codeblock"
                code={`Invoke-WebRequest -Uri "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe" -OutFile ".\\Miniconda3-latest-Windows-x86_64.exe"`}
                language="powershell"
                caption="downloading Miniconda installer on Windows"
              />
              <p className="mb-3">
                Run the downloaded <code className="lecture-code-inline">Miniconda3-latest-Windows-x86_64.exe</code> file and follow the installation wizard. Make sure to check "Add Miniconda to PATH" during installation.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="lecture-section mini-scroll" id="configuring-vscode">
        <h3 className="lecture-section-header">Configuring VS Code for Python</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <a className="lecture-link" href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">VSCode</a> is a popular code editor and <a className='lecture-bold' href="https://en.wikipedia.org/wiki/Integrated_development_environment" target='_blank' rel="noopener noreferrer">Integrated Development Environment (IDE)</a> with a wide range of community extensions for language support, development and customization.
        </p>
        <p className="lecture-paragraph">
          This course will primarily use VSCode, but you are free to use any code editor or IDE you prefer. Alternatives include&nbsp;
          <a className='lecture-bold' href='https://thonny.org/' target="_blank" rel="noopener noreferrer">Thonny</a>,&nbsp;
          <a className='lecture-bold' href='http://www.jetbrains.com/pycharm/' target="_blank" rel="noopener noreferrer">PyCharm</a>,&nbsp;
          <a className='lecture-bold' href='https://jupyter.org/' target="_blank" rel="noopener noreferrer">Jupyter Notebook</a> and&nbsp;
          <a className='lecture-bold' href='https://www.sublimetext.com/' target="_blank" rel="noopener noreferrer">Sublime Text</a>.

        </p>


        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${vscodeTab === 'windows' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setVscodeTab('windows'); e.stopPropagation(); }}
            >
              Windows
            </button>
            <button
              className={`lecture-tab ${vscodeTab === 'linux' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setVscodeTab('linux'); e.stopPropagation(); }}
            >
              Linux
            </button>
          </div>

          {vscodeTab === 'windows' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                Download and install VS Code for Windows through the <a href="ms-windows-store://pdp/?productid=xp9khm4bk9fz7q" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">Windows Store</a>.
              </p>
              <p className="mb-3">
                Alternatively, download the installer from the <a href="https://code.visualstudio.com/download" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">official VS Code website</a> and run it manually.
              </p>
            </div>
          )}

          {vscodeTab === 'linux' && (
            <div className='lecture-tab-content'>
              <p className="mb-3">
                For Ubuntu/Debian-based distributions, download the <a href="https://go.microsoft.com/fwlink/?LinkID=760868" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">VS Code .deb package</a> and install it using:
              </p>
              <CodeBlock className="lecture-codeblock"
                code={`sudo apt install ./<file>.deb`}
                language="bash"
                caption="installing VS Code on Ubuntu/Debian"
              />
              <p className="mb-3">
                For other distributions, refer to the <a href="https://code.visualstudio.com/docs/setup/linux" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">VS Code Linux installation guide</a>.
              </p>
            </div>
          )}
        </div>


        <div>
          <p className="lecture-paragraph">Useful VS Code extensions (install through the extensions panel):</p>
          <table className="lecture-table">
            <tbody>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Python</td>
                <td className="lecture-table-cell">Core Python support: linting, debugging, testing, environment selection and IntelliSense.</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Pylance</td>
                <td className="lecture-table-cell">Type checking, rich completions and better IntelliSense.</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Jupyter</td>
                <td className="lecture-table-cell">Run and edit Jupyter notebooks directly in VS Code, with interactive Python kernel support.</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Spell Checker</td>
                <td className="lecture-table-cell">Detect and correct spelling errors in your code comments and strings.</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Remote Dev</td>
                <td className="lecture-table-cell">Develop inside a container, remote machine or WSL with full VS Code support.</td>
              </tr>
              <tr className="lecture-table-row">
                <td className="lecture-table-header">Copilot</td>
                <td className="lecture-table-cell">LLM powered code editing and completion</td>
              </tr>
              <tr>
                <td className="lecture-table-header">Git</td>
                <td className="lecture-table-cell">source control integration</td>
              </tr>
            </tbody>
          </table>

        </div>

      </section>

      <section className="lecture-section mini-scroll" id="jupyter-notebooks">
        <h3 className="lecture-section-header">Jupyter Notebooks</h3>
        <div className="lecture-header-decorator" />
        <div className="flex flex-row mb-6 gap-8">
          <div>
            <p className="lecture-paragraph">
              Python scripts that deal with large datasets, heavy libraries or lengthy computations take time to run, and dealing with crashes and bugs is time consuming when you have to re-run the entire script every time.
            </p>
            <p className="lecture-paragraph">
              <a className="lecture-link" href="https://docs.jupyter.org/en/latest/" target="_blank" rel="noopener noreferrer">Jupyter notebooks</a> run code in small contained snippets. It keeps variables and modules loaded on crashes, allowing code to quickly re-run, and be changed on the fly.
            </p>
          </div>
          <div className="relative w-full max-w-[150px] mx-auto hidden sm:block rounded-lg overflow-hidden shadow-lg bg-yellow-50">
            <div className="relative mx-3 mt-2 mb-10 w-auto aspect-square">
              <Image
                src="/images/classes/python-automation/Jupyter_logo.svg"
                alt="Jupyter Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="lecture-image-caption">
              Jupyter Notebooks
            </p>
          </div>
        </div>

        <p className="lecture-paragraph">
          They are made up of cells that can contain code or text. Running a code cell executes the code and displays the output directly below it, while text cells can include formatted explanations, images, and links using Markdown.
        </p>

        <p className="lecture-paragraph">
          You can create a Jupyter notebook in several ways:
        </p>
        <ul className="list-none tc3 space-y-2 mb-3 px-8">
          <li className="lecture-list-item-card">Open a <code className="lecture-code-inline">.ipynb</code> file in VS Code (which will prompt you to install the associated extensions)</li>
          <li className="lecture-list-item-card">
            Install the Jupyter conda packages and run the following command in your terminal to open the Jupyter interface in your web browser:
            <br /><br />
            <CodeBlock className="lecture-codeblock"
              code={`conda install jupyter\njupyter notebook # or 'jupyter lab' for the lab interface`}
              language="bash"
              caption="installing and launching Jupyter Notebook"
            />
          </li>
          <li className="lecture-list-item-card">
            Use <a href="https://colab.research.google.com/" className="lecture-bold-blue" target="_blank" rel="noopener noreferrer">Google Colab</a> for free cloud-based notebooks.<br />
            These are stored in your google drive for easy access and sharing.<br />
            Google provides limited free access to their GPUs and TPUs.
          </li>
        </ul>


      </section>

      <section className="lecture-section mini-scroll" id="first-program">
        <h3 className="lecture-section-header">First Program</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          Let's write a simple Python program that prints "Hello, World!" to the console. This is a traditional first program to make sure your development environment is set up correctly and everything runs.
        </p>
        <p className="lecture-paragraph">
          You have a variety of options for development, VSCode is the most robust, but plain text editors are convenient for quick tests, and Jupyter notebooks make remote development easy.
        </p>

        <div className="mb-4">
          <div className="lecture-tab-container">
            <button
              className={`lecture-tab ${firstProgramTab === 'texteditor' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFirstProgramTab('texteditor'); e.stopPropagation(); }}
            >
              Text Editor
            </button>
            <button
              className={`lecture-tab ${firstProgramTab === 'vscode' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFirstProgramTab('vscode'); e.stopPropagation(); }}
            >
              VS Code
            </button>
            <button
              className={`lecture-tab ${firstProgramTab === 'jupyter' ? 'lecture-tab-active' : 'lecture-tab-inactive'}`}
              onClick={(e) => { setFirstProgramTab('jupyter'); e.stopPropagation(); }}
            >
              Jupyter
            </button>
          </div>

          {firstProgramTab === 'texteditor' && (
            <div className='lecture-tab-content'>
              <ul className="list-decimal list-inside tc3 space-y-8">
                <li >Create and save a new file called <code className="lecture-code-inline">hello.py</code> using any text editor (Notepad, nano, vim, etc.).
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`print("Hello, World!")`}
                    language="python"

                    filename="hello.py"
                  />
                </li>
                <li >Open your terminal or command prompt and activate conda
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`conda activate myenv  # replace 'myenv' with your environment name`}
                    language="bash"
                  />
                </li>
                <li >Navigate to the directory where you saved <code className="lecture-code-inline">hello.py</code> using the <code className="lecture-code-inline">cd</code> command.
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`cd path/to/your/directory`}
                    language="bash"
                  />
                </li>
                <li >Call Python to run your script:
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`python hello.py`}
                    language="bash"
                  />
                </li>
              </ul>

              <p className="mb-3">
                You should see <code className="lecture-code-inline">Hello, World!</code> printed to the console.
              </p>
            </div>
          )}

          {firstProgramTab === 'vscode' && (
            <div className='lecture-tab-content'>
              <ul className="list-decimal list-inside tc3 space-y-8">
                <li>Open VS Code and create a new file called <code className="lecture-code-inline">hello.py</code>. Add the following code (and save the file):
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`print("Hello, World!")`}
                    language="python"
                    filename="hello.py"
                  />
                </li>
                <li>
                  Open the command palette (<code className="lecture-code-inline">Ctrl+Shift+P</code> or <code className="lecture-code-inline">Cmd+Shift+P</code> on Mac) and type "Python: Select Interpreter". Choose the Python interpreter from the conda environment you set up earlier.
                </li>
                <li>Open the integrated terminal in VS Code (<code className="lecture-code-inline">Ctrl+`</code> or <code className="lecture-code-inline">Cmd+`</code> on Mac) and activate your conda environment.
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`conda activate myenv  # replace 'myenv' with your environment name`}
                    language="bash"
                  />
                </li>
                <li>You can run the script in several ways:
                  <ul className="list-disc list-inside tc3 space-y-2 mb-3 ml-4">
                    <li>Click the play button (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
                      </svg>
                      ) in the top-right corner of the editor</li>
                    <li>Right-click in the editor and select "Run Python" {">"} "Run Python File in Terminal"</li>

                    <li>Run <code className="lecture-code-inline">python hello.py</code> in the integrated terminal</li>
                  </ul>
                </li>
                <li>The output <code className="lecture-code-inline">Hello, World!</code> will appear in the integrated terminal at the bottom of VS Code.</li>
              </ul>
            </div>
          )}

          {firstProgramTab === 'jupyter' && (
            <div className='lecture-tab-content'>
              <ul className="list-decimal list-inside tc3 space-y-8">
                <li>Open your editor of choice
                  <div className="flex flex-row gap-4 mt-2 w-full justify-evenly">
                    <div className="lecture-list-item-card flex-1">
                      <div className="w-full text-center font-semibold mb-2 tc1">VSCode</div>
                      <p className="text-sm">Launch from Start Menu or run the command <code className="lecture-code-inline">code</code> in your terminal</p>
                    </div>
                    <div className="lecture-list-item-card flex-2">
                      <div className="w-full text-center font-semibold mb-2 tc1">Jupyter</div>
                      <p className="text-sm mb-2">Make sure the jupyter conda package was installed and activated with</p>
                      <CodeBlock className="lecture-codeblock mt-2"
                        code={`conda activate myenv\nconda install jupyter`}
                        language="bash"
                      />
                      <p className="text-sm mt-2">Then run <code className="lecture-code-inline">jupyter notebook</code> or <code className="lecture-code-inline">jupyter lab</code> in your terminal to open the Jupyter interface in your web browser.</p>
                    </div>
                  </div>
                  and create a new Jupyter notebook file (<code className="lecture-code-inline">.ipynb</code>).
                </li>
                <li>In a new code cell, type:
                  <CodeBlock className="lecture-codeblock mt-2"
                    code={`print("Hello, World!")`}
                    language="python"
                    caption="Jupyter notebook cell"
                  />
                </li>
                <li>Run the cell by:
                  <ul className="list-disc list-inside tc3 space-y-2 mb-3 ml-4">
                    <li>Clicking the play button (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
                      </svg>
                      ) next to the cell</li>
                    <li>Pressing <code className="lecture-code-inline">Shift+Enter</code> to run and move to the next cell</li>
                    <li>Pressing <code className="lecture-code-inline">Ctrl+Enter</code> (or <code className="lecture-code-inline">Cmd+Enter</code> on Mac) to run without moving</li>
                  </ul>
                </li>
                <li>The output <code className="lecture-code-inline">Hello, World!</code> will appear directly below the cell.</li>
              </ul>
            </div>
          )}
        </div>

        <p className="lecture-paragraph">
          Congratulations on running your first Python program! Please explore your chosen development environment and get comfortable with its features.
        </p>
      </section>


    </LectureTemplate >
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
