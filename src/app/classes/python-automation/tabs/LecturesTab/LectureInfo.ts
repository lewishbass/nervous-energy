import { index } from 'd3';
import { DummyLecture, DummyLectureIcon } from '../../lectures/DummyLecture';
import { SetupLecture, SetupLectureIcon } from '../../lectures/01-SetupLecture';
import { VariablesLecture, VariablesLectureIcon } from '../../lectures/02-VariablesLecture';
import { StringsLecture, StringsLectureIcon } from '../../lectures/03-StringsLecture';
import { BooleanLecture, BooleanLectureIcon } from '../../lectures/04-BooleanLecture';
import { LoopsLecture, LoopsLectureIcon } from '../../lectures/05-LoopsLecture';
import { ListsLecture, ListsLectureIcon } from '../../lectures/06-ListsLecture';
import { DictionariesLecture, DictionariesLectureIcon } from '../../lectures/07-DictionariesLecture';
import { ListOperationsLecture, ListOperationsLectureIcon } from '../../lectures/08-ListOperationsLecture';
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
}



export const lectureList: LecturePair[] = [
	{ icon: SetupLectureIcon, lecture: SetupLecture, index: 0, classNumber: 0 },
	{ icon: VariablesLectureIcon, lecture: VariablesLecture, index: 1, classNumber: 1 },
	{ icon: StringsLectureIcon, lecture: StringsLecture, index: 2, classNumber: 2 },
	{ icon: BooleanLectureIcon, lecture: BooleanLecture, index: 3, classNumber: 3 },
	{ icon: LoopsLectureIcon, lecture: LoopsLecture, index: 4, classNumber: 4 },
	{ icon: ListsLectureIcon, lecture: ListsLecture, index: 5, classNumber: 5 },
	{ icon: DictionariesLectureIcon, lecture: DictionariesLecture, index: 6, classNumber: 6 },
	{ icon: ListOperationsLectureIcon, lecture: ListOperationsLecture, index: 7, classNumber: 7 },
	{ icon: FunctionsLectureIcon, lecture: FunctionsLecture, index: 8, classNumber: 8 },
	{ icon: ClassesLectureIcon, lecture: ClassesLecture, index: 9, classNumber: 9 },
	{ icon: FilesLectureIcon, lecture: FilesLecture, index: 10, classNumber: 10 },
	{ icon: FileSystemLectureIcon, lecture: FileSystemLecture, index: 11, classNumber: 11 },
	{ icon: InterfacesLectureIcon, lecture: InterfacesLecture, index: 12, classNumber: 12 },
	{ icon: PackagingLectureIcon, lecture: PackagingLecture, index: 13, classNumber: 13 },
	{ icon: ProjectLectureIcon, lecture: ProjectLecture, index: 14, classNumber: 14 },
	{ icon: ProjectLectureIcon, lecture: ProjectLecture, index: 15, classNumber: 15 },
	{ icon: ProjectLectureIcon, lecture: ProjectLecture, index: 16, classNumber: 16 },
	{ icon: InlineLogicLectureIcon, lecture: InlineLogicLecture, index: 17, classNumber: 17 },
	{ icon: DecoratorsLectureIcon, lecture: DecoratorsLecture, index: 18, classNumber: 18 },
];

lectureList.forEach((lecturePair, index) => {
	lecturePair.index = index;
});

export default lectureList;