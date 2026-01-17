import { useEffect, useRef, useMemo } from 'react';
import '@/styles/sliders.css';
import '@/styles/buttons.css';
import '@/styles/popups.css';
import { showValidationPopup, hideValidationPopup } from '@/scripts/popups';

interface QuestionProps {
	questionText: string;
	className?: string;
	style?: React.CSSProperties;
	value: string | string[] | number;// JSON to store locally, and and load when page refreshes
	setValue: (value: string | string[] | number) => void;
	children?: React.ReactNode;
}
// question component provides wrapping style, and handles loading/saving to local storage
function QuestionComponent({ questionText, className = '', style = {}, value, setValue, children }: QuestionProps) {

	const dataID = useMemo(() => {
		if (typeof window !== 'undefined') {
			return questionText.toLowerCase().replace(/\s+/g, '-') + window.location.pathname.replace(/\/+/g, '-').replace(/[^a-z0-9\-]/g, '');
		}
		return questionText.toLowerCase().replace(/\s+/g, '-');
	}, [questionText]);

	const storeDelay = 500; // delay in ms before storing to localStorage
	const storeTimer = useRef<NodeJS.Timeout | null>(null);
	const isInitialMount = useRef(true);
	const hasLoadedFromStorage = useRef(false);

	useEffect(() => {
		// load value from local storage on mount
		if (!hasLoadedFromStorage.current && typeof window !== 'undefined') {
			const stored = localStorage.getItem(dataID);
			if (stored) {
				try {
					const parsedValue = JSON.parse(stored);
					if (parsedValue !== null && parsedValue !== undefined) {
						// Check if the current value is "empty" (default state)
						const isEmpty = value === '' || value === 0 || (Array.isArray(value) && value.length === 0);
						if (isEmpty) {
							setValue(parsedValue);
							//console.log(`Loaded stored value for ${dataID}:`, parsedValue);
						}
					}
				} catch (e) {
					//console.error(`Failed to parse stored value for ${dataID}:`, e);
				}
			}
			hasLoadedFromStorage.current = true;
			// Delay setting isInitialMount to false to allow React to complete the render cycle
			setTimeout(() => {
				isInitialMount.current = false;
			}, 100);
		}
	}, [dataID, setValue]);

	useEffect(() => {
		// store value in local storage when edited
		// debounced to avoid excessive writes
		// skip if this is the initial mount
		if (isInitialMount.current || typeof window === 'undefined') {
			return;
		}

		if (storeTimer.current) {
			clearTimeout(storeTimer.current);
		}
		storeTimer.current = setTimeout(() => {
			localStorage.setItem(dataID, JSON.stringify(value));
			//console.log(`Stored value for ${dataID}:`, value);
		}, storeDelay);

		return () => {
			if (storeTimer.current) {
				clearTimeout(storeTimer.current);
			}
		};
	}, [value, dataID]);

	return (
		<div className={`bg1 rounded-lg p-6 shadow-parentsm border border-gray-200 dark:border-gray-800 ${className}`} style={style}>
			<label className="block text-lg font-semibold tc1 mb-2">
				{questionText}
			</label>
			{children}
		</div>
	);
}

interface SlideQuestionProps {
	questionText: string;
	className?: string;
	style?: React.CSSProperties;
	value: string | string[] | number;// JSON to store locally, and and load when page refreshes
	setValue: (value: string | string[] | number) => void;
	min?: number;
	max?: number;
	step?: number;
	labels?: string[];
}

function SlideQuestionComponent({
	questionText,
	className = '',
	style = {},
	value,
	setValue,
	min = 0,
	max = 100,
	step = 1,
	labels
}: SlideQuestionProps) {

	const numericValue = typeof value === 'number' ? value : Number(value) || min;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(Number(e.target.value));
	};

	return (
		<QuestionComponent questionText={questionText} className={className} style={style} value={value} setValue={setValue}>
			<div className="space-y-2">
				{/* Current Value Display */}


				{/* Slider Input */}
				<input

					type="range"
					min={min}
					max={max}
					step={step}
					value={numericValue}
					onChange={handleChange}
					className="w-full"
				/>

				{/* Min/Max Labels */}
				<div className="flex justify-between text-sm tc3">
					{labels && (
						labels.map((label, index) => (
							<span key={index} className="text-center">{label}</span>
						))
					)}
				</div>
			</div>
		</QuestionComponent>
	);
}

interface TextQuestionProps {
	questionText: string;
	className?: string;
	style?: React.CSSProperties;
	value: string | string[] | number;
	setValue: (value: string | string[] | number) => void;
	placeholder?: string;
	multiline?: boolean;
	required?: boolean;
}

function TextQuestionComponent({
	questionText,
	className = '',
	style = {},
	value,
	setValue,
	placeholder = '',
	multiline = false,
	required = false
}: TextQuestionProps) {

	const stringValue = typeof value === 'string' ? value : String(value) || '';
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setValue(e.target.value);
		hideValidationPopup(e.target);
	};

	useEffect(() => {
		const element = inputRef.current;
		if (!element || !required) return;

		const handleInvalid = (e: Event) => {
			e.preventDefault();
			showValidationPopup(element, 'Please fill out this field');
		};



		element.addEventListener('invalid', handleInvalid);

		return () => {
			element.removeEventListener('invalid', handleInvalid);
		};
	}, [required]);

	return (
		<QuestionComponent questionText={questionText} className={className} style={style} value={value} setValue={setValue}>
			{multiline ? (
				<div>
				<textarea
					ref={inputRef as React.RefObject<HTMLTextAreaElement>}
					value={stringValue}
					onChange={handleChange}
					className="mb-[-5px] w-full min-h-32 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 tc1 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors"
					placeholder={placeholder}
					required={required}
				/>
				</div>
			) : (
				<div>
				<input
					ref={inputRef as React.RefObject<HTMLInputElement>}
					type="text"
					value={stringValue}
					onChange={handleChange}
					className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 tc1 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors"
					placeholder={placeholder}
					required={required}
				/>
				</div>
			)}
		</QuestionComponent>
	);
}

interface CheckboxQuestionProps {
	questionText: string;
	className?: string;
	style?: React.CSSProperties;
	value: string | string[] | number;
	setValue: (value: string | string[] | number) => void;
	options: string[];
}

function CheckboxQuestionComponent({
	questionText,
	className = '',
	style = {},
	value,
	setValue,
	options
}: CheckboxQuestionProps) {

	const arrayValue = Array.isArray(value) ? value : [];

	const handleCheckboxChange = (option: string) => {
		const newValue = arrayValue.includes(option)
			? arrayValue.filter(item => item !== option)
			: [...arrayValue, option];
		setValue(newValue);
	};

	return (
		<QuestionComponent questionText={questionText} className={className} style={style} value={value} setValue={setValue}>
			<div className="space-y-2 grid grid-cols-2">
				{options.map((option) => (
					<label key={option} className="flex items-center space-x-3 cursor-pointer">
						<input
							type="checkbox"
							checked={arrayValue.includes(option)}
							onChange={() => handleCheckboxChange(option)}
						/>
						<span className="tc2">{option}</span>
					</label>
				))}
			</div>
		</QuestionComponent>
	);
}

interface RadioQuestionProps {
	questionText: string;
	className?: string;
	style?: React.CSSProperties;
	value: string | string[] | number;
	setValue: (value: string | string[] | number) => void;
	options: string[];
	required?: boolean;
}

function RadioQuestionComponent({
	questionText,
	className = '',
	style = {},
	value,
	setValue,
	options,
	required = false
}: RadioQuestionProps) {

	const stringValue = typeof value === 'string' ? value : String(value) || '';
	const containerRef = useRef<HTMLDivElement>(null);

	const handleRadioChange = (option: string) => {
		if (value === option) {
			setValue('');
		}
		else {
			setValue(option);
		}

		if (containerRef.current) {
			const radios = containerRef.current.querySelectorAll('input[type="radio"]');
			for (let i = 0; i < radios.length; i++) {
				if (radios[i] instanceof HTMLInputElement) {
					hideValidationPopup(radios[i] as HTMLInputElement);
				}
			}
		}
	};

	useEffect(() => {
		if (!containerRef.current || !required) return;

		const radios = containerRef.current.querySelectorAll('input[type="radio"]');
		const lastRadio = radios[radios.length - 1] as HTMLInputElement;

		radios.forEach((radio, index) => {
			if(index === radios.length - 1) return;
			radio.addEventListener('invalid', (e: Event) => e.preventDefault());
		});

		if (!lastRadio) return;

		const handleInvalid = (e: Event) => {
			e.preventDefault();
			showValidationPopup(lastRadio, 'Please select an option');
		};


		lastRadio.addEventListener('invalid', handleInvalid);

		return () => {
			lastRadio.removeEventListener('invalid', handleInvalid);
		};
	}, [required]);

	return (
		<QuestionComponent questionText={questionText} className={className} style={style} value={value} setValue={setValue}>
			<div ref={containerRef} className="space-y-2">
				{options.map((option) => (
					<label key={option} className="flex items-center space-x-3 cursor-pointer">
						<input
							type="radio"
							name={questionText}
							value={option}
							checked={stringValue === option}
							onClick={() => handleRadioChange(option)}
							required={required}
						/>
						<span className="tc2">{option}</span>
					</label>
				))}
			</div>
		</QuestionComponent>
	);
}

export { QuestionComponent, SlideQuestionComponent, TextQuestionComponent, CheckboxQuestionComponent, RadioQuestionComponent };