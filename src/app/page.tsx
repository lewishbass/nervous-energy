import Image from "next/image";
import DragCard from "@/components/DragCard";
import { SiKeras, SiTensorflow, SiPytorch, SiReact, SiNodedotjs, SiBlender, SiLatex, SiPython, SiCplusplus, SiDocker, SiOpengl } from 'react-icons/si';


export default function Home() {

	const RainbowText = (text: string, iterationCount = 100, speed = 0.1) => {

    let n = 0;
    return (
      <>
			{text.split('').map((char, index) => (
          <span
					 key={index}
					 className="rainbow-text"
					 style={{ animationDelay: `${(n++) * speed}s`, animationIterationCount: iterationCount }}
          >
					 {char}
          </span>
        ))}

      </>
    );
	};


  const generateSVG = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 210.79 162.88"
          className="anisvg w-full h-full absolute inset-0 object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
				<g className="spin-veryslow" style={{ transformOrigin: "50% 50%" }}>
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec018c", strokeLinejoin: "round", fill: "#ec018c" }} d="M-29.92 113.74c-2.23 2.1-5.34 2.84-8.3 3.2-5.22.66-10.5.06-15.73.39-1.14.11-2.43.18-3.33.97-.41.66-.22 1.48-.33 2.2-.14 3.66.89 7.33 2.92 10.37 2.62 4 6.36 7.04 9.92 10.15 4.56 3.86 9.13 7.8 12.78 12.57a45.81 45.81 0 0 1 7.22 13.25 79.47 79.47 0 0 0 4.86 11.36 13.65 13.65 0 0 1 11.06-.85c1.98.73 3.9 1.62 5.9 2.3 3.52 1.24 7.14 2.3 10.92 2.39 2.8.07 5.63-.65 8.02-2.13 2.94-1.77 5.28-4.35 7.46-6.94a110.3 110.3 0 0 0 3.62-4.69 9.46 9.46 0 0 0-.7-2.35 313.64 313.64 0 0 1-31.53-4.36c-4.17-.86-8.15-3.03-10.78-6.44-2.95-3.75-4.35-8.46-5.17-13.1-1.26-7.32-1.3-14.76-1.55-22.16l-.14-4.62c-2.42-.24-4.8-.8-7.12-1.5z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#f47820", strokeLinejoin: "round", fill: "#f47820" }} d="M55.5 81.87c-2.71 1.46-5.68 2.65-8.78 2.78-.51 3.6.21 7.27 1 10.82a138.5 138.5 0 0 0 4.52 14.86c.04-7.77.35-15.57 1.45-23.27.33-1.85.94-3.66 1.92-5.26l-.12.07z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#fee606", strokeLinejoin: "round", fill: "#fee606" }} d="M-60.63 37.55c-4.38 3.08-8.73 6.39-12 10.69-1.43 1.93-2.6 4.13-2.88 6.57A9.28 9.28 0 0 0-73 61.89c1.4 1.6 3.02 3.06 4.58 4.54 4.19 3.85 8.78 7.39 11.99 12.15 3.22 4.74 5.04 10.27 6.33 15.8.72 2.82 2.18 5.4 4.04 7.62a32.48 32.48 0 0 0 10.09 7.86 38.04 38.04 0 0 0 13.12 4c-.35-9.22-1.01-18.47-3.4-27.42a70.2 70.2 0 0 0-3.24-9.34c-.13-.4-.27-.8-.38-1.2-3.38 1.58-7.35 1.3-10.79.04a26.6 26.6 0 0 1-12.3-9.5c-2.18-3.06-3.75-6.77-3.55-10.6a11.03 11.03 0 0 1 3.15-7.03c.97-1.13 1.46-2.8.81-4.2-.82-2.09-2.58-3.6-4.21-5.06a75.44 75.44 0 0 0-3.14-2.49l-.73.5zm40.71 1.23c-1.15.12-2.45.06-3.37.89-.98.8-1.43 2.11-1.64 3.25-.6 3.52-.1 7.14.24 10.67l.42 3.8c4.82-4.53 10.92-7.48 17.18-9.5a62.1 62.1 0 0 1 7.12-1.8 57.4 57.4 0 0 0-.4-3.24c-6.38-1.26-12.78-2.47-19.06-4.16l-.49.09z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec343e", strokeLinejoin: "round", fill: "#ec343e" }} d="M70.14-23.04a45.39 45.39 0 0 1 2.96 3.48c4.04.28 8.02 1.1 11.93 2.12-4.1-3.24-9.15-4.72-14.22-5.63-.16.02-1.16-.33-.67.03zM32.61-22a167.17 167.17 0 0 0-30.59 8.1c-5.27 2.01-10.4 4.28-15.12 7.4-2.34 1.6-4.65 3.4-6.1 5.87a6.8 6.8 0 0 0-.82 3.31c-.12 1.23-.3 2.45-.57 3.66A29.53 29.53 0 0 0-10.16 8.2c2.7.06 5.46-.24 8.12.43 1.9.47 3.88 1.43 4.83 3.25 1.06 1.87.8 4.15.2 6.13-1.1 3.35-3.15 6.3-5.38 9a44.08 44.08 0 0 1-10.69 9.2 22.72 22.72 0 0 1-3.65 1.75c6.23 1.54 12.56 2.73 18.87 3.96 3.18.58 6.35 1.2 9.58 1.29 1.87.05 3.85-.3 5.3-1.58 1.6-1.38 2.73-3.21 3.98-4.9 2.77-3.94 5.77-7.72 9-11.29 3.22-3.6 6.54-7.2 10.6-9.9 2.82-1.85 6.17-3 9.58-2.86 1.6.04 3.2.3 4.75.7 0-.31.49-.9 0-.95-6.68-2.27-13.53-3.98-20.36-5.69A10.58 10.58 0 0 1 27.63.73c-1.44-3.48-1.16-7.42-.16-10.98a31.95 31.95 0 0 1 6.48-11.97l-1.34.22z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#01afee", strokeLinejoin: "round", fill: "#01afee" }} d="M-45.84-11.5A40.95 40.95 0 0 0-63.6-6.86c-4.13 2.24-7.99 5.5-10.15 9.8-1.4 2.84-1.25 6.17-.53 9.18.86 3.93 2.19 7.73 3.1 11.65.43 1.39 1.2 2.62 2.1 3.7 3.46 4.02 8.05 6.8 12.13 10.14 2.1 1.69 4.22 3.52 5.47 5.95a5.31 5.31 0 0 1 0 4.89c-.75 1.4-2.09 2.42-2.72 3.9-1.43 2.9-1.11 6.35.12 9.25 1.74 4.19 4.9 7.68 8.58 10.28 2.98 2.05 6.55 3.65 10.26 3.73 1.73.03 3.48-.3 5.02-1.08-1-4.13-.24-8.61 1.98-12.22a22.2 22.2 0 0 1 2.72-3.64c-.44-4.7-1.28-9.41-1-14.15.14-2.08.61-4.34 2.21-5.81 1.12-1 2.66-1.28 4.1-1.26 2.56-.21 4.86-1.42 7-2.72A43.04 43.04 0 0 0-1.8 24.07c1.45-2 2.7-4.1 3.47-6.47.57-1.79.79-3.94-.4-5.54-1.3-1.63-3.47-2.16-5.44-2.38-2.58-.27-5.3.07-7.94-.16-4.63-.27-9.39-1.35-13.2-4.1-3.06-2.19-5.18-5.38-6.96-8.62-1.42-2.5-2.76-5.24-5.22-6.9a9.17 9.17 0 0 0-4.81-1.36 39.23 39.23 0 0 0-3.54-.04z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec018c", strokeLinejoin: "round", fill: "#ec018c" }} d="M51.94-30.46c-5.13.14-9.97 2.56-13.77 5.9a31.84 31.84 0 0 0-8.98 13.36c-1.06 3.25-1.64 6.82-.72 10.17a8.93 8.93 0 0 0 4.65 5.72c1.8.93 3.84 1.18 5.77 1.73 5.58 1.4 11.13 2.9 16.59 4.75 1.1-5.72.65-11.6 1.1-17.41.15-2.73.37-5.58 1.79-8a10.72 10.72 0 0 1 6.74-4.85c1.98-.54 4.05-.69 6.1-.64a35.32 35.32 0 0 0-7.43-7.02 20.6 20.6 0 0 0-9.91-3.66c-.63-.05-1.28-.07-1.93-.05z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#f47820", strokeLinejoin: "round", fill: "#f47820" }} d="M10.38 46.34a59.55 59.55 0 0 0-22.37 4.83c-4.64 2.02-9.09 4.72-12.57 8.48-2.72 2.96-4.73 6.8-4.78 10.9-.02 1.84.27 3.61.89 5.37.8 2.16 1.76 4.26 2.43 6.46 3.12 9.5 4.08 19.54 4.53 29.48.37 8.28.3 16.62 1.08 24.85.4 3.82.97 7.6 2.22 11.22 1.26 3.78 3.49 7.38 6.86 9.63a18.04 18.04 0 0 0 5.2 2.36c2.42.6 4.88.95 7.34 1.38 9.42 1.57 18.86 2.92 28.4 3.5 2.59-3.65 4.77-7.55 7.02-11.4 1.18-1.99 2.68-4 4.93-4.8 2.53-.96 5.3-.81 7.95-.73 2.02.1 4.04.27 6.05.45-1.3-5.25-1.94-10.65-2.44-16.04-3.3 3.08-7.71 4.63-12.1 5.34-6.55 1.01-13.49.16-19.4-2.94a20.57 20.57 0 0 1-9.12-9.4c-2.18-4.68-2.4-10.05-1.53-15.08 1.18-6.82 4.03-13.21 7.4-19.21a55.19 55.19 0 0 0 3.94-7.79 50.43 50.43 0 0 0 3.28-15.45c.43-6.18-.06-12.38.48-18.54 0-.23-.5-.23-.68-.38-4.75-1.95-9.93-2.54-15-2.5Z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#fee606", strokeLinejoin: "round", fill: "#fee606" }} d="M57.81 81.1A12.93 12.93 0 0 0 55 87.8c-1.01 7.09-1.28 14.23-1.37 21.38 0 1.7-.05 3.41.05 5.1.84 2.38 1.81 4.72 2.6 7.12.83 2.88.44 6.13-1.26 8.63-.17.33-.49.61-.62.94.5 5.8 1.15 11.59 2.56 17.26-.07.42.5.2.73.3 6.25.6 12.5 1.17 18.7 2.2 1.2-.39 2.64-.27 3.61-1.2 1.3-1.2 1.5-3.12 1.5-4.79 0-3.4-.83-6.78-1.49-10.12-.1-.44-.12-.88-.54-1.15-5.15-5-9.6-10.86-12.31-17.55-1.73-4.33-2.63-9.17-1.58-13.79.9-4.04 3.48-7.59 6.84-9.96a30.2 30.2 0 0 1 9.21-4.32c-7.83-1.44-15.25-4.4-22.89-6.53-.3-.07-.62-.2-.92-.22Z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec343e", strokeLinejoin: "round", fill: "#ec343e" }} d="M46.26 149.2c-2.17.06-4.57.34-6.2 1.94-1.88 1.85-2.96 4.31-4.33 6.54a128.59 128.59 0 0 1-10.76 15.7c-2.22 2.7-4.6 5.35-7.51 7.32a15.85 15.85 0 0 1-8.55 2.76c-4.46.12-8.78-1.25-12.93-2.73-2.02-.73-3.98-1.63-6.02-2.32-2.92-.9-6.14-.6-8.87.73-3.8 1.8-6.66 5.14-8.65 8.78-2.72 5.17-3.9 11.28-2.7 17.05a18.21 18.21 0 0 0 7.18 11.18c4.04 2.94 9.05 4.18 13.95 4.7 6.79.74 13.65.28 20.41-.62a163.84 163.84 0 0 0 30.67-7.5c8.57-2.98 16.97-6.54 24.81-11.1 3.69-2.2 7.3-4.62 10.33-7.68 1.4-1.47 2.74-3.14 3.27-5.14.3-1.32.05-2.69.17-4.03.04-.66.1-1.31.17-1.97-4.11-1.2-8.48-1.13-12.66-.63-2.95.39-6.1.6-8.87-.66a5.74 5.74 0 0 1-3.26-4.66c-.32-2.75.65-5.46 1.8-7.92a42.7 42.7 0 0 1 8.87-11.97 29.09 29.09 0 0 1 7.18-5.25c-6.56-.96-13.14-1.53-19.73-2.15a73.79 73.79 0 0 0-7.77-.37z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#01afee", strokeLinejoin: "round", fill: "#01afee" }} d="M82 137.53c.57 3 1.12 6.09.75 9.16-.22 1.77-1.07 3.61-2.72 4.48-1.34.74-2.95.57-4.35 1.15-2.8 1.04-5.18 2.92-7.39 4.88a44 44 0 0 0-8.32 10.35c-1.34 2.44-2.54 5.06-2.73 7.87-.13 1.7.46 3.61 2 4.54 1.48.93 3.27 1.13 4.95 1.14 2.6-.03 5.13-.57 7.75-.62 4.67-.19 9.54.43 13.62 2.84 3.1 1.81 5.46 4.6 7.46 7.51 1.63 2.3 3.16 4.82 5.57 6.4a9.21 9.21 0 0 0 5.74 1.17 41.93 41.93 0 0 0 17.35-4.8c-1.44-1.88-2.41-4.07-3.76-6.02-2.88-4.45-6.5-8.54-11.06-11.31-4.5-2.8-9.45-4.67-14.06-7.24-2.4-1.25-4.85-2.7-6.36-5.04a10.71 10.71 0 0 1-1.4-7.84c.68-3.97 2.67-7.55 4.82-10.9.6-.9 1.21-1.78 1.85-2.65-3.64-2-7.02-4.45-10.14-7.19l.43 2.12z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec018c", strokeLinejoin: "round", fill: "#ec018c" }} d="M200.67 85.78c-3.53.04-7.17.95-9.96 3.22-2.87 2.25-4.93 5.46-6.68 8.55 2.67-2.41 5.64-4.67 9.1-5.78 2.28-.7 4.87-.63 6.93.66 2.6 1.58 4.18 4.37 5.3 7.12a35.7 35.7 0 0 1 1.42 4.36l5.59-.08a26.68 26.68 0 0 0 9.68-7.22c-.82-2.48-2.34-4.61-4.02-6.56-.7-.78-1.36-1.58-2.13-2.27-2.34-.25-4.6-.94-6.94-1.26-2.73-.46-5.5-.8-8.29-.74z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#fee606", strokeLinejoin: "round", fill: "#fee606" }} d="M199.68-9.95a8.8 8.8 0 0 0-6.96 3.67c-1.39 1.89-2.26 4.08-3.28 6.17-.15.37.56.5.78.77a165.39 165.39 0 0 1 27.3 23.8c4.42 4.91 8.5 10.2 11.66 16.03 1.8-1.74 2.7-4.14 3.6-6.42 1.41-3.73 2.5-7.58 4.04-11.26-1.77-5.15-3.99-10.24-7.3-14.6-1.66-2.2-3.87-3.85-5.95-5.6-4.72-3.91-9.66-7.65-15.2-10.32-2.73-1.3-5.66-2.3-8.69-2.24zM161.7 41.72c2.6 4.35 5 8.8 7.32 13.31 5.43-2.58 11-4.9 16.7-6.83a15.09 15.09 0 0 0-8.35-5.57c-3.67-1.06-7.46-1.28-11.26-1.45-1.6-.07-3.2-.08-4.8-.1l.39.64z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec018c", strokeLinejoin: "round", fill: "#ec018c" }} d="M164.13 151.4c1.9 8.2 3.43 16.5 4.47 24.85a47.56 47.56 0 0 1 9.57 10.51 67.1 67.1 0 0 0 11.08 12.26c.3-3.63 1.34-7.14 1.67-10.76.44-3.99.42-8.11-.33-12.06a26.9 26.9 0 0 0-6.27-12.9 36.8 36.8 0 0 0-10.08-7.74 84.2 84.2 0 0 0-10.2-4.55l.1.4z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#f47820", strokeLinejoin: "round", fill: "#f47820" }} d="M211.89 105.2c-10.88.12-21.78.42-32.58 1.73-1.9 4.07-3.35 8.33-4.93 12.53-.83 2.17-2 4.4-4.1 5.59-2.42 1.42-5.26 1.75-7.98 2.16-1.85.24-3.7.43-5.55.6 2.7 6 4.49 12.34 6.17 18.68l.73 2.9c6.41 2.41 12.85 5.17 18.17 9.58 4.4 3.6 7.78 8.46 9.37 13.92 1.84 6.12 1.67 12.66.63 18.9-.53 3.06-1.27 6.09-1.37 9.17-.15 2.97.13 6.06 1.1 8.84 1 2.92 2.88 5.51 5.4 7.3 2.85 2.08 6.34 3.11 9.76 3.54 3.85.48 7.88.22 11.68-.43a60.05 60.05 0 0 0 18.62-6.72c4.98-2.84 9.68-6.37 13.18-10.96a23.6 23.6 0 0 0 2.81-4.7 15.47 15.47 0 0 0 1.2-9.2c-.46-2.6-1.77-4.92-3.24-7.08-5.23-8.27-8.36-17.65-10.73-27.08-2.33-9.15-3.84-18.5-6.3-27.6-1.4-5.11-3.12-10.26-6.26-14.59a16.46 16.46 0 0 0-8.56-6.26c-2.3-.74-4.8-.85-7.22-.82z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#fee606", strokeLinejoin: "round", fill: "#fee606" }} d="M152.06 128.21c-2.6.21-5.2.44-7.8.58-.02 2.9 1.07 5.63 2.03 8.31 1.9 5.04 4.34 9.9 5.53 15.18.54 2.34.67 4.95-.54 7.13a11.69 11.69 0 0 1-7.42 5.94c-4.15 1.14-8.6.47-12.58-1-4.5-1.69-8.67-4.5-11.53-8.4-1.9-2.66-3.04-6.04-2.41-9.32a13.6 13.6 0 0 1 1.13-3.29 16.56 16.56 0 0 1-10.76 3.89c-5.18.06-10.2-1.65-14.77-3.98-2.63 3.62-5.11 7.5-6.28 11.86-.7 2.62-.68 5.59.82 7.94 1.45 2.38 4 3.73 6.38 4.99 5.46 3 11.45 5.1 16.44 8.93 4.78 3.68 8.3 8.7 11.22 13.91 1.82 3.3 4.78 5.85 8.04 7.69a36.47 36.47 0 0 0 16.95 4.34c4.85.07 9.85-.7 14.2-3 3.18-1.67 5.88-4.39 6.94-7.87.63-1.92.65-4.08.51-6.08-.55-9.35-2.05-18.6-3.92-27.77-1.81-8.7-3.97-17.37-7.05-25.73a66.37 66.37 0 0 0-1.9-4.52l-3.23.27z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec343e", strokeLinejoin: "round", fill: "#ec343e" }} d="M185.92 49.6a156.06 156.06 0 0 0-16.28 6.66 331.6 331.6 0 0 1 7.48 15.56c1.6 3.92 1.97 8.4.6 12.45-1.5 4.6-4.67 8.42-8.08 11.76a84.53 84.53 0 0 1-5.78 5.1c-1.02 5.08-3.35 9.82-6.2 14.12-2.13 3.14-4.63 6.13-7.82 8.24a14.2 14.2 0 0 1-3.39 1.49 3.58 3.58 0 0 0-2.04 2.43c1.88-.16 3.77-.25 5.65-.42 4.69-.4 9.38-.71 14.03-1.4 1.7-.3 3.38-.64 4.97-1.35a6.82 6.82 0 0 0 3.3-3.44c1.2-2.51 1.94-5.22 2.95-7.8a131.5 131.5 0 0 1 6.88-15.07c2.08-3.85 4.47-7.7 8.02-10.37a17.02 17.02 0 0 1 9.58-3.15c5.08-.24 10.09.83 15.03 1.84 3.15.63 6.51-.06 9.17-1.84 3.63-2.42 6.02-6.38 7.34-10.42a27.02 27.02 0 0 0 .9-12.97c-1.83 5.22-5.96 9.41-10.81 11.94a27.02 27.02 0 0 1-17.4 2.86c-3.88-.74-7.67-2.72-9.97-6.02a16.07 16.07 0 0 1-2.54-6.49c-.92-4.02-1.98-8.01-3.77-11.74-.36-.7-.77-1.49-1.22-2.18l-.6.2z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec018c", strokeLinejoin: "round", fill: "#ec018c" }} d="M36.11 33.77c-.9.38-1.6 1.11-2.37 1.7a17.75 17.75 0 0 0-5.6 9.42c-1.07 4.38-.96 8.89-1 13.37.03 5.86-.02 11.78-1.22 17.55a46 46 0 0 1-5.58 14.47c-2.92 5.06-5.49 10.35-7.07 16a33.12 33.12 0 0 0-1.31 11.34c.3 4.01 1.7 8 4.35 11.07 3.2 3.83 7.88 6.15 12.68 7.22a31.7 31.7 0 0 0 15.6-.48c3.32-1.01 6.62-2.65 8.8-5.44a8.84 8.84 0 0 0 1.85-6.72c-.21-1.95-1.16-3.71-1.8-5.55-2.6-6.85-5.1-13.77-6.9-20.89-.81-3.44-1.53-6.95-1.44-10.5.1-1.94.46-4.03 1.8-5.52a6.1 6.1 0 0 1 4.2-1.93c2.64-.24 5.26.4 7.8 1.05 6.2 1.68 12.22 4.02 18.47 5.57a67.1 67.1 0 0 0 7.6 1.48c4.77-1.12 9.48-2.7 13.7-5.15a28.53 28.53 0 0 0 9.11-8.1 27.1 27.1 0 0 0 3.67-7.21c-2.44-2.82-5.85-4.52-9.22-5.97a75.27 75.27 0 0 0-8.9-3.01c-7 4.9-14.16 9.59-21.79 13.44a14.2 14.2 0 0 1-8.69 1.26c-4.15-.77-7.73-3.38-10.44-6.52-3.76-4.3-6.22-9.63-7.65-15.13a36.68 36.68 0 0 1-1.15-9.87c-1.89-2.2-3.62-4.6-5.94-6.37-.45-.32-.98-.64-1.56-.58z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#f47820", strokeLinejoin: "round", fill: "#f47820" }} d="M124.48 17.24c-.42.09-.85.16-1.27.26 1.14 3.04 2.03 6.26 1.85 9.54-.4 2.32-1.9 4.23-3.3 6.04a75 75 0 0 1-7.47 7.78c.58 7.33 1.12 14.81-.4 22.08-1.15 5.72-3.86 11.2-8.09 15.27-4.52 4.43-10.38 7.21-16.37 9.03-3.46 1.04-7.05 1.6-10.4 2.95-3.86 1.5-7.57 3.8-9.94 7.28-2.12 3.01-2.86 6.86-2.52 10.45.37 4.17 1.92 8.24 3.93 11.88a56.25 56.25 0 0 0 12.39 14.97 53.27 53.27 0 0 0 12.93 8.36c4.06 1.79 8.56 3 12.99 2.69a14.9 14.9 0 0 0 9.58-4.3c.23-.28.7-.51.5-.94a5.37 5.37 0 0 0-2.16-2.99c-3.12-2.26-6.85-3.42-10.39-4.84-3.8-1.49-7.73-2.92-10.91-5.54a11.32 11.32 0 0 1-3.09-4.25c-1.21-2.53-1.89-5.5-1.03-8.26.94-3.16 3.38-5.52 5.06-8.28 5.05-7.68 12.82-13.34 21.35-16.58 1.9-.7 3.83-1.33 5.82-1.67a5.31 5.31 0 0 1 4.5 1.46c1.44 1.36 2.65 3.06 4.53 3.84 2.27 1.03 4.84 1.03 7.33.8 4.29-.42 8.5-1.7 12.61-2.98 2.58-.7 5.42-1.2 7.98-.2A5.97 5.97 0 0 1 164 95.7c.22 1.12.24 2.27.14 3.4 3.98-3.33 7.86-6.94 10.54-11.43a16.85 16.85 0 0 0 2.5-9.32 19.76 19.76 0 0 0-2.11-7.78c-4.7-10.05-9.59-20.02-15.38-29.5-4.4-.03-8.78.4-13.17.76-2.31.17-4.83.15-6.83-1.2-2.33-1.55-3.85-3.98-5.34-6.3-2.92-4.69-5.53-9.56-8.23-14.38-.5-.9-.98-1.82-1.47-2.74l-.17.03z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#fee606", strokeLinejoin: "round", fill: "#fee606" }} d="M70.38-18.37c-2.4.04-4.86.34-7.07 1.41a8.6 8.6 0 0 0-4.53 5.15c-.71 2.08-.72 4.33-.88 6.48-.24 4.44-.1 8.9-.5 13.32A33.86 33.86 0 0 1 54 19.94a67.77 67.77 0 0 1-5.97 9.53c-2.34 3.68-3.16 8.15-3.11 12.42a37.9 37.9 0 0 0 3.64 15.37c2.07 4.35 4.95 8.47 8.95 11.24 2.79 1.94 6.29 3 9.67 2.42 3-.45 5.6-2.15 8.22-3.55a219.07 219.07 0 0 0 24.34-16.22c5.9-4.49 11.63-9.2 16.89-14.44 2.28-2.3 4.52-4.73 6.15-7.5a5.7 5.7 0 0 0 .93-3.43c-.2-4.42-1.9-8.55-3.84-12.47a63.28 63.28 0 0 0-2.75-4.85c-1.81.23-3.32 1.31-4.7 2.41-4.87 4.03-8.69 9.24-13.48 13.39-1.89 1.62-4 3.18-6.48 3.69-2.02.34-4.11-.07-6-.84-3.19-1.39-5.53-4.24-6.86-7.4-1.95-4.53-2.3-9.65-1.5-14.48.66-3.92 2.23-7.83 5.12-10.64a10.88 10.88 0 0 1 7.73-3.04c1.26.04 2.64-.1 3.58-1.03.86-.8 1.3-1.97 1.53-3.06-2.06-.88-4.22-1.48-6.34-2.17-5.28-1.63-10.67-3.05-16.16-3.54-1.05-.08-2.1-.13-3.18-.12z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#ec343e", strokeLinejoin: "round", fill: "#ec343e" }} d="M153.17-14.8c-1.67.02-3.4.48-4.66 1.6-1.07.78-2.2 1.48-3.36 2.1.8 2.33 2.08 4.63 3.55 6.7 1.37 1.96 3 3.72 4.56 5.53 1.65 2 3.15 4.34 3.28 7a5.93 5.93 0 0 1-2.65 4.97c-2.51 1.81-5.64 2.45-8.65 2.81-5.21.56-10.52.09-15.59-1.2a25.71 25.71 0 0 1-5.93-2.27c2.97 5.89 6.25 11.6 9.5 17.33 1.73 2.93 3.39 5.91 5.67 8.42a6.83 6.83 0 0 0 4.24 2.24c2.6.27 5.18-.19 7.76-.36 6.28-.53 12.59-.47 18.87-.08 3.45.27 6.94.74 10.17 2.03a15.8 15.8 0 0 1 7.04 5.5c2.6 3.6 3.94 7.92 5.08 12.16.55 2.06.92 4.17 1.54 6.21 1 2.98 3.26 5.54 6 6.95 3.23 1.7 7 2.22 10.6 1.96a25.92 25.92 0 0 0 16.28-7.2 18.4 18.4 0 0 0 5.3-10.33c.56-3.7-.1-7.56-1.41-11.1a51.12 51.12 0 0 0-5.54-10.36c-3.91-5.8-8.6-11.06-13.59-16A171.88 171.88 0 0 0 186.67-.16c-6.5-4.36-13.32-8.36-20.55-11.4-3.56-1.49-7.36-2.78-11.21-3.18-.58-.04-1.16-.07-1.74-.05z" />
					<path style={{ animationDelay: (Math.random() * 5).toString() + "s", stroke: "#01afee", strokeLinejoin: "round", fill: "#01afee" }} d="M117.12-54.28c-2.8.06-5.76.75-7.95 2.62-2.75 2.23-4.57 5.32-6.53 8.2-1.25 1.94-2.6 3.8-3.86 5.72-1 1.82-1.28 3.93-1.42 5.91-.35 5.85.8 11.66.37 17.5-.18 2.15-.7 4.48-2.37 5.98-1.3 1.14-3.12 1.38-4.8 1.28a9.67 9.67 0 0 0-7.17 3.49C80.9-.68 79.7 3.1 79.24 6.88c-.47 4.4.02 9 1.96 13.01 1.26 2.66 3.38 5.02 6.16 6.1 1.9.7 4.07 1.01 6.01.28 3.29-1.4 5.81-4.05 8.28-6.53 3.35-3.43 6.42-7.16 10.18-10.18 1.7-1.34 3.73-2.6 5.98-2.52a5.64 5.64 0 0 1 3.94 2.28c1.59 1.62 3.79 2.6 5.93 3.36a42.18 42.18 0 0 0 14.88 2.05c3.28-.14 6.7-.6 9.65-2.17 1.43-.78 2.86-2.2 2.93-3.97.12-2.17-1.09-4.12-2.32-5.8-1.58-2.04-3.45-3.83-4.92-5.96-2.72-3.69-4.84-8-5.1-12.64-.2-3.75.92-7.4 2.24-10.87.95-2.63 2.08-5.42 1.64-8.28-.38-2.3-1.9-4.15-3.37-5.87a41.97 41.97 0 0 0-11.4-9.39c-4.46-2.5-9.62-4.21-14.79-4.06zm7.02 143.79c-1.85.16-3.61.84-5.36 1.42a43.76 43.76 0 0 0-19.53 13.83c-1.44 1.85-2.6 3.89-4.04 5.73-1.48 1.97-2.9 4.2-2.9 6.75-.01 2.55 1.05 4.97 2.35 7.1 1.6 2.3 4.18 3.64 6.64 4.83 4.78 2.26 9.95 3.62 14.59 6.21 1.85 1.07 3.71 2.53 4.3 4.68.44 1.65-.13 3.36-.9 4.82a9.62 9.62 0 0 0 .13 7.7c1.52 3.46 4.42 6.15 7.58 8.14a26.51 26.51 0 0 0 6.73 2.98c3.57 1 7.52 1.3 11.03-.1a10.05 10.05 0 0 0 5.8-6.05c.6-2.1.1-4.33-.43-6.4-1.07-3.88-2.77-7.54-4.25-11.29-1.29-3.2-2.61-6.44-3-9.88-.22-1.9.11-4.04 1.6-5.36.9-.83 2.1-1.14 3.21-1.56 2.78-1.25 4.9-3.53 6.81-5.84a42.95 42.95 0 0 0 7.16-13.05c.82-2.47 1.38-5.1 1.09-7.73-.2-1.59-.98-3.23-2.5-3.93-1.7-.82-3.65-.67-5.45-.35-2.76.55-5.37 1.64-8.12 2.26-3.85.96-7.85 1.72-11.82 1.16a10.36 10.36 0 0 1-5.9-3.02c-1.16-1.14-2.17-2.7-3.89-3a4.8 4.8 0 0 0-.93-.05z" />
				</g>
			</svg>
		</div>
    )

  }



  return (
    <div className="w-full">
      {/* Hero Section */}
		  <section className="h-screen relative bg2 tc2 snap-start">

			  {generateSVG()}
			  <div className="absolute inset-0 flex items-center justify-center p-6"></div>
			  <div className="absolute inset-0 flex items-center justify-center p-6">

					<h1 className="text-4xl md:text-6xl font-bold text-center flex flex-col items-center space-y-4 slowwobble">
					  {/*<div className='p-8 rounded-4xl tout bg5'>Welcome to My Portfolio</div>
					  <div className='p-8 rounded-4xl tout bg5'>Made From Scratch</div>
					  <div className='p-8 rounded-4xl tout bg5'>Using Next.js</div>
					  <div className='p-8 rounded-4xl tout bg5'>Nervous</div>
					  <div className='p-8 rounded-4xl tout bg5'>Energy</div>*/}
						<Image
							width={700}
							height={500}
							alt="Nervous Energy"
							src="/FullLogo.svg"
							style={{
								filter: "drop-shadow(5px 5px 4px #0008)",
							}}
							className="slowpulse"
						/>
					</h1>
				</div>
		  </section>

      {/* About Section */}
		  <section className="min-h-screen relative p-6 bg3 tc1 overflow-hidden select-none snap-start">
			  <Image
				  src="/KH_figures.svg"
				  alt="Keith Haring rip-off"
				  className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-15 dark:opacity-5 dark:invert select-none pointer-events-none"
				  width={100}
				  height={100}
				  style={{
					  userSelect: "none",
				  }}
				/>
				<p className="absolute top-3 left-1/2 transform -translate-x-1/2 text-center text-xl tc2 w-full opacity-50">
					This website is a work in progress please use the
					<a href="https://github.com/lewishbass/nervous-energy/issues/new" target="_black" className="mx-2 tc1 cursor-pointer hover:underline">
						Report Issue
					</a>
					button in the bottom left to help me find bugs, suggest improvements or request features.
				</p>
				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500] bg-white dark:bg-black p-6 rounded-3xl relative overflow-hidden">
				  <h2 className="text-4xl font-bold mb-2 ml-10 mt-2">Interests</h2>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">TODO</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="font-bold">Name: </span> Description
				  </p>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300]  h-[400] bg1 p-6 rounded-3xl overflow-hidden">
					<Image
						src="/images/pets/me_c.jpg"
						alt="ME!"
						className="object-cover pointer-events-none"
						fill
						style={{
							objectFit: 'cover',
							objectPosition: 'center top',
							userSelect: "none",
						}} />
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-content opacity-50 bg-black px-2 py-1 rounded-full text-white text-center">
						ME!
					</div>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500] bg-white dark:bg-black p-6 rounded-3xl relative overflow-hidden">
				  <h2 className="text-4xl font-bold mb-2 ml-10 mt-2">Projects</h2>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">TODO</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="font-bold">Name: </span> Description
				  </p>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300]  h-[400] bg1 p-6 rounded-3xl overflow-hidden">
					<Image
						src="/images/pets/scottie_c.jpg"
						alt="Scottie Q"
						className="object-cover pointer-events-none"
						fill
						style={{
							objectFit: 'cover',
							objectPosition: 'center top',
							userSelect: "none",
						}} />
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-content opacity-50 bg-black px-2 py-1 rounded-full text-white text-center">
						Scottie
					</div>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500] bg-white/80 dark:bg-black/40 p-6 rounded-3xl relative overflow-hidden">
				  <Image
					  src="/VT.svg"
					  alt="Home Sweet Home"
					  className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light grayscale-50 blur-[2px] select-none pointer-events-none"
					  width={100}
					  height={100}
					  style={{ userSelect: "none", }} />
				  <h2 className="text-4xl font-bold mb-2 ml-10 mt-2">Education</h2>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Graduate</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="font-bold">Virginia Tech: </span> (MS) Computer Engineering
				  </p>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Undergraduate</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="font-bold">Virginia Tech: </span> (BSCPE) Machine Learning
				  </p>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="font-bold">Virginia Tech: </span> (BS) Mathematics
				  </p>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300]  h-[400] bg1 p-6 rounded-3xl overflow-hidden">
					<Image
						src="/images/pets/kuiper_c.jpg"
						alt="Kuiper"
						className="object-cover pointer-events-none"
						fill
						style={{
							objectFit: 'cover',
							objectPosition: 'center top',
							userSelect: "none",
						}} />
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-content opacity-50 bg-black px-2 py-1 rounded-full text-white text-center">
						Kuiper
					</div>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500] bg1 p-6 rounded-3xl">
          <h2 className="text-4xl font-bold mb-2 ml-10 mt-2">Experience</h2>
          <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Work</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <a draggable="false" href="https://eng.vt.edu/ceed/ceed-pre-college-programs/imagination.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300">→ VT CEED Engineering Outreach Camps</a>

				  </p>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <a draggable="false" href="https://people.cs.vt.edu/onufriev" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300">→ VT Computational Bio-Physics</a>
				  </p>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Publications</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <a draggable="false" href="https://pubs.acs.org/doi/abs/10.1021/acs.jctc.3c00981" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300">→ Improving Accuracy of Physics-Based Hydration Free Energy with Machine Learning</a>
				  </p>
        </DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300]  h-[400] bg1 p-6 rounded-3xl overflow-hidden">
					<Image
						src="/images/pets/aster_c.jpg"
						alt="Asteroid"
						className="object-cover pointer-events-none"
						fill
						style={{
							objectFit: 'cover',
							objectPosition: 'center top',
							userSelect: "none",
						}} />
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-content opacity-50 bg-black px-2 py-1 rounded-full text-white text-center">
						Asteroid
					</div>
				</DragCard>

        <DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[500] bg1 p-6 rounded-3xl">
          <h2 className="text-4xl font-bold mb-2 ml-10 mt-2">Skills</h2>
          <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Machine Learning</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="wg flex items-center nowrap"><SiTensorflow className="text-2xl text-orange-500 mr-1" />Tensorflow</span>
					  <span className="wg flex items-center nowrap"><SiKeras className="text-2xl text-blue-600 mr-1" />Keras</span>
					  <span className="wg flex items-center nowrap"><SiPytorch className="text-2xl text-red-600 mr-1" />PyTorch</span>
				  </p>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Web</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="wg flex items-center nowrap"><SiReact className="text-2xl text-cyan-500 mr-1" /> React</span>
					  <span className="wg flex items-center nowrap"><SiNodedotjs className="text-2xl text-green-500 mr-1" /> Node.js</span>
					  <span className="wg flex items-center nowrap"><SiReact className="text-2xl text-cyan-500 mr-1" /> Next.js</span>
				  </p>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Design</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="wg flex items-center nowrap"><SiBlender className="text-2xl text-orange-500 mr-1" /> Blender</span>
					  <span className="wg flex items-center nowrap"><SiOpengl className="text-2xl text-red-500 mr-1" /> OpenGL</span>
					  <span className="wg flex items-center nowrap"><SiLatex className="text-2xl text-blue-500 mr-1" /> LaTeX</span>
				  </p>
				  <h3 className="text-2xl font-bold mb-2 ml-10 mt-2">Development</h3>
				  <p className="text-xl w-auto max-w-[100%] flex items-center gap-2">
					  <span className="wg flex items-center nowrap"><SiPython className="text-2xl text-yellow-500 mr-1" /> Python</span>
					  <span className="wg flex items-center nowrap"><SiCplusplus className="text-2xl text-blue-500 mr-1" /> C++</span>
					  <span className="wg flex items-center nowrap"><SiDocker className="text-2xl text-blue-500 mr-1" /> Docker</span>
				  </p>
				</DragCard>
				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300]  h-[400] bg1 p-6 rounded-3xl overflow-hidden">
					<Image
						src="/images/pets/nutmeg_c.jpg"
						alt="Nutmeg"
						className="object-cover pointer-events-none"
						fill
						style={{
							objectFit: 'cover',
							objectPosition: 'center top',
							userSelect: "none",
						}} />
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-content opacity-50 bg-black px-2 py-1 rounded-full text-white text-center">
						Nutmeg
					</div>
				</DragCard>

				<DragCard className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500] bg1 p-6 rounded-3xl">
          <h2 className="text-4xl font-bold mb-2 ml-10">Hello!</h2>
          <p className="text-xl  w-auto max-w-[100%]">My name is Lewis Bass.</p>
          <p className="text-xl leading-relaxed w-auto w-auto">I&#39;m a 2rd year Masters Student at Virginia Tech specializing in</p>
          <p className="text-2xl leading-relaxed w-auto text-center mb-2 font-bold">{RainbowText("Machine Learning")}</p>
          <p className="text-xl leading-relaxed w-auto max-w-[100%]">
            research, including: Drug Discovery, Computer Vision, and Natural Language Processing.
          </p>
        </DragCard>

      </section>
    </div>
  );
}