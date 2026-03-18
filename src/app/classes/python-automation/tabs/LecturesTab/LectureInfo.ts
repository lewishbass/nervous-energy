import { index } from 'd3';
import { DummyLecture, DummyLectureIcon } from '../../lectures/DummyLecture';
import { SetupLecture, SetupLectureIcon } from '../../lectures/01-SetupLecture';
import { VariablesLecture, VariablesLectureIcon } from '../../lectures/02-VariablesLecture';
import { BagLecture, BagLectureIcon } from '../../lectures/03-BagLecture';
import { ListLecture, ListLectureIcon } from '../../lectures/04-ListLecture';
import { FlowControlLecture, FlowControlLectureIcon } from '../../lectures/05-FlowControlLecture';
import { IntroToMLLecture, IntroToMLLectureIcon } from '../../lectures/06.5-IntroToML';
import { TupleSetDict, TupleSetDictIcon } from '../../lectures/07-TupleSetDict';
import { MoreDataStructures, MoreDataStructuresIcon } from '../../lectures/08-MoreDataStructures';
import { BreaksInlineLecture, BreaksInlineLectureIcon } from '../../lectures/06-BreaksInline';
import { SortingLecture, SortingLectureIcon } from '../../lectures/09-SortingLecture';
import { ClassesLecture, ClassesLectureIcon } from '../../lectures/10-ClassesLecture';
import { RecursionLecture, RecursionLectureIcon } from '../../lectures/11-RecursionLecture';
import { FilesLecture, FilesLectureIcon } from '../../lectures/12-FilesLecture';
import { FileSystemLecture, FileSystemLectureIcon } from '../../lectures/13-FileSystemLecture';
import { InterfacesLecture, InterfacesLectureIcon } from '../../lectures/15-InterfacesLecture';
import { PackagingLecture, PackagingLectureIcon } from '../../lectures/17-PackagingLecture';
import { ProjectLecture, ProjectLectureIcon } from '../../lectures/16-ProjectLecture';
import { InlineLogicLecture, InlineLogicLectureIcon } from '../../lectures/17-InlineLogicLecture';
import { DecoratorsLecture, DecoratorsLectureIcon } from '../../lectures/18-DecoratorsLecture';


export type LecturePair = {
	icon: typeof DummyLectureIcon;
	lecture: typeof DummyLecture;
	classNumber?: number;
	index: number;
	finished?: boolean;
}



export const lectureList: LecturePair[] = [
	{ finished: true, icon: SetupLectureIcon, lecture: SetupLecture, index: 0, classNumber: 0 },
	{ finished: true, icon: VariablesLectureIcon, lecture: VariablesLecture, index: 1, classNumber: 0 },
	{ finished: true, icon: BagLectureIcon, lecture: BagLecture, index: 2, classNumber: 1 },
	{ finished: true, icon: ListLectureIcon, lecture: ListLecture, index: 3, classNumber: 2 },
	{ finished: true, icon: FlowControlLectureIcon, lecture: FlowControlLecture, index: 4, classNumber: 3 },
	{ finished: true, icon: BreaksInlineLectureIcon, lecture: BreaksInlineLecture, index: 5, classNumber: 4 },
	//{ finished: true, icon: IntroToMLLectureIcon, lecture: IntroToMLLecture, index: 6.5, classNumber: 5 },
	{ finished: true, icon: TupleSetDictIcon, lecture: TupleSetDict, index: 7, classNumber: 5 },
	{ finished: true, icon: MoreDataStructuresIcon, lecture: MoreDataStructures, index: 8, classNumber: 6 },
	{ finished: true, icon: SortingLectureIcon, lecture: SortingLecture, index: 9, classNumber: 7 },
	{ finished: true, icon: ClassesLectureIcon, lecture: ClassesLecture, index: 10, classNumber: 8 },
	{ finished: false, icon: RecursionLectureIcon, lecture: RecursionLecture, index: 11, classNumber: 9 },
	{ finished: true, icon: FilesLectureIcon, lecture: FilesLecture, index: 11, classNumber: 10 },
	{ finished: false, icon: FileSystemLectureIcon, lecture: FileSystemLecture, index: 12, classNumber: 11 },
	{ finished: false, icon: InterfacesLectureIcon, lecture: InterfacesLecture, index: 13, classNumber: 12 },
	{ finished: false, icon: PackagingLectureIcon, lecture: PackagingLecture, index: 14, classNumber: 13 },
	{ finished: false, icon: ProjectLectureIcon, lecture: ProjectLecture, index: 15, classNumber: 14 },
	{ finished: false, icon: ProjectLectureIcon, lecture: ProjectLecture, index: 16, classNumber: 15 },
	{ finished: false, icon: ProjectLectureIcon, lecture: ProjectLecture, index: 17, classNumber: 16 },
	{ finished: false, icon: InlineLogicLectureIcon, lecture: InlineLogicLecture, index: 18, classNumber: 17 },
	{ finished: false, icon: DecoratorsLectureIcon, lecture: DecoratorsLecture, index: 19, classNumber: 18 },
];

lectureList.forEach((lecturePair, index) => {
	lecturePair.index = index;
});

export default lectureList;