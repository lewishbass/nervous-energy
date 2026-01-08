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

    {
        title: 'VideoDirectorGPT',
        description: 'Consistent multi-scene video generation via LLM-guided planning',
        link: '/papers/videodirectorGPT',
        hasPage: true,
        keywords: 'video generation LLM planning consistency',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'U-Net: Convolutional Networks for Biomedical Image Segmentation',
        description: 'First appearance of U-Net architecture for image processing tasks',
        link: '/papers/u-net',
        hasPage: true,
        keywords: 'U-Net convolutional networks biomedical image segmentation',
        imagePath: '/KH_back.svg',
        reqAuth: false
    }
	];

