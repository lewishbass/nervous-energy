'use client';
import { mitreJobs, JobPosting } from '@/data/mitre_jobs';
import { useDeferredValue, useMemo, useState } from 'react';
import { FaExpandAlt, FaCompressAlt } from 'react-icons/fa';
import uFuzzy from '@leeoniya/ufuzzy';
import DualRangeSlider from './dual-range-slider';
import { TagFilter, useTagFilter } from './useTagFilter';
import TagCheckboxGrid from './tag-checkbox-grid';
import GPUStarBackground from '@/components/backgrounds/GPUStarBackground';

import { usePersistedState } from './persistant-state';
import { FaSort, FaSortUp, FaSortDown, FaTrash } from 'react-icons/fa6';

export default function MitreJobsPage() {

	const [activeJob, setActiveJob] = useState<string | null>(null);
	const titleWordsFilter = useTagFilter('titleWordsFilter');
	const [titleWordIncludeMode, setTitleWordIncludeMode] = usePersistedState<'and' | 'or'>('titleWordIncludeMode', 'and');
	const [titleWordFilter, setTitleWordFilter] = usePersistedState<string>('titleWordFilter', '');
	const [titleWordsExpanded, setTitleWordsExpanded] = usePersistedState<boolean>('titleWordsExpanded', false);
	const [familyWordsExpanded, setFamilyWordsExpanded] = usePersistedState<boolean>('familyWordsExpanded', false);


	const clearanceFilter = useTagFilter('clearanceFilter', true);

	const familyFilter = useTagFilter('familyFilter');
	const [familySearchFilter, setFamilySearchFilter] = usePersistedState<string>('familySearchFilter', '');
	const [familyIncludeMode, setFamilyIncludeMode] = usePersistedState<'and' | 'or'>('familyIncludeMode', 'and');

	const [salaryFilter, setSalaryFilter] = usePersistedState<[number, number] | null>('salaryFilter', null);
	const [dateFilter, setDateFilter] = usePersistedState<[number, number] | null>('dateFilter', null);

	const differedSalaryFilter = useDeferredValue(salaryFilter);
	const differedDateFilter = useDeferredValue(dateFilter);

	const modeFilter = useTagFilter('modeFilter', true);

	const [searchFilter, setSearchFilter] = usePersistedState<string>('searchFilter', '');
	const sort_fields = ['title', 'date', 'salary', 'relevance'];
	const [sortField, setSortField] = usePersistedState<string>('sortField', sort_fields[0]);
	const [sortOrder, setSortOrder] = usePersistedState<'asc' | 'desc'>('sortOrder', 'asc');

	const [doExperienceFilter, setDoExperienceFilter] = usePersistedState<boolean>('doExperienceFilter', false);
	const [educationLevel, setEducationLevel] = usePersistedState<number | null>('educationLevel', null);
	const [experienceYears, setExperienceYears] = usePersistedState<number | null>('experienceYears', null);
	const [isStudent, setIsStudent] = usePersistedState<boolean>('isStudent', false);
	const educationDict = { 0: 'none', 1: 'bachelor', 2: 'masters', 3: 'doctorate' };

	const [numLoadedResults, setNumLoadedResults] = useState<number>(20);


	const salaryRange = useMemo(() => {
		let minSalary = Infinity;
		let maxSalary = -Infinity;
		mitreJobs.forEach(job => {
			if (job.salary) {
				minSalary = Math.min(minSalary, Math.min(...job.salary));
				maxSalary = Math.max(maxSalary, Math.max(...job.salary));
			}
		});
		return { min: minSalary === Infinity ? 0 : (minSalary - minSalary % 1000), max: maxSalary === -Infinity ? 0 : maxSalary - maxSalary % 1000 + 1000 };
	}, []);

	const dateRange = useMemo(() => {
		let minDate = Infinity;
		let maxDate = -Infinity;
		mitreJobs.forEach(job => {
			if (job.date) {
				minDate = Math.min(minDate, new Date(job.date).getTime());
				maxDate = Math.max(maxDate, new Date(job.date).getTime());
			}
		});
		return { min: minDate === Infinity ? 0 : minDate, max: maxDate === -Infinity ? 0 : maxDate };
	}, []);

	const modes = useMemo(() => {
		const uniqueModes: Record<string, number> = {};
		mitreJobs.forEach(
			job => {
				if (job.mode) {
					if (uniqueModes[job.mode]) {
						uniqueModes[job.mode]++;
					} else {
						uniqueModes[job.mode] = 1;
					}
				}
			}
		);
		const sorted = Object.entries(uniqueModes).sort((a, b) => b[1] - a[1]);
		return sorted;
	}, []);

	const titleWords = useMemo(() => {
		const uniqueWords: Record<string, number> = {};
		mitreJobs.forEach(job => {
			const job_title_set = new Set<string>();
			job.title.split(/[^a-zA-Z0-9]+/).forEach(word => {
				if (word.trim().length >= 2) job_title_set.add(word.toLowerCase());
			});
			job_title_set.forEach(word => {
				if (uniqueWords[word]) {
					uniqueWords[word]++;
				} else {
					uniqueWords[word] = 1;
				}
			});
		});
		const EXCLUDED_WORDS = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'these', 'those', 'have', 'has', 'had', 'are', 'was', 'were', 'will', 'shall', 'can', 'could', 'would', 'should', 'may', 'might', 'must', 'not', 'but', 'all', 'any', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'so', 'than', 'too', 'very']);
		const sortedWords = Object.entries(uniqueWords).filter(([word]) => !EXCLUDED_WORDS.has(word)).sort((a, b) => b[1] - a[1]);
		return sortedWords;
	}, []);

	const clearances = useMemo(() => {
		const uniqueClearances: Record<string, number> = {};
		mitreJobs.forEach(job => {
			if (job.clearance_current) {
				if (uniqueClearances[job.clearance_current]) {
					uniqueClearances[job.clearance_current]++;
				} else {
					uniqueClearances[job.clearance_current] = 1;
				}
			}
		});
		const sorted = Object.entries(uniqueClearances).sort((a, b) => b[1] - a[1]);
		return sorted;
	}, []);

	const uf = useMemo(() => new uFuzzy({ intraMode: 1, intraSub: 1, intraTrn: 1, intraDel: 1, intraIns: 1 }), []);
	const titleWordsHaystack = useMemo(() => titleWords.map(([word]) => word), [titleWords]);
	const summaryHaystack = useMemo(() => Object.fromEntries(mitreJobs.map(job => [job.link, (job.summary || '') + (job.title || '') + (job.family || '')])), [mitreJobs]);

	const filteredTitleWords = useMemo(() => {
		if (titleWordFilter.trim() === '') return titleWords.filter(([word, count]) => (titleWordsExpanded || (count > 8) || titleWordsFilter.get(word) !== null)).sort((a, b) => (titleWordsFilter.get(b[0]) === true ? 2 : 0) - (titleWordsFilter.get(a[0]) === true ? 2 : 0) || (titleWordsFilter.get(b[0]) === false ? 1 : 0) - (titleWordsFilter.get(a[0]) === false ? 1 : 0));

		const [idxs, info, order] = uf.search(titleWordsHaystack, titleWordFilter.trim());
		if (!idxs) return [];
		// info/order are null when there are too many matches to rank
		const ranked = info && order ? order.map(i => info.idx[i]) : idxs;
		return ranked.map(i => titleWords[i]).sort((a, b) => b[1] - a[1]);
	}, [titleWords, titleWordsHaystack, uf, titleWordFilter, titleWordsExpanded]);

	const families = useMemo(() => {
		const uniqueFamilies: Record<string, number> = {};
		mitreJobs.forEach(job => {
			if (job.family) {
				let famArray: string[];
				if (job.family.includes('[')) {
					famArray = job.family.split('"').filter((s, i) => i % 2 === 1).map(s => s.trim());
				}
				else {
					famArray = [job.family];
				}
				famArray.forEach(fam => {
					if (uniqueFamilies[fam]) {
						uniqueFamilies[fam]++;
					} else {
						uniqueFamilies[fam] = 1;
					}
				});
			}
		});
		const sorted = Object.entries(uniqueFamilies).sort((a, b) => b[1] - a[1]);
		return sorted;
	}, []);

	const familiesHaystack = useMemo(() => families.map(([fam]) => fam), [families]);

	const filteredFamilies = useMemo(() => {
		if (familySearchFilter.trim() === '') return families.filter(([fam, count]) => (familyWordsExpanded || (count > 4) || familyFilter.get(fam) !== null)).sort((a, b) => (familyFilter.get(b[0]) === true ? 2 : 0) - (familyFilter.get(a[0]) === true ? 2 : 0) || (familyFilter.get(b[0]) === false ? 1 : 0) - (familyFilter.get(a[0]) === false ? 1 : 0));

		const [idxs, info, order] = uf.search(familiesHaystack, familySearchFilter.trim());
		if (!idxs) return [];
		// info/order are null when there are too many matches to rank
		const ranked = info && order ? order.map(i => info.idx[i]) : idxs;
		return ranked.map(i => families[i]).sort((a, b) => b[1] - a[1]);
	}, [families, familiesHaystack, uf, familySearchFilter, familyWordsExpanded]);

	const expExpressions = useMemo(() => {
		return Object.fromEntries(mitreJobs.map(job => [job.link, new Function('degree', 'experience', 'is_student', `return ${job.experience};`)]));
	}, [mitreJobs]);



	function formatMoney(amount: number) {
		if (!amount) {
			return '';
		}
		return `$${amount.toLocaleString()}`;
	}

	function generateJobElement(job: typeof mitreJobs[number]) {
		let family = job.family ? job.family : '';
		let family_list: string[] = [];
		if (family.includes('[')) {
			// every other starting at 1
			let family_list = family.split('"')
			family_list = family_list.filter((_, index) => index % 2 === 1);
			family = family_list.join(', ');
		}

		const isActive = job.link === activeJob;
		return (
			<li key={job.link} className="tc2 pb-2 pt-1 px-2 rounded-lg cursor-default hover:bg-[#6661]" onClick={() => { console.log(job.link); setActiveJob(isActive ? '' : job.link); }}>
				<div className={`grid ${!isActive ? 'sm:grid-cols-[3fr_2fr_1fr_1fr]' : 'md:grid-cols-[3fr_2fr_1fr_1fr]'} grid-cols-[2fr_1fr]`} >
					<div className='whitespace-nowrap text-ellipsis overflow-hidden'><a href={job.link} target="_blank" rel="noopener noreferrer" className="tc1 font-bold text-lg " title={job.title}>{job.title}</a></div>
					<span className="pt-1 text-sm tc3 whitespace-nowrap text-ellipsis overflow-hidden" title={family}>{family}</span>
					<span className="pt-1 text-sm tc3 whitespace-nowrap text-ellipsis overflow-hidden">{formatMoney(job.salary[0])}</span>
					<span className="pt-1 text-sm tc3 text-ellipsis overflow-hidden">{job.date}</span>
				</div>
				<p className={`text-[0.9em]/5 ${isActive ? '' : 'line-clamp-2'}`}>{job.summary || ''}</p>
				{isActive && (
					<div className="grid gap-2 mt-2 grid-cols-[1fr_2fr]">
						<p className="text-[0.9em]/5 tc3">mode: {job.mode}</p>
						<p className="text-[0.9em]/5 tc3">salary range: {job.salary?.map((s) => formatMoney(s)).join(' - ')}</p>
						<p className="text-[0.9em]/5 tc3">clearance: {job.clearance_current ? job.clearance_current : 'N/A'}</p>
						<p className="text-[0.9em]/5 tc3">{job.locations.join(', ')}</p>
					</div>
				)}
			</li>
		);
	}

	const spacer = <div className="h-0.5 my-2 rounded-full" style={{ background: 'linear-gradient(to right, transparent, #6668 20%, #6668 80%, transparent)' }}></div>;


	const job_elements = useMemo(() => {

		return Object.fromEntries(mitreJobs.map((job) => [
			job.link,
			generateJobElement(job)
		]));
	}, [activeJob]);

	function filterByTagFilter(job: JobPosting, tagFilter: TagFilter, field: keyof JobPosting, compareOrInclide: 'compare' | 'include' = 'include', and_or: 'and' | 'or' = 'or') {
		const compMode: boolean = compareOrInclide === 'compare';
		const andMode: boolean = and_or === 'and';
		let result = true;
		if (tagFilter.active) {
			result = andMode;
			if (tagFilter.included.size === 0) {
				result = true;
			}
			else {
				if (!job[field] || typeof job[field] !== 'string') return false;
				for (const includedMode of tagFilter.included) {
					if (andMode) result = result && (compMode ? (job[field] === includedMode) : (job[field].toLowerCase().includes(includedMode.toLowerCase())));
					else result = result || (compMode ? (job[field] === includedMode) : (job[field].toLowerCase().includes(includedMode.toLowerCase())));
				}
			}

			if (tagFilter.excluded.size > 0) {
				if (!job[field] || typeof job[field] !== 'string') return result;
				for (const excludedMode of tagFilter.excluded) {
					result = result && (compMode ? (job[field] !== excludedMode) : (!job[field].toLowerCase().includes(excludedMode.toLowerCase())));
				}
			}
		}
		return result;
	}

	function filterByJobExperience(link: string, education_level: number | null, years_exp: number | null, is_student: boolean): boolean {
		if (education_level === null) education_level = 3;
		if (years_exp === null) years_exp = 100;
		console.log(`Filtering job ${expExpressions[link]} with d=${education_level}, e=${years_exp}, s=${is_student} => result: ${expExpressions[link](education_level, years_exp, is_student)}`);
		return expExpressions[link](education_level, years_exp, is_student);
	}

	const filteredJobs = useMemo(() => {
		const filtered = mitreJobs.filter((job) => {
			if (differedSalaryFilter) {
				const [min, max] = differedSalaryFilter;
				if (job.salary[0] < min || job.salary[0] > max) return false;
			}
			if (differedDateFilter) {
				const [start, end] = differedDateFilter;
				const jobDate = new Date(job.date).getTime();
				if (jobDate < start || jobDate > end) return false;
			}
			if (!filterByTagFilter(job, modeFilter, 'mode', 'compare', 'or')) return false;
			if (!filterByTagFilter(job, titleWordsFilter, 'title', 'include', titleWordIncludeMode)) return false;
			if (!filterByTagFilter(job, clearanceFilter, 'clearance_current', 'compare', 'or')) return false;
			if (!filterByTagFilter(job, familyFilter, 'family', 'include', familyIncludeMode)) return false;
			if (doExperienceFilter && !filterByJobExperience(job.link, educationLevel, experienceYears, isStudent)) return false;

			return true;
		});


		// TODO: apply ufuzzy search to combined job text and filter by "searchFilter"
		// values prepared in summaryHaystack
		// summaryHaystack {joblink: haystack string}

		if (!searchFilter) return filtered;

		// filter haystack to reduce size
		const filteredHaystack = filtered.map(job => summaryHaystack[job.link]);

		// apply fuzzy search on filteredHaystack
		const [idxs, info, order] = uf.search(filteredHaystack, searchFilter);
		if (!idxs || idxs.length === 0 || !order) return [];


		// info/order are null when there are too many matches to rank
		const ranked = info && order ? order.map(i => info.idx[i]) : idxs;
		return ranked.map(i => filtered[i]);



	}, [mitreJobs, differedSalaryFilter, differedDateFilter, modeFilter, titleWordsFilter, clearanceFilter, familyFilter, expExpressions, educationLevel, experienceYears, isStudent, doExperienceFilter, searchFilter, summaryHaystack, titleWordIncludeMode, familyIncludeMode]);

	const sortedElements = useMemo(() => {
		if (!sortField) return filteredJobs;
		const sorted = [...filteredJobs];
		const order_multiplier = sortOrder === 'asc' ? 1 : -1;

		if (sortField === 'title') {
			sorted.sort((a, b) => b['title'].localeCompare(a['title']) * order_multiplier);
		}
		if (sortField === 'salary') {
			sorted.sort((a, b) => (a['salary'][0] - b['salary'][0]) * order_multiplier);
		}
		if (sortField === 'date') {
			sorted.sort((a, b) => (new Date(a['date']).getTime() - new Date(b['date']).getTime()) * order_multiplier);
		}
		if (sortField === 'relevance') {
			// results are already ranked by fuzzy search in filteredJobs
			// reverse if sortOrder is 'asc'
			if (sortOrder === 'asc') {
				sorted.reverse();
			}
		}
		return sorted;
	}, [filteredJobs, sortField, sortOrder]);

	const sortedJobElements = useMemo(() => {
		return sortedElements.map((job) => job_elements[job.link]);
	}, [sortedElements, activeJob]);

	const loadMoreResults = (event: React.UIEvent<HTMLDivElement>) => {
		// takes scroll event
		// if at the end of the list, load more results
		const target = event.currentTarget;
		const distToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
		if (distToBottom < 2000) {
			console.log('Loading more results...');
			setNumLoadedResults(prev => Math.min(prev + 20, Math.max(sortedElements.length, 20)));
		}

		if (distToBottom > 4000) {
			console.log('unloading results...');
			setNumLoadedResults(prev => Math.max(prev - 20, 20));
		}
	};

	const tagFitlerBoxStyle = 'bg-[#f4f4ffe8] dark:bg-[#141111e8] relative';
	const tagGridStyle = 'p-3 '
	const searchBarsStyle = 'bg-[#f4f4ffe8] dark:bg-[#141111e8] p-4';
	const uiGapStyle = 'gap-px';


	return (
		<div className='relative'>
			<div className='-z-10 relative select-none' style={{ opacity: 0, animation: "fade-in 10s ease 0.2s forwards", animationDelay: "1s" }}><GPUStarBackground count={100000} /></div>

			<div className='bg1 mx-auto border-l border-r border-gray-500/50' style={{ width: 'clamp(300px, 1400px, 95%)' }}>

				<div className='p-4 tc2'>
					<h1 className="tc1 font-bold text-xl">MITRE Jobs Search</h1>
					<p>This is a tool i made for myself to make it easier to search the MITRE job board</p>
					<p>The main improvement is FILTERING BY EXPERIENCE LEVEL!! What a concept.</p>
					<p>Supports fuzzy searching and instant results</p>
					<p>Listed locations are not reliable, as they are not consistently scalable</p>
				</div>
				<div className={`p-px flex flex-col ${uiGapStyle} bg-[radial-gradient(ellipse_100%_120%,#333_0%,#fff_70%)] dark:bg-[radial-gradient(ellipse_100%_120%,#888_0%,#000_70%)]`}>
					{/* tag grids */}
					<div className='grid gap-px sm:grid-cols-[1fr_2fr]' >
						{/*mode filter*/}
						<div className={tagFitlerBoxStyle}>
							<div className="flex flex-row items-center gap-2">
								<h2 className="tc1 font-bold text mb-2 whitespace-nowrap pl-2 pt-2">filter mode</h2>
							</div>
							<div className="absolute top-2 right-2 flex flex-row gap-2">
								<button className="w-6 h-6 cursor-pointer select-none tc3" title={"clear mode filter"} onClick={() => modeFilter.clear()}>
									<FaTrash className="w-full h-full p-1" />
								</button>
							</div>
							<div className={"max-h-48 h-full mini-scroll overflow-y-auto " + tagGridStyle}>
								<TagCheckboxGrid items={modes} filter={modeFilter} />
							</div>
						</div>
						{/*title word filter*/}
						<div className={tagFitlerBoxStyle}>
							<div className="flex flex-row items-center gap-2">
								<h2 className="tc1 font-bold text mb-2 whitespace-nowrap pl-2 pt-2">filter words in job title</h2>
								<input
									type="text"
									placeholder="search for tags..."
									className="py-2 px-3 w-full focus:outline-none"
									value={titleWordFilter}
									onChange={(e) => setTitleWordFilter(e.target.value)}
								/>
							</div>
							<div className="absolute top-2 right-2 flex flex-row gap-2">
								<button className="cursor-pointer select-none tc3 font-bold w-12 text-center" title="toggle include mode " onClick={() => setTitleWordIncludeMode(titleWordIncludeMode === 'and' ? 'or' : 'and')}>
									{titleWordIncludeMode.toUpperCase()}
								</button>
								<button className="w-6 h-6 cursor-pointer select-none tc3" title={titleWordsExpanded ? "show less words" : "show more words"} onClick={() => setTitleWordsExpanded(!titleWordsExpanded)}>
									{titleWordsExpanded ? <FaCompressAlt className="w-full h-full" /> : <FaExpandAlt className="w-full h-full" />}
								</button>
								<button className="w-6 h-6 cursor-pointer select-none tc3" title="clear title words filter" onClick={() => titleWordsFilter.clear()}>
									<FaTrash className="w-full h-full p-1" />
								</button>
							</div>
							<div className={"h-48 mini-scroll overflow-y-auto " + tagGridStyle}>
								<TagCheckboxGrid items={filteredTitleWords} filter={titleWordsFilter} minColWidth={140} />
							</div>
						</div>
						{/*clearance filter*/}
						<div className={tagFitlerBoxStyle}>
							<div className="flex flex-row items-center gap-2">
								<h2 className="tc1 font-bold text mb-2 whitespace-nowrap pl-2 pt-2">filter clearance</h2>
							</div>
							<div className="absolute top-2 right-2 flex flex-row gap-2">
								<button className="w-6 h-6 cursor-pointer select-none tc3" title={"clear clearance filter"} onClick={() => clearanceFilter.clear()}>
									<FaTrash className="w-full h-full p-1" />
								</button>
							</div>
							<div className={"h-48 mini-scroll overflow-y-auto " + tagGridStyle}>
								<TagCheckboxGrid items={clearances} filter={clearanceFilter} />
							</div>
						</div>
						{/*family filter*/}
						<div className={tagFitlerBoxStyle}>
							<div className="flex flex-row items-center gap-2">
								<h2 className="tc1 font-bold text mb-2 whitespace-nowrap pl-2 pt-2">filter job family</h2>
								<input
									type="text"
									placeholder="search for families..."
									className="py-2 px-3 w-full focus:outline-none"
									value={familySearchFilter}
									onChange={(e) => setFamilySearchFilter(e.target.value)}
								/>
							</div>
							<div className="absolute top-2 right-2 flex flex-row gap-2">
								<button className="cursor-pointer select-none tc3 font-bold w-12 text-center" title="toggle include mode " onClick={() => setFamilyIncludeMode(familyIncludeMode === 'and' ? 'or' : 'and')}>
									{familyIncludeMode.toUpperCase()}
								</button>
								<button className="w-6 h-6 cursor-pointer select-none tc3" title={familyWordsExpanded ? "show less families" : "show more families"} onClick={() => setFamilyWordsExpanded(!familyWordsExpanded)}>
									{familyWordsExpanded ? <FaCompressAlt className="w-full h-full" /> : <FaExpandAlt className="w-full h-full" />}
								</button>
								<button className="w-6 h-6 cursor-pointer select-none tc3" title={"clear job family filter"} onClick={() => familyFilter.clear()}>
									<FaTrash className="w-full h-full p-1" />
								</button>
							</div>
							<div className={"h-48 mini-scroll overflow-y-auto " + tagGridStyle}>
								<TagCheckboxGrid items={filteredFamilies} filter={familyFilter} />
							</div>
						</div>
					</div>
					{/* sliders bar */}
					<div className={"flex gap-4 sm:flex-row flex-col " + searchBarsStyle}>
						{/*salary filter*/}
						<DualRangeSlider
							title="salary"
							min={salaryRange['min']}
							max={salaryRange['max']}
							step={1000}
							value={salaryFilter ?? [salaryRange['min'], salaryRange['max']]}
							onChange={setSalaryFilter}
							formatValue={(v) => `$${v.toLocaleString()}`}
							minLabel="Minimum price"
							maxLabel="Maximum price"
							minGap={20000} // 20k in value units
						/>
						{/*date filter*/}
						<DualRangeSlider
							title="date"
							min={dateRange['min']}
							max={Date.now()}
							step={24 * 60 * 60 * 1000} // 1 day in milliseconds
							value={dateFilter ?? [dateRange['min'], dateRange['max']]}
							onChange={setDateFilter}
							formatValue={(v) => new Date(v).toLocaleDateString()}
							minLabel="Earliest date"
							maxLabel="Latest date"
							minGap={5 * 24 * 60 * 60 * 1000} // 5 day in milliseconds
						/>
					</div>

					{/* experience bar */}
					<div className={"flex gap-4 sm:flex-row flex-col " + searchBarsStyle}>
						<label className="flex items-center gap-2 tc1 font-bold">
							filter experience
							<button
								onClick={(e) => setDoExperienceFilter(!doExperienceFilter)}
								className={`text-white cursor-pointer select-none -mt-2 min-w-10.5 min-h-5 bg-gray-500/30 rounded-full translate-y-1 after:text-xs after:block after:w-4 after:h-4 after:rounded-full after:translate-x-0.5 before:-translate-x-4.25 before:z-10 before:text-xs after:transition-all after:duration-300 before:transition-all before:duration-300 before:absolute before:top-1/2 before:left-1/2 before:-translate-y-1/2 ${doExperienceFilter ? " before:translate-x-1 after:translate-x-6 after:bg-(--khg) after:content-['✔']" : "after:bg-(--khr) before:content-['✖'] "}`}
							/>
						</label>
						{/* education - radio buttons */}
						<label className="flex items-center gap-2 tc1 font-bold">
							education
							{Object.entries(educationDict).map(([key, label]) => {
								const isSelected = Number(key) === educationLevel;
								return (
									<button key={key} className={`mr-4 px-1 rounded-sm ${isSelected ? 'tc5 bg-(--khg)' : 'tc2'}`}
										onClick={() => setEducationLevel(Number(key) === educationLevel ? null : Number(key))}
									>
										{label}
									</button>
								);
							})}
						</label>
						{/* years of experience - slider*/}
						<label className="flex items-center gap-2 tc1 font-bold">
							years of experience
							<input
								type="number"
								placeholder="years of experience"
								className=" w-12 focus:outline-none tc2 font-normal"
								value={experienceYears ?? ''}
								onChange={(e) => setExperienceYears(Math.min(20, Math.max(0, Number(e.target.value))))}
							/>
						</label>
						{/* is student - checkbox */}
						<label className="flex items-center gap-2 tc1 font-bold">
							student
							<button
								onClick={(e) => setIsStudent(!isStudent)}
								className={`text-white cursor-pointer select-none -mt-2 min-w-10.5 min-h-5 bg-gray-500/30 rounded-full translate-y-1 after:text-xs after:block after:w-4 after:h-4 after:rounded-full after:translate-x-0.5 before:-translate-x-4.25 before:z-10 before:text-xs after:transition-all after:duration-300 before:transition-all before:duration-300 before:absolute before:top-1/2 before:left-1/2 before:-translate-y-1/2 ${isStudent ? " before:translate-x-1 after:translate-x-6 after:bg-(--khg) after:content-['✔']" : "after:bg-(--khr) before:content-['✖'] "}`}
							/>
						</label>
					</div>

					<div className={"flex sm:flex-row flex-col " + uiGapStyle}>

						{/* search bar */}
						<div className={"grow flex gap-4 sm:flex-row flex-col " + searchBarsStyle}>
							<h2 className="tc1 font-bold whitespace-nowrap">search</h2>
							<input
								type="text"
								placeholder="search job description..."
								className="w-full focus:outline-none"
								value={searchFilter}
								onChange={(e) => setSearchFilter(e.target.value)}
							/>
						</div>

						{/* sort bar */}

						<div className={"flex gap-4 sm:flex-row flex-col " + searchBarsStyle}>
							<span className="tc1 font-bold whitespace-nowrap">sort by</span>
							<div className="flex flex-row gap-2" >
								{sort_fields.map((field, index) => (
									<>
										<button key={field} className={`min-w-17.5 flex items-center justify-center gap-1 ${sortField === field ? 'tc1' : 'tc3'}`} onClick={() => { sortField === field ? setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') : setSortField(field) }}>
											{field}
											{
												sortField === field ? (sortOrder === 'asc' ? <FaSortUp className="w-4 h-4 inline-block ml-1" /> : <FaSortDown className="w-4 h-4 inline-block ml-1" />)
													: <FaSort className="w-4 h-4 inline-block ml-1" />
											}
										</button>
										{index < sort_fields.length - 1 && <div className="w-0.5 h-full" style={{ background: 'linear-gradient(to top, transparent, #6668 50%, transparent)' }} />}
									</>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className='pt-1 pb-2 tc3 text-sm pl-4'>found {sortedJobElements.length.toString().padStart(4)} : shown {numLoadedResults.toString().padStart(4)}</div>
				<div className='h-screen overflow-y-auto mini-scroll border-top border-bottom border-gray-500/30' onScroll={loadMoreResults}>
					<ul className="pt-2 pb-[40vh]">
						{sortedJobElements.slice(0, numLoadedResults).map((element, index) => (
							<>
								{element}
								{index < sortedJobElements.length - 1 && spacer}
							</>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

