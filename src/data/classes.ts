export interface ClassInfo {
    title: string;
    description: string;
    link: string;
    hasPage: boolean;
    startDate: string;
    endDate: string;
    location: string;
    imagePath: string;
    status: 'upcoming' | 'ongoing' | 'completed';
}

export const classes: ClassInfo[] = [
    {
        title: 'Python for Automation and Scripting',
        description: 'Learn Python programming with a focus on automation and scripting',
        link: '/classes/python-automation',
        hasPage: false,
        startDate: '2026-02-09',
        endDate: '2026-04-22',
        location: 'Henrico County Adult Education Center',
        imagePath: '/images/classes/Python-Automation.svg',
        status: 'upcoming'
    }
];