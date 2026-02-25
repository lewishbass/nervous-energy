import { index } from 'd3';
import { DummyLecture, DummyLectureIcon } from '../../lectures/DummyLecture';
import { SetupLecture, SetupLectureIcon } from '../../lectures/01-SetupLecture';
import { VariablesLecture, VariablesLectureIcon } from '../../lectures/02-VariablesLecture';
import { BagLecture, BagLectureIcon } from '../../lectures/03-BagLecture';
import { ListLecture, ListLectureIcon } from '../../lectures/04-ListLecture';
import { FlowControlLecture, FlowControlLectureIcon } from '../../lectures/05-FlowControlLecture';
import { IntroToMLLecture, IntroToMLLectureIcon } from '../../lectures/06.5-IntroToML';
import { StringsLecture, StringsLectureIcon } from '../../lectures/07-StringsLecture';
import { ListOperationsLecture, ListOperationsLectureIcon } from '../../lectures/08-ListOperationsLecture';
import { BreaksInlineLecture, BreaksInlineLectureIcon } from '../../lectures/06-BreaksInline';
import { FunctionsLecture, FunctionsLectureIcon } from '../../lectures/09-FunctionsLecture';
import { ClassesLecture, ClassesLectureIcon } from '../../lectures/10-ClassesLecture';
import { FilesLecture, FilesLectureIcon } from '../../lectures/11-FilesLecture';
import { FileSystemLecture, FileSystemLectureIcon } from '../../lectures/12-FileSystemLecture';
import { InterfacesLecture, InterfacesLectureIcon } from '../../lectures/13-InterfacesLecture';
import { PackagingLecture, PackagingLectureIcon } from '../../lectures/14-PackagingLecture';
import { ProjectLecture, ProjectLectureIcon } from '../../lectures/15-ProjectLecture';
import { InlineLogicLecture, InlineLogicLectureIcon } from '../../lectures/16-InlineLogicLecture';
import { DecoratorsLecture, DecoratorsLectureIcon } from '../../lectures/17-DecoratorsLecture';

import { LectureTemplate, LectureIcon } from '../../lectures/LectureTemplate';
import { title } from 'process';

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
	{ finished: false, icon: IntroToMLLectureIcon, lecture: IntroToMLLecture, index: 6.5, classNumber: 4 },
	{ finished: false, icon: StringsLectureIcon, lecture: StringsLecture, index: 7, classNumber: 5 },
	{ finished: false, icon: ListOperationsLectureIcon, lecture: ListOperationsLecture, index: 8, classNumber: 6 },
	{ finished: false, icon: FunctionsLectureIcon, lecture: FunctionsLecture, index: 9, classNumber: 8 },
	{ finished: false, icon: ClassesLectureIcon, lecture: ClassesLecture, index: 10, classNumber: 9 },
	{ finished: false, icon: FilesLectureIcon, lecture: FilesLecture, index: 11, classNumber: 10 },
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