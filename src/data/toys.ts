export interface Toy {
    title: string;
    description: string;
    link: string;
    hasPage: boolean;
    keywords: string;
    imagePath: string;
    reqAuth: boolean;
}

export const toys: Toy[] = [
    {
        title: 'Stars',
        description: 'Like soduku, but less class and more dopamine',
        link: '/toys/stars',
        hasPage: false,
        keywords: 'TypeScript Node.js Tailwind stars template',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'One Step Learning Rate',
        description: 'Explaining one step learning rates for quadratic loss',
        link: '/toys/one-step-learning-rate',
        hasPage: true,
        keywords: 'learning rate optimization scheduler cyclical lr training neural network',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'XG Weight Initialization',
        description: 'Explore different weight initialization techniques for neural networks',
        link: '/toys/xg-weight-init',
        hasPage: true,
        keywords: 'neural network weight initialization xavier glorot he random orthogonal',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Backpropagation Visualizer',
        description: 'Interactive visualization of the backpropagation algorithm',
        link: '/toys/back-prop',
        hasPage: true,
        keywords: 'neural network training gradient descent chain rule optimization',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Image Captioning',
        description: "Generating image captions with with RNNs",
        link: '/toys/image-captioning',
        hasPage: false,
        keywords: 'image captioning rnn lstm attention mechanism computer vision',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Video Classification',
        description: 'Classify videos using deep learning models',
        link: '/toys/video-classification',
        hasPage: false,
        keywords: 'deep learning computer vision real-time object recognition',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    // Dummy toys
    {
        title: 'Neural Style Transfer',
        description: 'Apply artistic styles to your images using neural networks',
        link: '#',
        hasPage: false,
        keywords: 'art style transfer gan generative ai image processing',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Reinforcement Learning',
        description: 'Watch AI agents learn to navigate complex environments',
        link: '#',
        hasPage: false,
        keywords: 'reinforcement learning rl agent environment reward policy',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Language Model Playground',
        description: 'Experiment with different language models and prompts',
        link: '#',
        hasPage: false,
        keywords: 'nlp natural language processing llm transformer gpt',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Generative Adversarial Networks',
        description: 'Create unique images with GANs',
        link: '#',
        hasPage: false,
        keywords: 'gan generative adversarial networks image synthesis',
        imagePath: '/KH_back.svg',
        reqAuth: false
    },
    {
        title: 'Object Detection Demo',
        description: 'Real-time object detection in images and video',
        link: '#',
        hasPage: false,
        keywords: 'computer vision object detection yolo rcnn ssd',
        imagePath: '/KH_back.svg',
        reqAuth: false
    }

];
