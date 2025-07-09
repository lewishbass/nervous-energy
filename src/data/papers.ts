export interface Paper {
    title: string;
    description: string;
    link: string;
    hasPage: boolean;
    keywords: string;
    imagePath: string;
    reqAuth: boolean;
}

export const papers: Paper[] = [
    {
        title: 'A Survey on Latent Reasoning',
        description: 'A comprehensive survey on latent reasoning in machine learning',
        link: '/papers/latent-reasoning',
        hasPage: true,
        keywords: 'survey latent reasoning machine learning AI',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },

	];

