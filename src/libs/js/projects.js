const reach_goals_banner = new URL(
    '../img/reach_goals_banner.jpg',
    import.meta.url
).href;

const PROJECTS_DATA = [
    {
        name: 'Reach Goals',
        img: reach_goals_banner,
        description: `Reach Goals is a modern web application for task and personal goal management, focusing on usability, scalability, and clean architecture.
                    It enables the creation, organization, and categorization of activities using tags, featuring multiple view modes: list, cards, and calendar.`,
        chips: [
            'React',
            'Node.js',
            'JavaScript',
            'Prisma',
            'JWT',
            'Vite',
            'PostgreSQL',
            'SCSS',
            'Serverless Architecture',
        ],
        url: 'https://github.com/LukasO20/reach-goals',
    },
];

export const projectsRender = () => {
    const mainProjects = document.querySelector(
        'main[type="projects"] .main-projects'
    );

    if (!mainProjects) return;

    mainProjects.innerHTML = PROJECTS_DATA.map(
        (project) =>
            `
            <div class="main--project-item card">
                <div class="card--banner">
                   <img src="${project.img}" alt="${project.name}">
                </div>
                <div class="card--section">
                    <div class="card--section-header">
                        <h3>${project.name}</h3>
                        <a class="smooth-el" href="${project.url}" target="_blank" rel="noopener noreferrer" lang="en">
                            Visit Repository
                            <i class="fa-solid fa-arrow-up-right-from-square icon" aria-hidden="true"></i>
                        </a>
                    </div>
                    <p lang="en">${project.description}</p>
                    <div class="chips">
                        ${project.chips.map((chip) => `<span class="chip">${chip}</span>`).join('')}
                    </div>
                </div>
            </div>
        `
    );
};
