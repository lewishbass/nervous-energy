interface JobPosting{
	title: string
	mode: string
	date: string
	family: string
	link: string
	summary?: string
	locations: string[]
	salary: number[]
	clearance_current?: string
	clearance_1y?: string
    experience: string
    fuzzyScore?: number
}

const mitreJobs_lastUpdated = "11/13/2026";

const mitreJobs: JobPosting[] = [
    {
        title: "Senior Autonomous Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117325/Senior-Autonomous-Systems-Engineer",
        summary: "Become part of our team as a Senior Autonomous Systems Engineer, driving the development and integration of intelligent and autonomous systems for the U.S. Army. Collaborate with senior leaders to deliver data-driven solutions and technical recommendations. Ideal for experienced engineers with expertise in autonomy, AI, and military systems.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "NLCC Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117085/NLCC-Communications-Engineer",
        summary: "Join us as a Communications Engineer supporting the DISA/NLCC Project, where you will provide trusted advisor support for classified communications systems and collaborate with senior government leaders. Ideal candidates bring extensive experience in communications engineering and a strong background in DoD or national security domains.",
        locations: [
            "See Sponsor City ",
            "Fort Meade - Annapolis Junction "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "NLCC Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116595/NLCC-Communications-Engineer",
        summary: "We are currently hiring a Communications Engineer to support the development, analysis, and evaluation of communications systems for the NLCC Project. You will provide trusted advisor support to senior leaders and collaborate with multidisciplinary teams. Ideal candidates have significant experience in DoD communications and a strong background in technical problem-solving.",
        locations: [
            "McLean ",
            "Fort Meade - Annapolis Junction "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead AI Architect (Intelligence Center)",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117296/Lead-AI-Architect-Intelligence-Center",
        summary: "We are looking for a Lead AI Architect to drive the evaluation, integration, and implementation of advanced AI and machine learning technologies within the Intelligence Center. You will support technical research, solution architecture, and operational testing. Ideal candidates bring significant AI experience and expertise in emerging technologies.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Lead Nuclear Effects Engineer",
        mode: "Full time",
        date: "09/11/2026",
        family: "Physics",
        link: "https://careers.mitre.org/us/en/job/R116835/Lead-Nuclear-Effects-Engineer",
        summary: "Become part of our team as a Lead Nuclear Effects Engineer, contributing to the analysis and mitigation of nuclear radiation and nuclear events on critical systems. Lead design and testing efforts, supporting the development of survivable weapon systems. Ideal for experienced engineers with strong expertise in nuclear physics and related fields.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Internships in Electrical or Computer Engineering",
        mode: "Full time",
        date: "09/14/2026",
        family: "[\"Electrical Engineering\",\"Imaging and Communication Engineering\",\"Student\",\"Hardware Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117311/Internships-in-Electrical-or-Computer-Engineering",
        summary: "We are currently hiring a motivated intern to join our multidisciplinary team in electrical or computer engineering. Contribute to projects in electronic warfare, communications, embedded systems, and maritime systems. Ideal for students with foundational knowledge in engineering and a commitment to academic excellence.",
        locations: [
            "Hill AFB - Clearfield ",
            "Bellevue ",
            "Tampa ",
            "Huntsville "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        experience: "is_student === true"
    },
    {
        title: "Internships in Systems, Mechanical, Aerospace Engineering or Physics",
        mode: "Full time",
        date: "09/14/2026",
        family: "[\"Systems Engineering\",\"Physics\",\"Student\",\"Aerospace, Space and Defense Engineering\",\"Mechanical Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117310/Internships-in-Systems-Mechanical-Aerospace-Engineering-or-Physics",
        summary: "Exciting opportunity for students to gain hands-on experience in systems, mechanical, aerospace engineering, or physics. Contribute to impactful projects in digital and model-based engineering, systems security, or mechanical analysis. Ideal for those pursuing relevant degrees with strong academic performance and a passion for technical problem-solving.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Tampa ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        experience: "is_student === true"
    },
    {
        title: "Internships in Cybersecurity and Information Security",
        mode: "Full time",
        date: "09/14/2026",
        family: "[\"Cyber Security\",\"Information Security\",\"Student\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117314/Internships-in-Cybersecurity-and-Information-Security",
        summary: "Take on the role of a cybersecurity intern, collaborating with experienced professionals to address real-world challenges in information security. Apply your academic knowledge to hands-on projects in areas such as adversary emulation and cyber effects. Ideal for full-time students with foundational cybersecurity expertise seeking practical experience in a dynamic, mission-driven environment.",
        locations: [
            "San Antonio ",
            "Honolulu ",
            "Colorado Springs ",
            "Shaw AFB ",
            " 10 "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        experience: "is_student === true"
    },
    {
        title: "Internships in Data Science, Math, Statistics or Operations Research",
        mode: "Full time",
        date: "09/14/2026",
        family: "[\"Data Science and Analytics\",\"Student\",\"Mathematics\",\"Operations Research\"]",
        link: "https://careers.mitre.org/us/en/job/R117312/Internships-in-Data-Science-Math-Statistics-or-Operations-Research",
        summary: "We are expanding our team: Interns in Data Science, Math, Statistics, or Operations Research will collaborate with experts to apply your knowledge in areas such as data analysis, applied mathematics, and computational analytics. Ideal for full-time students seeking hands-on experience in a mission-driven environment.",
        locations: [
            "Hill AFB - Clearfield ",
            "Colorado Springs ",
            "Wright-Patterson AFB - Fairborn ",
            "Tampa "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        experience: "is_student === true"
    },
    {
        title: "Principal Software Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117202/Principal-Software-Engineer",
        summary: "We are seeking a Principal Software Engineer to lead the architecture and delivery of enterprise data warehousing and integration initiatives. Oversee modernizing data platforms, drive cloud adoption, and provide technical leadership. Ideal for experienced professionals in data engineering and team management.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "experience >= 10 && degree >= 1"
    },
    {
        title: "Human Resource Business Partner",
        mode: "Full time",
        date: "09/22/2026",
        family: "HR Business Partners & Employee Relations",
        link: "https://careers.mitre.org/us/en/job/R117560/Human-Resource-Business-Partner",
        summary: "Become part of our team as a Human Resource Business Partner, aligning workforce strategies with business objectives and leading talent management initiatives. Collaborate with leaders to drive organizational effectiveness and foster a culture of continuous improvement. Ideal for experienced HR professionals with a strong background in strategic partnership and data-driven decision-making.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            125600,
            157000,
            188400
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "HR Portfolio Manager",
        mode: "Full time",
        date: "08/28/2026",
        family: "HR Operations",
        link: "https://careers.mitre.org/us/en/job/R117124/HR-Portfolio-Manager",
        summary: "We are recruiting a HR Portfolio Manager to lead and coordinate HR project portfolios, ensuring alignment with strategic priorities. You will manage project plans, schedules, and reporting, supporting both technology and program initiatives. Ideal candidates bring significant project management experience and expertise in cross-functional collaboration.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            132000,
            165000,
            198000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "((degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)) && experience >= 5"
    },
    {
        title: "Deputy Project Lead, OSW R&E C5ISRT Technologies",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116781/Deputy-Project-Lead-OSW-R-E-C5ISRT-Technologies",
        summary: "Join us as Deputy Project Lead, OSW R&E C5ISRT Technologies, where you will oversee a growing work program focused on advancing technology solutions for the Department of War’s C5ISRT mission. Lead MITRE’s work with government sponsors, manage key deliverables, and collaborate with technical teams. Ideal for experienced professionals with strong leadership and technical expertise in C5ISRT environments.",
        locations: [
            "McLean ",
            "See Sponsor City "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Principal Missile Defense Space Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116851/Principal-Missile-Defense-Space-Systems-Engineer",
        summary: "Become part of our team as a Principal Missile Defense Space Systems Engineer, driving innovation in next-generation missile defense space architecture and integration. Lead technical efforts, coordinate with cross-functional teams, and influence mission-critical decisions. Ideal for experienced engineers with deep technical expertise and a strong background in systems engineering.",
        locations: [
            "Colorado Springs, Colorado, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead Network Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117434/Lead-Network-Engineer",
        summary: "We are seeking a Lead Network Engineer to provide technical leadership in network design, integration, and security for the Department of the Air Force. The role involves hands-on prototyping, SD-WAN and cloud architecture, and collaboration with government stakeholders. Ideal candidates bring significant experience in network engineering and a strong background in mission-driven technical solutions.",
        locations: [
            "Bedford ",
            "Wright-Patterson AFB - Fairborn "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Medicaid Enterprise Systems and Policy Principal",
        mode: "Full time",
        date: "09/21/2026",
        family: "Health",
        link: "https://careers.mitre.org/us/en/job/R117561/Medicaid-Enterprise-Systems-and-Policy-Principal",
        summary: "Exciting opportunity for a senior technical leader to provide expertise in Medicaid Enterprise Systems, cybersecurity, and cross-agency data integration. Lead complex engagement teams, develop evidence-based strategies, and support CMS programs. Ideal for candidates with extensive experience in Medicaid systems and strong analytical and communication skills.",
        locations: [
            "Bedford ",
            "Windsor ",
            "McLean "
        ],
        salary: [
            155000,
            194000,
            233000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "USSOUTHCOM Project Leader",
        mode: "Full time",
        date: "09/30/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117662/USSOUTHCOM-Project-Leader",
        summary: "We are currently hiring a USSOUTHCOM Project Leader to provide strategic, technical, and operational leadership for a diverse work program supporting the U.S. Southern Command. Lead multidisciplinary teams, collaborate with senior military and civilian leaders, and drive integration of advanced security and operational capabilities. Ideal for experienced project leaders in national security or defense environments.",
        locations: [
            "Doral, Florida, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Non-Kinetic Operations Engineer",
        mode: "Full time",
        date: "10/02/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117316/Non-Kinetic-Operations-Engineer",
        summary: "We are looking for a Non-Kinetic Operations Engineer to advance secure, mission-ready communications and operational resiliency. You will design and implement resilient systems, support applied research, and collaborate with multidisciplinary teams. Ideal candidates bring strong technical expertise in non-kinetic operations and systems engineering.",
        locations: [
            "San Antonio ",
            "Wright-Patterson AFB - Fairborn "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 5) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "PTOC Shift Leader",
        mode: "Part time",
        date: "10/02/2026",
        family: "Security",
        link: "https://careers.mitre.org/us/en/job/R117639/PTOC-Shift-Leader",
        summary: "We are expanding our team: As a PTOC Shift Leader, you will supervise and direct physical security operations, ensuring the safety and protection of MITRE’s assets and personnel. This role requires strong leadership and operational expertise, with a focus on security systems and emergency response. Ideal for experienced professionals with a background in security management.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            75000,
            93500,
            112000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Technical Recruiter",
        mode: "Full time",
        date: "10/05/2026",
        family: "Talent Acquisition",
        link: "https://careers.mitre.org/us/en/job/R117709/Senior-Technical-Recruiter",
        summary: "We are currently hiring a Senior Technical Recruiter to manage the full recruitment lifecycle, partnering with hiring managers to meet talent needs. You will source and engage candidates, advise on selection processes, and deliver a high-quality candidate experience. Ideal candidates bring significant experience in full-cycle recruiting and strong stakeholder management skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            99600,
            124500,
            149400
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Lead Fires Systems Engineer (Joint and Services Center)",
        mode: "Full time",
        date: "10/05/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117701/Lead-Fires-Systems-Engineer-Joint-and-Services-Center",
        summary: "We are looking for a Lead Fires Systems Engineer to provide critical interface and support for USPACOM Fires initiatives. You will shape systems engineering plans, collaborate with stakeholders, and integrate non-kinetic effects. Ideal candidates bring strong operational experience in fires and expertise in system-of-systems engineering within the Department of Defense.",
        locations: [
            "Honolulu "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Associate Complex Systems Modeler",
        mode: "Full time",
        date: "10/01/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117506/Associate-Complex-Systems-Modeler",
        summary: "We are expanding our team: As an Associate Complex Systems Modeler, you will develop and apply models and analytic tools to address critical national challenges. Collaborate with government sponsors, conduct impactful analyses, and contribute to innovative solutions. Ideal for candidates with strong technical expertise and a passion for applied research in complex systems.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1"
    },
    {
        title: "C-WMD Assessor",
        mode: "Full time",
        date: "10/05/2026",
        family: "Life Sciences",
        link: "https://careers.mitre.org/us/en/job/R117089/C-WMD-Assessor",
        summary: "We are seeking a C-WMD Assessor to design and evaluate nonproliferation capacity-building programs, supporting national security and treaty compliance. The role involves developing assessment objectives, analyzing data, and preparing reports. Ideal candidates have significant experience in biological threat reduction and international security cooperation.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            119500,
            149500,
            179500
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Technical Project Leader",
        mode: "Full time",
        date: "10/08/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117742/Technical-Project-Leader",
        summary: "Join us as a Technical Project Leader to drive execution and management of SI-related projects at the National Cybersecurity Federally Funded Research and Development Center. Lead a diverse team, manage sponsor engagement, and deliver innovative R&D solutions. Ideal for experienced SI technologists with strong project management and leadership skills.",
        locations: [
            "Gaithersburg ",
            "McLean "
        ],
        salary: [
            191200,
            239000,
            286800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Communications Engineering Intern",
        mode: "Full time",
        date: "10/08/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117638/Communications-Engineering-Intern",
        summary: "We are looking for a Communications Engineering Intern to support the design, analysis, and testing of RF and communications systems. Contribute to laboratory work, develop software tools, and collaborate with cross-functional teams. Ideal for students in electrical or computer engineering with strong technical and communication skills.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Intermediate AI Solutions Architect",
        mode: "Full time",
        date: "10/07/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117732/Intermediate-AI-Solutions-Architect",
        summary: "We are expanding our team: As an Intermediate AI Solutions Architect, you will develop and integrate AI-enabled applications and workflows for mission users, supporting secure and repeatable use of AI solutions. Ideal candidates have experience in applied AI, ML workflows, and technical problem-solving within secure environments.",
        locations: [
            "San Diego ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            97600,
            122000,
            146400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 0)"
    },
    {
        title: "Applied Operations Research",
        mode: "Full time",
        date: "10/12/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117763/Applied-Operations-Research",
        summary: "We are expanding our team: As an Operations Research Analyst, you will apply advanced analytical and mathematical modeling to solve complex, interdisciplinary problems impacting national security and public interest. Key responsibilities include developing customized algorithms and presenting actionable insights. Ideal candidates have a background in operations research or related fields and a passion for applied analytics.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Technical Project Leader",
        mode: "Full time",
        date: "10/12/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117744/Technical-Project-Leader",
        summary: "We are looking for a Technical Project Leader to drive execution and management of cybersecurity-related projects at MITRE’s National Cybersecurity Federally Funded Research and Development Center. Lead a diverse team, manage technical programs, and build relationships with sponsors. Ideal for experienced cybersecurity professionals with strong project management skills.",
        locations: [
            "Gaithersburg ",
            "McLean "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Biosafety and Biosecurity Analyst",
        mode: "Full time",
        date: "10/12/2026",
        family: "Life Sciences",
        link: "https://careers.mitre.org/us/en/job/R117779/Biosafety-and-Biosecurity-Analyst",
        summary: "Become part of our team as a Biosafety and Biosecurity Analyst, contributing to multidisciplinary scientific reviews and supporting research oversight committees. You will evaluate and synthesize scientific information, coordinate review activities, and communicate complex findings. Ideal candidates have experience in biosafety, biosecurity, or infectious disease research.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            92800,
            116000,
            139200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Principal C5ISRT Operations and Policy",
        mode: "Full time",
        date: "08/28/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117362/Principal-C5ISRT-Operations-and-Policy",
        summary: "Become part of our team as a Principal C5ISRT Operations and Policy, where you will serve as an operational subject-matter expert and strategic leader for MITRE’s C5ISRT mission. Drive technology solutions, collaborate with government officials, and shape operational effectiveness. Ideal for experienced professionals with a strong background in C5ISRT operations and leadership.",
        locations: [
            "McLean ",
            "See Sponsor City "
        ],
        salary: [
            161600,
            202000,
            242400
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "NORAD & USNORTHCOM Task Lead",
        mode: "Full time",
        date: "10/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117751/NORAD-USNORTHCOM-Task-Lead",
        summary: "We are seeking a leader to drive the NORAD & USNORTHCOM work program, integrating multidisciplinary teams and strengthening sponsor relationships. The role focuses on project execution, mission analysis, and technical integration. Ideal for experienced professionals with a background in government mission leadership and systems engineering.",
        locations: [
            "Colorado Springs, Colorado, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Communications Network Engineering Intern",
        mode: "Full time",
        date: "10/14/2026",
        family: "[\"Student\",\"Electrical Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117790/Communications-Network-Engineering-Intern",
        summary: "Take on the role of Communications Network Engineering Intern, contributing to the design and implementation of advanced network solutions. Collaborate with experienced engineers on network architecture and service management projects. Ideal for students with foundational network or software development knowledge seeking hands-on experience in a mission-driven environment.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Lead Fires Systems Engineer (Joint and Services Center)",
        mode: "Full time",
        date: "10/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117746/Lead-Fires-Systems-Engineer-Joint-and-Services-Center",
        summary: "We are currently hiring a Lead Fires Systems Engineer to provide critical support for Integrated Joint Fires Center initiatives. Drive systems engineering development and collaboration with US Indo-Pacific Command, focusing on non-kinetic effects and operational capability. Ideal for experienced engineers with expertise in Department of Defense fires and system-of-systems integration.",
        locations: [
            "Honolulu, Hawaii, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Senior Platform Engineer (Windows / Infrastructure)",
        mode: "Full time",
        date: "10/13/2026",
        family: "IT Systems",
        link: "https://careers.mitre.org/us/en/job/R117752/Senior-Platform-Engineer-Windows-Infrastructure",
        summary: "We are looking for a Senior Platform Engineer to deliver secure, compliant infrastructure for mission-critical workloads. You will support customer onboarding and solution delivery, acting as a technical liaison between customers and engineering teams. Ideal candidates bring strong Windows systems engineering experience and a proactive, customer-focused approach.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            122400,
            153000,
            183600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 0)"
    },
    {
        title: "Integrated Intelligence Enterprise Systems Engineer (Intelligence Center)",
        mode: "Full time",
        date: "09/18/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117021/Integrated-Intelligence-Enterprise-Systems-Engineer-Intelligence-Center",
        summary: "Take on the role of Integrated Intelligence Enterprise Systems Engineer to drive innovative solutions for national security and intelligence operations. Lead or support data architecture activities, translating mission needs into robust data models and governance. Ideal for experienced professionals with a strong technical background and a commitment to integrity and security.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Biosafety and Biosecurity Analyst",
        mode: "Full time",
        date: "10/12/2026",
        family: "Life Sciences",
        link: "https://careers.mitre.org/us/en/job/R117778/Biosafety-and-Biosecurity-Analyst",
        summary: "Join our team as a Biosafety and Biosecurity Analyst, contributing to multidisciplinary scientific reviews of life sciences research with potential biosafety, biosecurity, or public health implications. Support risk assessments and collaborate with technical teams. Ideal for candidates with strong biosafety expertise and experience in life sciences research.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            119500,
            149500,
            179500
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Embedded Security Intern - Electronics Prototype",
        mode: "Full time",
        date: "08/31/2026",
        family: "[\"Student\",\"Microelectronics Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117380/Embedded-Security-Intern-Electronics-Prototype",
        summary: "We are looking for an Embedded Security Intern to support advanced research and development projects in embedded systems and security. Contribute to hands-on development, security assessments, and prototype creation. Ideal for students in engineering or computer science with experience in embedded systems and programming.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Lead Mission Solutions Architect",
        mode: "Full time",
        date: "10/15/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117808/Lead-Mission-Solutions-Architect",
        summary: "Exciting opportunity for a Lead Mission Solutions Architect to drive complex solution-architecture engagements, guiding multidisciplinary teams and shaping mission-centric architectures. Lead customer and mission engagements, develop strategies, and translate requirements into actionable delivery paths. Ideal for experienced professionals with a strong background in solution architecture and technical leadership.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead AI Solutions Architect",
        mode: "Full time",
        date: "10/15/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117809/Lead-AI-Solutions-Architect",
        summary: "Join us as a Lead AI Solutions Architect to provide technical direction for complex, mission-critical AI platforms and workflows. Lead solution architecture engagements, guide multidisciplinary teams, and drive the adoption of secure, repeatable AI solutions. Ideal for experienced professionals with a strong background in AI, software engineering, and technical leadership.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Data Science and Engineering Intern",
        mode: "Full time",
        date: "10/16/2026",
        family: "[\"Data Science and Analytics\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117661/Data-Science-and-Engineering-Intern",
        summary: "Become part of our team as a Data Science and Engineering Intern, contributing to impactful national security and applied research. Apply your expertise in data science, engineering, and machine learning to solve critical challenges. Ideal for students with strong programming skills and a passion for innovation in data-driven environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Senior AI Solutions Architect",
        mode: "Full time",
        date: "10/15/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117813/Senior-AI-Solutions-Architect",
        summary: "We are looking for a Senior AI Solutions Architect to design and deliver usable AI tools and workflows, supporting mission teams in secure, repeatable AI use. You will translate technical needs into solutions and collaborate across teams. Ideal candidates have significant experience in AI/ML workflows and a strong background in applied AI.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "IC Full Stack Engineer",
        mode: "Full time",
        date: "10/16/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117820/IC-Full-Stack-Engineer",
        summary: "We are currently hiring an IC Full Stack Engineer to lead secure, mission-driven application development for high-priority Intelligence Community initiatives. You will design and deploy full stack solutions, oversee secure data integration, and mentor junior engineers. Ideal candidates bring significant experience in secure environments and expertise in front-end and back-end technologies.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Principal Systems Engineer",
        mode: "Full time",
        date: "10/12/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117697/Principal-Systems-Engineer",
        summary: "Seeking an accomplished Principal Systems Engineer to lead and shape efforts in test and evaluation (T&E) for government support. Drive innovative solutions in national security, intelligence, and healthcare, collaborating with key stakeholders. Ideal for experienced professionals with strong systems engineering expertise and a background in complex, mission-driven environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Data Science and Analytics, Lead",
        mode: "Full time",
        date: "08/28/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117308/Data-Science-and-Analytics-Lead",
        summary: "Seeking a Lead Data Science and Analytics professional to drive innovative enterprise solutions for complex VA and DHA initiatives. Lead multidisciplinary teams, engage with senior government stakeholders, and deliver actionable recommendations. Ideal for experienced technical experts with a background in data analytics and federal government projects.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Cyber Operations Engineer Intern",
        mode: "Full time",
        date: "10/16/2026",
        family: "[\"Student\",\"Cyber Security\"]",
        link: "https://careers.mitre.org/us/en/job/R117737/Cyber-Operations-Engineer-Intern",
        summary: "Become part of our team as a Cyber Operations Engineer Intern, supporting full-spectrum cyber operations and threat analysis. Contribute to adversary emulation, digital investigations, and defensive cyber solutions. Ideal for students in Computer Science, Cybersecurity, or related fields with a strong technical background and a passion for national security.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Program Analysis and Transformation, Senior",
        mode: "Full time",
        date: "09/11/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117398/Program-Analysis-and-Transformation-Senior",
        summary: "Become part of our team as a Senior Program Analyst, where you will conduct complex program, policy, and organizational analyses for Department of Veterans Affairs and Defense Health Agency initiatives. Drive strategic recommendations and collaborate with cross-functional teams. Ideal for experienced professionals with a background in program analysis and transformation.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Space Systems Engineer (Intelligence Center)",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116939/Space-Systems-Engineer-Intelligence-Center",
        summary: "Become part of our team as a Space Systems Engineer, contributing to the development and analysis of next-generation space systems. Lead technical projects, advise on modeling methods, and support integration across multiple levels. Ideal for experienced engineers with expertise in MBSE and space systems engineering.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "IC Full Stack Engineer",
        mode: "Full time",
        date: "10/16/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117821/IC-Full-Stack-Engineer",
        summary: "Join our team as a Lead Full Stack Engineer, driving secure and mission-driven application development for high-priority Intelligence Community initiatives. Lead the design and deployment of scalable systems, oversee secure data integration, and mentor junior engineers. Ideal for experienced professionals with expertise in secure, cloud-based environments and a strong background in full stack development.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            156800,
            196000,
            235200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Publications Coordinator",
        mode: "Full time",
        date: "10/05/2026",
        family: "External Communications",
        link: "https://careers.mitre.org/us/en/job/R117512/Senior-Publications-Coordinator",
        summary: "We are currently hiring a Senior Publications Coordinator to support the external outreach strategy and execution for projects within the National Cybersecurity Federally Funded Research and Development Center. Key responsibilities include coordinating publication materials and stakeholder engagement. Ideal candidates will have significant experience in communications and a strong understanding of technical or mission-focused content.",
        locations: [
            "Gaithersburg, Maryland, United States of America"
        ],
        salary: [
            99200,
            124000,
            148800
        ],
        clearance_current: "None",
        clearance_1y: "Other",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Principal RF/Antenna Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117102/Principal-RF-Antenna-Engineer",
        summary: "We are looking for a Principal RF/Antenna Engineer to lead technical research and test activities supporting national security and advanced communications. You will coordinate spectrum sharing tests, advise on system integration, and serve as a key liaison for federal agencies. Ideal candidates bring extensive RF expertise and hands-on experience in wireless systems engineering.",
        locations: [
            "Boulder, Colorado, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior Systems Engineer; Support to the Intelligence Community",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116840/Senior-Systems-Engineer;-Support-to-the-Intelligence-Community",
        summary: "Exciting opportunity for a Senior Systems Engineer to support national security missions by designing and integrating complex mission systems. Lead system architecture, requirements development, and technical transition activities. Ideal for candidates with significant experience in systems engineering and a strong background in mission-focused environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Autonomous Systems Intern",
        mode: "Full time",
        date: "10/19/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117720/Autonomous-Systems-Intern",
        summary: "We are looking for an Autonomous Systems Intern to collaborate with engineers and researchers on AI and autonomous system projects. Support the development of advanced robotics and artificial intelligence solutions. Ideal for students with foundational knowledge in robotics or autonomous systems and a strong academic record.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Lead Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116761/Lead-Systems-Engineer",
        summary: "We are recruiting a Lead Systems Engineer to drive mission architecture and system-of-systems solutions for Army sponsors. Lead multidisciplinary engineering teams, develop technical products, and deliver data-driven recommendations. Ideal for experienced engineers with expertise in systems engineering and a background in mission or operational analysis.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Senior Wireless Security Engineer",
        mode: "Full time",
        date: "09/22/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116392/Senior-Wireless-Security-Engineer",
        summary: "We are looking for a Senior Wireless Security Engineer to advance research and development in embedded wireless systems. You will design and assess wireless technologies, develop secure software, and collaborate with multidisciplinary teams. Ideal candidates bring significant experience in wireless security and embedded systems.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead Systems Engineer; support to the Intelligence Community",
        mode: "Full time",
        date: "10/08/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116842/Lead-Systems-Engineer;-support-to-the-Intelligence-Community",
        summary: "We are seeking a Lead Systems Engineer to drive the design and integration of complex mission systems for national security. You will apply systems engineering principles and collaborate with multidisciplinary teams to deliver mission-critical solutions. Ideal candidates bring significant experience in systems engineering and a strong background in technical and operational environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Systems Engineer",
        mode: "Full time",
        date: "09/18/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117241/Senior-Systems-Engineer",
        summary: "We are recruiting a Senior Systems Engineer to deliver innovative, mission-focused solutions for national security and government programs. You will define, design, and integrate complex systems, collaborating across technical and operational teams. Ideal candidates bring significant experience in systems engineering and a strong ability to translate stakeholder needs into actionable engineering solutions.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 0)"
    },
    {
        title: "Senior RF Engineer",
        mode: "Full time",
        date: "10/19/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117841/Senior-RF-Engineer",
        summary: "Exciting opportunity for a Senior RF Engineer to analyze and design radio frequency and satellite communication antenna systems for national security missions. Key responsibilities include modeling and simulation of antenna performance and developing digital engineering architectures. Ideal for candidates with strong expertise in antenna theory and experience in Satcom systems.",
        locations: [
            "Wright-Patterson AFB - Fairborn, Ohio, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Trustworthy AI Intern",
        mode: "Full time",
        date: "10/20/2026",
        family: "[\"Artificial Intelligence\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117833/Trustworthy-AI-Intern",
        summary: "Take on the role of Trustworthy AI Intern, contributing to the development and implementation of secure AI solutions for public sector missions. Collaborate with cross-functional teams to analyze AI use cases and recommend trustworthy solutions. Ideal for candidates with foundational AI/ML knowledge and a passion for advancing secure AI systems.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            51000,
            64000,
            77000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "true"
    },
    {
        title: "Associate Sensor Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117120/Associate-Sensor-Engineer",
        summary: "Join our team as a Associate Sensor Engineer, contributing to innovative solutions in sensing and antenna technologies. Drive development and evaluation of sensor and antenna systems, utilizing programming skills in MATLAB or Python. Ideal for candidates with a bachelor’s degree in maths, physics, or engineering and strong technical expertise.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "High Performance Computing Program Manager",
        mode: "Full time",
        date: "10/20/2026",
        family: "Program and Project Management",
        link: "https://careers.mitre.org/us/en/job/R117831/High-Performance-Computing-Program-Manager",
        summary: "We are looking for a High Performance Computing Program Manager to lead the Federal AI Sandbox program, overseeing planning, execution, and stakeholder coordination. The role requires significant experience in managing complex technical programs and is ideal for candidates with a strong background in program management within federal or government environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            151500,
            189500,
            227500
        ],
        clearance_current: "Secret",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Mission Systems Engineer, Senior",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R116891/Mission-Systems-Engineer-Senior",
        summary: "We are currently hiring a Senior Mission Systems Engineer to support mission engineering and system analysis for complex operational missions. You will define mission elements, develop analytical metrics, and deliver actionable recommendations. Ideal candidates have significant experience in systems engineering or modeling and simulation within defense or mission-critical domains.",
        locations: [
            "Colorado Springs ",
            "Tampa ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "degree >= 1 && experience >= 5"
    },
    {
        title: "Senior Hardware Security Engineer",
        mode: "Full time",
        date: "09/16/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117533/Senior-Hardware-Security-Engineer",
        summary: "Take on the role of Senior Hardware Security Engineer, focusing on embedded systems and advanced security research. Lead hands-on assessments, develop proof-of-concepts, and collaborate with multidisciplinary teams. Ideal for experienced engineers with expertise in hardware reverse engineering and vulnerability research.",
        locations: [
            "Albuquerque, New Mexico, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Associate Systems Engineer",
        mode: "Full time",
        date: "09/10/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117465/Associate-Systems-Engineer",
        summary: "We are looking for an Associate Systems Engineer to support the design, implementation, and integration of enterprise systems for federal agencies. You will apply advanced systems engineering methods and tools to assess and develop architectures. Ideal candidates have a background in engineering or related fields and a strong interest in complex, multi-disciplinary problems.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            77600,
            97000,
            116400
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "degree >= 1"
    },
    {
        title: "Senior Underwater Sensors Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117132/Senior-Underwater-Sensors-Engineer",
        summary: "We are expanding our team: As a Senior Underwater Sensors Engineer, you will design and develop signal processing algorithms for underwater sensing and acoustic communication systems, and contribute to research and development in support of national maritime defense. Ideal candidates bring strong technical expertise and leadership in acoustic, radar, or sonar signal processing.",
        locations: [
            "San Diego, California, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 0)"
    },
    {
        title: "Principal Space Systems Engineer",
        mode: "Full time",
        date: "09/03/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117429/Principal-Space-Systems-Engineer",
        summary: "Seeking a Principal Space Systems Engineer to provide senior technical authority and strategic guidance for complex national security space missions. Lead multidisciplinary initiatives, shape mission architecture, and resolve integration challenges. Ideal for experienced professionals with deep technical expertise in space systems engineering and a strong background in systems of systems architecture.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "Albuquerque "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Intermediate Sensor Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R115749/Intermediate-Sensor-Engineer",
        summary: "We are expanding our team: As an Intermediate Sensor Engineer, you will design and develop innovative sensor solutions, focusing on advanced signal processing and algorithm development. You will contribute to both fielded and developmental systems, leveraging your technical expertise in sensor technologies. Ideal candidates bring strong programming skills and experience in sensor design.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || degree >= 2"
    },
    {
        title: "Operational Technology Cyber Threat Intelligence, Lead",
        mode: "Full time",
        date: "09/11/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117474/Operational-Technology-Cyber-Threat-Intelligence-Lead",
        summary: "Join our team as an Operational Technology Cyber Threat Intelligence Lead, where you will analyze real-world adversary behaviors and translate threat intelligence into actionable technical requirements. You will support automated adversary emulation and collaborate with engineering teams. Ideal candidates bring significant experience in OT threat analysis and industrial control systems.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Principal Systems Engineer",
        mode: "Full time",
        date: "09/29/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117617/Principal-Systems-Engineer",
        summary: "Join our team as a Principal Systems Engineer, leading the application of advanced systems engineering and architecture analysis to support national security missions. Drive the development of integrated digital solutions and collaborate with stakeholders to deliver impactful engineering outcomes. Ideal for experienced professionals with strong expertise in systems engineering and architecture.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Computer and Data Science Intern",
        mode: "Full time",
        date: "09/22/2026",
        family: "[\"Data Science and Analytics\",\"Microelectronics Engineering\",\"Computational Social Science\",\"Artificial Intelligence\",\"Student\",\"Human Systems Integration\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117565/Computer-and-Data-Science-Intern",
        summary: "We are looking for a Computer and Data Science Intern to support complex technical and operational challenges at MITRE. Contribute to software development, data analysis, and AI/ML research. Ideal for students with strong academic performance and a passion for applied science.",
        locations: [
            "Bellevue ",
            "Colorado Springs "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "is_student === true"
    },
    {
        title: "Senior FPGA or ASIC Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116651/Senior-FPGA-or-ASIC-Engineer",
        summary: "Take on the role of Senior FPGA or ASIC Engineer, contributing to advanced research and development projects with a focus on embedded hardware platforms. Collaborate with cross-disciplinary teams to design and implement proof-of-concept prototype systems. Ideal for candidates with significant FPGA or ASIC experience and a strong foundation in programming and RTL languages.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "OT Adversary Emulation Strategy and Execution, Lead",
        mode: "Full time",
        date: "09/11/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117475/OT-Adversary-Emulation-Strategy-and-Execution-Lead",
        summary: "Take on the role of OT Adversary Emulation Strategy and Execution Lead, driving the technical vision and adoption of Caldera for OT. Lead a team to translate threat intelligence into protocol-level emulation, manage sponsor relationships, and oversee project delivery. Ideal for experienced professionals with strong OT expertise and strategic leadership skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Intelligence Engineer",
        mode: "Full time",
        date: "10/19/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117843/Senior-Intelligence-Engineer",
        summary: "Join our team as a Senior Intelligence Engineer, where you will analyze intelligence sources to inform strategic planning and policy development. You will develop engineering assessments and strategies for national security, leveraging your expertise in intelligence analysis and operational knowledge. Ideal candidates bring significant experience in technical leadership and a strong understanding of national security frameworks.",
        locations: [
            "Wright-Patterson AFB - Fairborn, Ohio, United States of America"
        ],
        salary: [
            116400,
            145500,
            174600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Critical Infrastructure Systems Security and Resilience Analyst",
        mode: "Full time",
        date: "09/11/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117473/Critical-Infrastructure-Systems-Security-and-Resilience-Analyst",
        summary: "We are seeking a Critical Infrastructure Systems Security and Resilience Analyst to advance national security by applying intelligence expertise and leading technical research to protect critical infrastructure. The role involves threat analysis, risk assessments, and collaboration with internal and external stakeholders. Ideal candidates have significant experience in cyber or signals intelligence and strong leadership skills.",
        locations: [
            "Fort Meade - Annapolis Junction ",
            "McLean "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Associate Systems Engineer",
        mode: "Full time",
        date: "09/10/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117469/Associate-Systems-Engineer",
        summary: "Join us as an Associate Systems Engineer to advance and apply innovative systems engineering techniques in solving critical national challenges. Support the analysis, design, and integration of enterprise systems, leveraging expertise in analytics and systems engineering. Ideal for candidates with a strong engineering background and a passion for technical problem-solving.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            77600,
            97000,
            116400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Systems Engineer",
        mode: "Full time",
        date: "09/14/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117485/Systems-Engineer",
        summary: "We are looking for a Senior Systems Engineer to drive the design, implementation, and integration of enterprise systems supporting federal agencies. Utilize your expertise in systems engineering and modern tools to assess requirements and architecture. Ideal for candidates with significant experience in systems engineering and a strong technical background.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Associate Systems Engineer",
        mode: "Full time",
        date: "10/19/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117823/Associate-Systems-Engineer",
        summary: "We are looking for an Associate Systems Engineer to support government sponsors in architecting and integrating complex mission and enterprise systems. You will apply Model-Based Systems Engineering and digital engineering methods, collaborating with stakeholders to deliver informed solutions. Ideal candidates have experience in systems engineering and a strong interest in innovation and technical leadership.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            77600,
            97000,
            116400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 0) || experience >= 1"
    },
    {
        title: "Senior Systems Engineer",
        mode: "Full time",
        date: "09/17/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117059/Senior-Systems-Engineer",
        summary: "We are expanding our team: As a Senior Systems Engineer, you will lead the application of advanced systems engineering and architecture analysis to support complex national security missions. Drive digital transformation by developing integrated solutions and collaborating with stakeholders. Ideal for experienced professionals with expertise in systems engineering and architecture.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead FPGA Design Engineer",
        mode: "Full time",
        date: "08/31/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117336/Lead-FPGA-Design-Engineer",
        summary: "We are expanding our team: As a Lead FPGA Design Engineer, you will architect and develop advanced FPGA and SoC solutions, leading custom hardware prototypes and collaborating on national security projects. Ideal candidates bring significant experience in RTL design and embedded systems, with a strong background in semiconductor technologies.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Senior Embedded Security Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116763/Senior-Embedded-Security-Engineer",
        summary: "We are seeking a Senior Embedded Security Engineer to advance embedded system security through hands-on research and prototype development. You will design and assess hardware and software for embedded systems, collaborating with technical experts. Ideal candidates bring significant experience in embedded security and a strong background in hardware analysis.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Lead Sensor Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116741/Lead-Sensor-Engineer",
        summary: "Join us as a Lead Sensor Engineer to drive innovative solutions in sensor technologies and signal processing. Lead the development and evaluation of sensor systems, collaborating with a multidisciplinary team. Ideal for experienced engineers with strong technical expertise in sensor design and programming.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || degree >= 2"
    },
    {
        title: "Systems Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117637/Systems-Engineer",
        summary: "Exciting opportunity for a Systems Engineer to lead end-to-end systems engineering and architectural integration for the DISA PAE Mission Network Transport portfolio. Drive holistic integration across transport, edge compute, and cybersecurity domains, supporting senior military leadership. Ideal for experienced professionals with a strong background in systems engineering and national security.",
        locations: [
            "Fort Meade - Annapolis Junction, Maryland, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Senior Embedded Software Security Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116744/Senior-Embedded-Software-Security-Engineer",
        summary: "We are looking for a Senior Embedded Software Security Engineer to develop and secure next-generation embedded systems supporting national security missions. You will design secure software architectures and implement trusted computing technologies. Ideal candidates have significant embedded software experience and expertise in secure boot and cryptographic integration.",
        locations: [
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Systems Engineering Intern",
        mode: "Full time",
        date: "09/28/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117634/Systems-Engineering-Intern",
        summary: "Become part of our team as a Systems Engineering Intern, contributing to mission-focused engineering solutions that support national security and public sector missions. Engage in system design and integration, collaborating with multidisciplinary teams. Ideal for students in engineering or related fields with strong technical and analytical skills.",
        locations: [
            "Colorado Springs ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Systems Engineer Intern",
        mode: "Full time",
        date: "09/28/2026",
        family: "[\"Systems Engineering\",\"Physics\",\"Student\",\"Aerospace, Space and Defense Engineering\",\"Mechanical Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117610/Systems-Engineer-Intern",
        summary: "Join our team as a Systems Engineer Intern, supporting complex government-sponsored systems and collaborating with multidisciplinary teams. Contribute to system analysis, modeling, and evaluation using modern engineering methods. Ideal for students in engineering or related fields with technical computing skills and a commitment to integrity and innovation.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "Systems Engineer Intern",
        mode: "Full time",
        date: "09/28/2026",
        family: "[\"Systems Engineering\",\"Physics\",\"Student\",\"Aerospace, Space and Defense Engineering\",\"Mechanical Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117612/Systems-Engineer-Intern",
        summary: "We are currently hiring a Systems Engineer Intern to support mission engineering, requirements engineering, and enterprise systems initiatives. Contribute to solution design and integration, and collaborate with multidisciplinary teams. Ideal for students in engineering or related fields with strong communication skills and a commitment to technical excellence.",
        locations: [
            "Bedford ",
            "Huntsville ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "National and Defense Intelligence Intern",
        mode: "Full time",
        date: "10/21/2026",
        family: "[\"Student\",\"Intel Strategy and Policy\"]",
        link: "https://careers.mitre.org/us/en/job/R117860/National-and-Defense-Intelligence-Intern",
        summary: "We are expanding our team: As a National and Defense Intelligence Intern, you will contribute to impactful projects supporting the U.S. Intelligence Community. Engage in technical research, analytical modeling, and collaboration with government sponsors. Ideal for upperclassmen or graduate students with strong academic performance and an interest in national security.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "is_student === true"
    },
    {
        title: "Associate Program Finance Analyst",
        mode: "Full time",
        date: "10/21/2026",
        family: "Financial Planning & Analysis",
        link: "https://careers.mitre.org/us/en/job/R117658/Associate-Program-Finance-Analyst",
        summary: "Seeking an Associate Program Finance Analyst to support financial management and reporting within a collaborative, mission-driven environment. Key responsibilities include producing financial deliverables and supporting project financial operations. Ideal for candidates with strong analytical skills and a commitment to continuous improvement.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            59600,
            74500,
            89400
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "degree >= 1 && experience < 1"
    },
    {
        title: "Research Associate",
        mode: "Full time",
        date: "10/21/2026",
        family: "Market Research",
        link: "https://careers.mitre.org/us/en/job/R117659/Research-Associate",
        summary: "Take on the role of a Research Associate supporting MITRE’s Market Intelligence & Research team. Conduct secondary research, analyze information from diverse sources, and synthesize findings for internal clients. Ideal for candidates with research experience and strong organizational skills, seeking to contribute to impactful national security and public interest initiatives.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            62500,
            78000,
            93500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 1)"
    },
    {
        title: "Associate Wireless Security Engineer",
        mode: "Full time",
        date: "10/08/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116389/Associate-Wireless-Security-Engineer",
        summary: "Exciting opportunity for an Associate Wireless Security Engineer to contribute to advanced research and development in wireless systems. Key responsibilities include developing countermeasures for emerging security threats and designing prototypes. Ideal for candidates with a technical background in embedded security and hands-on experience in wireless technologies.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1 && experience < 1"
    },
    {
        title: "Systems Engineer Intern",
        mode: "Full time",
        date: "09/28/2026",
        family: "[\"Systems Engineering\",\"Physics\",\"Student\",\"Aerospace, Space and Defense Engineering\",\"Mechanical Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117611/Systems-Engineer-Intern",
        summary: "We are seeking a Systems Engineer Intern to support complex government-sponsored systems and contribute to digital transformation initiatives. You will assist with system analysis, modeling, and evaluation, collaborating with multidisciplinary teams. Ideal for students in engineering or related fields with technical computing skills and a commitment to integrity and innovation.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "Systems Engineering Intern",
        mode: "Full time",
        date: "09/30/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117680/Systems-Engineering-Intern",
        summary: "Become part of our team as a Systems Engineering Intern, contributing to the development and application of new technologies to address complex government systems challenges. Engage in architecture modeling and system integration, applying your engineering knowledge. Ideal for students in relevant engineering fields with a passion for innovation and technical problem-solving.",
        locations: [
            "San Diego ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Organizational Science Graduate Intern",
        mode: "Part time",
        date: "10/22/2026",
        family: "Social, Behavioral, and Brain Sciences",
        link: "https://careers.mitre.org/us/en/job/R117736/Organizational-Science-Graduate-Intern",
        summary: "We are looking for an Organizational Science Graduate Intern to support research and development projects across federal civilian, defense, homeland security, healthcare, and intelligence missions. You will conduct qualitative and quantitative research, analyze data, and contribute to operational performance evaluation. Ideal for doctoral students in organizational psychology or related fields with strong research skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            80800,
            101000,
            121200
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true && degree >= 1"
    },
    {
        title: "AEHF Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116941/AEHF-Communications-Engineer",
        summary: "We are looking for a Communications Engineer to lead the specification, integration, and testing of next-generation AEHF Military Satellite Communications systems. Drive systems engineering analysis and risk mitigation, collaborating across disciplines. Ideal for experienced professionals with strong technical expertise in satellite communications and a proactive, innovative approach.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Deputy Project Lead, OSW R&E C5ISRT Technologies",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117322/Deputy-Project-Lead-OSW-R-E-C5ISRT-Technologies",
        summary: "Join our team as a Deputy Project Lead, OSW R&E C5ISRT Technologies, where you will oversee a growing work program focused on advancing technology solutions for the Department of War’s C5ISRT mission. Lead strategic initiatives, collaborate with government sponsors, and drive impactful deliverables. Ideal for experienced professionals with a strong background in C5ISRT-related technology and leadership.",
        locations: [
            "McLean ",
            "See Sponsor City "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "AEHF Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116930/AEHF-Communications-Engineer",
        summary: "We are looking for a Communications Systems Engineer to lead the specification, integration, and testing of next-generation AEHF Military Satellite Communications systems. You will analyze requirements, develop trade studies, and collaborate across engineering disciplines. Ideal candidates have significant experience in military satellite communications and strong systems engineering skills.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "C2/Fire Control Principal Engineer",
        mode: "Full time",
        date: "10/22/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117867/C2-Fire-Control-Principal-Engineer",
        summary: "We are looking for a Principal Engineer to lead the development and assessment of Ground-based Midcourse Defense systems, focusing on fire control algorithms and capability gap analysis. This role requires significant experience in missile defense, strong technical expertise, and the ability to collaborate across diverse teams. Ideal for candidates with advanced degrees and extensive expertise in systems engineering.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Principal SIGINT Ground Systems Engineer",
        mode: "Full time",
        date: "10/22/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117861/Principal-SIGINT-Ground-Systems-Engineer",
        summary: "Exciting opportunity for a Principal SIGINT Ground Systems Engineer to drive innovative solutions and lead system design for national security missions. Lead technical and operational stakeholders, translate mission needs into system concepts, and provide expert guidance. Ideal for experienced engineers with a strong technical background and expertise in space systems and intelligence operations.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Systems Engineer",
        mode: "Full time",
        date: "10/26/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117893/Systems-Engineer",
        summary: "We are seeking a Senior Systems Engineer to deliver mission-focused solutions within the Systems and Operations Department. You will analyze and develop system requirements, lead validation strategies, and collaborate with operational users. Ideal candidates bring significant experience in aerospace or systems engineering and a strong understanding of electronic warfare systems.",
        locations: [
            "Hanscom Air Force Base, Massachusetts, United States of America"
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree >= 3"
    },
    {
        title: "Enterprise & Tactical Networking Intern",
        mode: "Full time",
        date: "09/10/2026",
        family: "[\"Student\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117445/Enterprise-Tactical-Networking-Intern",
        summary: "Take on the role of an Enterprise & Tactical Networking Intern, contributing to mission-driven projects in network architecture, software-defined networks, and data analytics. Collaborate with experienced engineers and researchers, applying your analytical skills to develop innovative solutions. Ideal for students in relevant engineering or technology fields seeking hands-on experience in a collaborative environment.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Lead Data Scientist",
        mode: "Full time",
        date: "10/26/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117193/Lead-Data-Scientist",
        summary: "Exciting opportunity for a Lead Data Scientist to drive advanced analytics and business intelligence within MITRE’s Acquisition Affordability and Business Analytics Department. Lead complex data analysis, develop analytic tools, and deliver actionable insights for government sponsors. Ideal for experienced professionals with strong analytical skills and expertise in data science and programming.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Internships in Generative and Agentic AI",
        mode: "Full time",
        date: "10/27/2026",
        family: "[\"Artificial Intelligence\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117796/Internships-in-Generative-and-Agentic-AI",
        summary: "We are looking for motivated interns to join our Generative and Agentic AI Engineering team, contributing to research, development, and deployment of advanced AI solutions. You will work on natural language processing and machine learning projects, ideal for students with programming experience and a strong academic record.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "AI Solutions Architect Intern",
        mode: "Full time",
        date: "10/07/2026",
        family: "[\"Student\",\"Artificial Intelligence\"]",
        link: "https://careers.mitre.org/us/en/job/R117733/AI-Solutions-Architect-Intern",
        summary: "We are currently hiring an AI Solutions Architect Intern to support mission teams in adopting AI tools and platforms. You will participate in hands-on experimentation, documentation, and collaboration with technical mentors. Ideal for students pursuing a relevant technical degree with programming skills and an interest in applied AI.",
        locations: [
            "San Diego ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "Administrative Assistant, Senior",
        mode: "Full time",
        date: "10/27/2026",
        family: "Administrative Assistance",
        link: "https://careers.mitre.org/us/en/job/R117905/Administrative-Assistant-Senior",
        summary: "Join us as an Administrative Assistant, Senior, where you will manage departmental calendars, coordinate meetings, and support administrative operations. This role requires strong organizational skills and experience with calendar management. Ideal for candidates with at least 3 years’ relevant experience and a high school diploma or equivalent.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            62000,
            77500,
            93000
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 0 && experience >= 3)"
    },
    {
        title: "Intel Policy, Strategy, and Analyst",
        mode: "Full time",
        date: "10/27/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117909/Intel-Policy-Strategy-and-Analyst",
        summary: "Become part of our team as an Intel Policy, Strategy, and Analyst, contributing to the development and delivery of impactful intelligence solutions. Support modernizing intelligence tools and analytical models, and collaborate with teams to address sponsor challenges. Ideal for candidates with technical expertise and a strong interest in national security policy.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            82800,
            103500,
            124200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2)"
    },
    {
        title: "TECH Futures Intern",
        mode: "Full time",
        date: "09/08/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117376/TECH-Futures-Intern",
        summary: "We are currently hiring a TECH Futures Intern to contribute to innovative solutions addressing government challenges in cybersecurity, AI, and microelectronics. Collaborate with experienced professionals, apply technical expertise, and gain hands-on experience. Ideal for students pursuing a degree in a relevant field with a strong academic record and an interest in emerging technologies.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true && degree === 0"
    },
    {
        title: "Associate Systems Engineer",
        mode: "Full time",
        date: "10/27/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117898/Associate-Systems-Engineer",
        summary: "We are expanding our team: As an Associate Systems Engineer, you will apply mission engineering and systems engineering techniques to develop and refine technical solutions for critical national challenges. Collaborate with multidisciplinary teams and support integration and deployment planning. Ideal for candidates with a bachelor’s degree and experience in systems engineering.",
        locations: [
            "Bedford ",
            "McLean ",
            "Huntsville "
        ],
        salary: [
            77600,
            97000,
            116400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && (experience >= 0 || experience < 1)"
    },
    {
        title: "Principal Acquisition Transformation Strategist",
        mode: "Full time",
        date: "10/26/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R116156/Principal-Acquisition-Transformation-Strategist",
        summary: "We are recruiting a Principal Acquisition Transformation Strategist to lead the evolution of defense acquisition processes, driving modernization and continuous capability delivery. The role involves shaping acquisition execution models and advising senior leaders. Ideal for experienced experts in defense acquisition and transformation.",
        locations: [
            "Bedford ",
            "San Antonio ",
            "McLean "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Lead Systems Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117875/Lead-Systems-Engineer",
        summary: "We are recruiting a Lead Systems Engineer to provide technical leadership in the design, implementation, and integration of enterprise systems and systems-of-systems. Drive the application of modern engineering methods and tools, and lead architecture and requirements management. Ideal for experienced systems engineers with strong technical and leadership skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Critical Infrastructure Protection Intern",
        mode: "Full time",
        date: "10/27/2026",
        family: "[\"Student\",\"Cyber Security\"]",
        link: "https://careers.mitre.org/us/en/job/R117877/Critical-Infrastructure-Protection-Intern",
        summary: "Become part of our team as a Critical Infrastructure Protection Intern, supporting the security and resilience of cyber-physical systems. Collaborate with experienced engineers to analyze critical infrastructure, develop technical solutions, and contribute to national security. Ideal for students in technical disciplines with foundational knowledge in cybersecurity or operational technology.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Cost Analyst",
        mode: "Full time",
        date: "09/21/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117331/Cost-Analyst",
        summary: "We are looking for an intermediate Cost Analyst to support critical economic and financial challenges across multiple projects. You will engage with sponsors, conduct data-driven analyses, and develop cost models. Ideal candidates have experience in cost estimation, financial analysis, and strong analytical skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            90000,
            112500,
            135000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2)"
    },
    {
        title: "Administrative Assistant, Intermediate",
        mode: "Full time",
        date: "10/27/2026",
        family: "Administrative Assistance",
        link: "https://careers.mitre.org/us/en/job/R117904/Administrative-Assistant-Intermediate",
        summary: "We are currently hiring an Administrative Assistant, Intermediate to support departmental operations and administrative tasks. Key responsibilities include managing calendars, coordinating meetings, and maintaining departmental records. Ideal candidates will have experience in administrative support and strong organizational skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            50500,
            63000,
            75500
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "experience >= 1"
    },
    {
        title: "Software Engineer",
        mode: "Full time",
        date: "09/24/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117614/Software-Engineer",
        summary: "We are recruiting a Software Engineer to design, develop, and deliver full-stack applications supporting national security and public interest initiatives. You will work on web applications, cloud integration, and AI/ML tools, collaborating with a multidisciplinary team. Ideal for early-career professionals with hands-on software development experience and a technical background.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            86000,
            107500,
            129000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 0) || (degree === 0 && is_student === true && experience >= 0)"
    },
    {
        title: "Chief Engineer, Survivable Communications and Networking Systems",
        mode: "Full time",
        date: "10/29/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117930/Chief-Engineer-Survivable-Communications-and-Networking-Systems",
        summary: "We are currently hiring a Chief Engineer to provide technical leadership for advanced communications and networking systems, supporting the future of Nuclear Command, Control, and Communications. Oversee technical integrity, drive innovation, and collaborate with key stakeholders. Ideal for experienced experts in communications or digital signal processing with a strong background in systems engineering.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            202000,
            252500,
            303000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "Wireless Communications Modeling & Simulation Intern",
        mode: "Full time",
        date: "10/28/2026",
        family: "[\"Imaging and Communication Engineering\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117896/Wireless-Communications-Modeling-Simulation-Intern",
        summary: "Join us as a Wireless Communications Modeling & Simulation Intern, supporting research on 5G/6G radio propagation and integrated sensing. Contribute to wireless simulation scenarios using Python and ns-3, and analyze modeling results. Ideal for students in engineering or related fields with foundational programming experience.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Mission Modeling and Simulation, Lead",
        mode: "Full time",
        date: "10/28/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117108/Mission-Modeling-and-Simulation-Lead",
        summary: "We are expanding our team: As a Lead Mission Modeling and Simulation Engineer, you will drive the development and analysis of complex operational missions, supporting national security and defense initiatives. You will design and validate simulation models, analyze mission scenarios, and communicate findings to stakeholders. Ideal candidates bring significant experience in mission engineering and simulation.",
        locations: [
            "Colorado Springs ",
            "Tampa ",
            "Huntsville ",
            "Fairborn ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "USPACOM Lead Experimentation Engineer",
        mode: "Full time",
        date: "10/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117774/USPACOM-Lead-Experimentation-Engineer",
        summary: "Exciting opportunity for a Lead Experimentation Engineer to drive cohesive experimentation campaigns and infrastructure for USPACOM. Lead and support multiple lines of experimentation, collaborating with stakeholders to advance operational capabilities. Ideal for candidates with strong system-of-systems engineering experience and expertise in DoD systems integration.",
        locations: [
            "Honolulu, Hawaii, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Lead Operations Research Systems Analyst",
        mode: "Full time",
        date: "10/29/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117837/Lead-Operations-Research-Systems-Analyst",
        summary: "We are seeking a Lead Operations Research Systems Analyst to drive analytical studies supporting Joint Staff J7 JWC modeling and simulation. Lead the design and execution of operational research, translate concepts into actionable models, and engage with military planners. Ideal for experienced professionals with strong quantitative and technical expertise.",
        locations: [
            "See Sponsor City, Virginia, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "IC Data Engineer",
        mode: "Full time",
        date: "09/21/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117572/IC-Data-Engineer",
        summary: "We are recruiting an IC Data Engineer to provide senior-level data engineering and enterprise data architecture expertise for national intelligence mission centers. Lead the design and modernization of enterprise data capabilities, collaborating with senior government sponsors. Ideal for experienced professionals with deep knowledge of Intelligence Community missions and advanced data engineering practices.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Enterprise Services Principal",
        mode: "Full time",
        date: "10/30/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117901/Enterprise-Services-Principal",
        summary: "We are currently hiring an Enterprise Services Principal to lead technical direction and integration within the Mission Resilience and Cyber Defense department. This role partners with senior leadership to align government priorities with industry capabilities, focusing on enterprise IT and cyber infrastructure. Ideal for a seasoned technical leader with significant experience in complex environments.",
        locations: [
            "Hanscom Air Force Base "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Pacific Regional Business Operations Manager",
        mode: "Part time",
        date: "10/30/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117890/Pacific-Regional-Business-Operations-Manager",
        summary: "Take on the role of Pacific Regional Business Operations Manager, driving workforce and resource planning to optimize operational effectiveness. Lead staffing coordination and provide data-driven recommendations to leadership. Ideal for experienced professionals with a strong background in workforce management and operational planning within complex organizations.",
        locations: [
            "Honolulu, Hawaii, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Project Leader",
        mode: "Full time",
        date: "10/30/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117922/Project-Leader",
        summary: "Exciting opportunity for a Project Leader to drive the Cyber Resiliency Office for Weapon Systems at MITRE. Lead technical strategy, oversee project execution, and collaborate with sponsors to address complex cyber challenges. Ideal for experienced professionals in system engineering or cybersecurity with strong leadership and stakeholder engagement skills.",
        locations: [
            "Bedford ",
            "Wright-Patterson AFB - Fairborn "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead Systems Engineer",
        mode: "Full time",
        date: "09/17/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117060/Lead-Systems-Engineer",
        summary: "We are seeking a Lead Systems Engineer to drive the development and evolution of complex, mission-focused systems across national security environments. Lead architecture analysis and digital engineering transformation, collaborating with stakeholders to deliver integrated solutions. Ideal for experienced professionals with strong systems engineering expertise and a commitment to technical excellence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead GPS Ground Control Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117259/Lead-GPS-Ground-Control-Systems-Engineer",
        summary: "Exciting opportunity for an experienced Lead GPS Ground Control Systems Engineer to drive the modernization of mission-critical ground control capabilities. Lead technical engagement with government sponsors, oversee software development, and support architecture evolution. Ideal for candidates with strong GPS operations expertise and a background in cloud and software engineering.",
        locations: [
            "Colorado Springs, Colorado, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Operational Technology (OT) Cybersecurity Engineer",
        mode: "Full time",
        date: "10/27/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117476/Lead-Operational-Technology-OT-Cybersecurity-Engineer",
        summary: "Become part of our team as a Lead Operational Technology (OT) Cybersecurity Engineer, driving hands-on cyber experimentation and training for national security assets. Lead the design and maintenance of cyber experimentation ranges, develop technical training, and deliver evidence-based recommendations. Ideal for experienced professionals with a strong background in OT environments and technical training.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead GPS Space Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117258/Lead-GPS-Space-Systems-Engineer",
        summary: "Join our team as a Lead GPS Space Systems Engineer, where you will serve as the technical lead for the Space Systems Command PNT program, focusing on GPS operations and space vehicle management. This role requires significant experience in GPS space vehicles and systems engineering, ideal for candidates with a strong technical background and on-site expertise.",
        locations: [
            "Colorado Springs, Colorado, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "HRIS Strategy & Transformation Manager",
        mode: "Full time",
        date: "10/28/2026",
        family: "HR Operations",
        link: "https://careers.mitre.org/us/en/job/R117123/HRIS-Strategy-Transformation-Manager",
        summary: "Seeking an experienced HRIS Strategy & Transformation Manager to drive the development and management of HR technology strategies and roadmaps. Lead portfolio evaluation, governance, and technology investments, partnering with HR and IT leaders. Ideal for candidates with extensive HR technology expertise and a strong background in HR transformation within complex organizations.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            132000,
            165000,
            198000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Human Centered Engineer Intern /User Experience Engineer Intern",
        mode: "Full time",
        date: "10/22/2026",
        family: "[\"Microelectronics Engineering\",\"Computational Social Science\",\"Artificial Intelligence\",\"Student\",\"Human Systems Integration\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117593/Human-Centered-Engineer-Intern-User-Experience-Engineer-Intern",
        summary: "We are currently hiring a Human Centered Engineer Intern to contribute to user-centred engineering solutions that enhance the user experience for government technologies. You will conduct user research, create prototypes, and collaborate with multidisciplinary teams. Ideal for students pursuing relevant engineering or computer science degrees with strong academic performance.",
        locations: [],
				salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Digital Experience Lead",
        mode: "Full time",
        date: "09/18/2026",
        family: "Marketing (Inactive)",
        link: "https://careers.mitre.org/us/en/job/R117548/Digital-Experience-Lead",
        summary: "Take on the role of Digital Experience Lead to drive the strategy and delivery of public-facing digital properties. Oversee website and platform management, enhance user journeys, and leverage AI-enabled tools to improve digital experiences. Ideal for experienced digital professionals with strong UX and design expertise.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            127200,
            159000,
            190800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3) || (experience >= 5)"
    },
    {
        title: "Intellectual Property Paralegal",
        mode: "Full time",
        date: "09/28/2026",
        family: "Legal Advisory - Internal",
        link: "https://careers.mitre.org/us/en/job/R117563/Intellectual-Property-Paralegal",
        summary: "Become part of our team as an Intellectual Property Paralegal, supporting MITRE’s mission by managing patent filings, maintaining docketing, and ensuring compliance with deadlines. Collaborate with inventors and external counsel, requiring strong organizational and communication skills, and experience with USPTO procedures. Ideal for candidates with a background in IP paralegal roles.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            73600,
            92000,
            110400
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "experience >= 3 || (experience >= 2 && degree >= 1)"
    },
    {
        title: "Lead AI Engineer",
        mode: "Full time",
        date: "09/03/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117417/Lead-AI-Engineer",
        summary: "Join our team as a Lead AI Engineer to drive the development and deployment of advanced AI/ML capabilities supporting U.S. Special Operations Forces. Lead technical solutions, collaborate with government and military partners, and deliver innovative, mission-driven engineering. Ideal for experienced professionals with deep expertise in data science, machine learning, and software engineering.",
        locations: [
            "Tampa, Florida, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Principal SATCOM Test & Evaluation Engineer",
        mode: "Full time",
        date: "10/22/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117780/Principal-SATCOM-Test-Evaluation-Engineer",
        summary: "Join our team as a Principal SATCOM Test & Evaluation Engineer, leading technical engagement and evaluation of SATCOM and NC3 systems for government sponsors. Drive systems engineering and integration activities, collaborating across multidisciplinary teams. Ideal for experienced professionals with a strong background in SATCOM and systems engineering.",
        locations: [
            "El Segundo, California, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Hardware Integration Specialist",
        mode: "Full time",
        date: "10/30/2026",
        family: "Technical Project Support",
        link: "https://careers.mitre.org/us/en/job/R117302/Hardware-Integration-Specialist",
        summary: "Become part of our team as a Hardware Integration Specialist, supporting the design, integration, and testing of advanced electronic systems. You will bridge lab operations and hardware fabrication, working closely with engineers to deliver robust prototypes. Ideal for candidates with hands-on electronics integration experience and strong troubleshooting skills.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            100000,
            125000,
            150000
        ],
        clearance_current: "Secret",
        clearance_1y: "None",
        experience: "(degree >= 1)"
    },
    {
        title: "Senior Mechanical Engineer",
        mode: "Full time",
        date: "10/30/2026",
        family: "Mechanical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116931/Senior-Mechanical-Engineer",
        summary: "We are currently hiring a Senior Mechanical Engineer to perform mechanical and environmental analyses for ground, airborne, and shipboard systems. You will work with cross-functional teams to develop and evaluate command-and-control systems. Ideal candidates have significant experience in mechanical engineering and strong analytical skills.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            120400,
            150500,
            180600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1 && experience >= 5"
    },
    {
        title: "Lead Space Systems Engineer",
        mode: "Full time",
        date: "10/30/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117935/Lead-Space-Systems-Engineer",
        summary: "We are seeking a Lead Space Systems Engineer to drive technical vision and strategy for advanced space, ground, and data capabilities supporting the National Reconnaissance Office. Guide innovation, integrate emerging technologies, and provide expert guidance to mission-critical projects. Ideal for experienced engineers with strong leadership and technical expertise in space systems.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Mission Solutions Architect",
        mode: "Full time",
        date: "10/15/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117810/Senior-Mission-Solutions-Architect",
        summary: "We are looking for a Senior Mission Solutions Architect to shape solution architectures and deliver mission-centric platforms for MITRE’s AI and Mission Enablement department. You will translate customer needs into technical solutions and partner with mission teams. Ideal candidates have significant experience in solution architecture and a strong understanding of secure computing environments.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Agreements and Partnerships Success Lead",
        mode: "Full time",
        date: "10/28/2026",
        family: "Strategic Planning",
        link: "https://careers.mitre.org/us/en/job/R117912/Agreements-and-Partnerships-Success-Lead",
        summary: "We are currently hiring an Agreements and Partnerships Success Lead to drive agreement intake, review, and management for MITRE’s Technology Transition and Partnerships Office. This role involves engaging with external partners, managing agreements, and supporting university partnerships. Ideal candidates bring significant experience in corporate agreement execution and strong collaboration skills.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            132000,
            165000,
            198000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "SATCOM Intern - Airborne SATCOM & Connectivity",
        mode: "Full time",
        date: "10/28/2026",
        family: "[\"Imaging and Communication Engineering\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117895/SATCOM-Intern-Airborne-SATCOM-Connectivity",
        summary: "Seeking a SATCOM Intern to support engineering analysis of airborne connectivity for Air Mobility Forces aircraft. Contribute to system integration, test setup, and documentation. Ideal for students in engineering with foundational coding skills and an interest in communications systems.",
        locations: [
            "Bedford ",
            "Wright-Patterson AFB - Fairborn "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Electronic Warfare Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117141/Electronic-Warfare-Systems-Engineer",
        summary: "Take on the role of Electronic Warfare Systems Engineer, advancing multi-domain intelligence and electronic warfare capabilities. Lead technical development of innovative EW techniques, collaborate with cross-functional teams, and manage engineering projects. Ideal for experienced engineers with expertise in RF, signal processing, and radar systems.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "degree >= 1 && experience >= 5"
    },
    {
        title: "Senior SATCOM Engineer",
        mode: "Full time",
        date: "10/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117916/Senior-SATCOM-Engineer",
        summary: "Join our team as a Senior SATCOM Engineer, contributing to the advancement of communications network engineering for national security and innovation. Drive research, design, and testing of complex network solutions, collaborating with multidisciplinary teams. Ideal for experienced professionals with strong networking expertise and a commitment to technical excellence.",
        locations: [
            "Colorado Springs, Colorado, United States of America"
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Communication Systems Analyst",
        mode: "Full time",
        date: "09/29/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117667/Communication-Systems-Analyst",
        summary: "Become part of our team as a Communication Systems Analyst, where you will provide trusted advisor support for RF/Communication Systems, analyzing and troubleshooting complex technical issues. You will collaborate with mission stakeholders and lead root-cause analyses. Ideal candidates bring significant experience in communications engineering and a strong ability to work with classified mission partners.",
        locations: [
            "Springfield, Virginia, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Operations Analyst",
        mode: "Full time",
        date: "10/22/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117868/Lead-Operations-Analyst",
        summary: "Become part of our team as a Lead Operations Analyst, applying advanced analytical and mathematical techniques to support strategic decision-making and operational effectiveness. Lead multidisciplinary teams, oversee complex research projects, and collaborate with stakeholders. Ideal for experienced professionals with strong statistical expertise and a background in automotive or safety data analysis.",
        locations: [
            "Bedford ",
            "Ann Arbor ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Software Engineer",
        mode: "Full time",
        date: "10/08/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117516/Lead-Software-Engineer",
        summary: "Exciting opportunity for a Lead Software Engineer to design, build, and secure mission-focused software systems at MITRE. Drive technical excellence in Python development and cloud-native architectures, collaborating with cross-functional teams. Ideal for experienced engineers with strong AWS, DevSecOps, and data engineering expertise.",
        locations: [
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            156800,
            196000,
            235200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior AEHF Communications Engineer",
        mode: "Full time",
        date: "10/13/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117699/Senior-AEHF-Communications-Engineer",
        summary: "Become part of our team as a Senior AEHF Communications Engineer, leading the specification, integration, and testing of next-generation Military Satellite Communications systems. Drive systems engineering analysis and risk mitigation, collaborating across disciplines. Ideal for experienced engineers with expertise in Military Satellite Communications and strong communication skills.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "RF Spectrum Engineer, Lead",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116607/RF-Spectrum-Engineer-Lead",
        summary: "Exciting opportunity for a RF Spectrum Engineer to lead technical leadership in spectrum sharing and testing activities supporting government and commercial systems. Oversee evaluation of spectrum coexistence and operational performance, drawing on expertise in RF engineering and systems analysis. Ideal for experienced professionals with a strong background in RF systems and technical leadership.",
        locations: [
            "McLean "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 5) || degree === 3"
    },
    {
        title: "Network Engineer, Senior",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116551/Network-Engineer-Senior",
        summary: "We are recruiting a Senior Network Engineer to design, implement, and optimize secure, scalable network environments for federal organizations. You will contribute to network architecture, security, and automation, collaborating on mission-driven technical solutions. Ideal candidates bring significant experience in enterprise networking and a strong background in network security.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5)"
    },
    {
        title: "AI Engineering Intern",
        mode: "Full time",
        date: "11/02/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117620/AI-Engineering-Intern",
        summary: "We are seeking an AI Engineering Intern to contribute to research and development of advanced AI-enabled decision support capabilities. You will work on prototyping, model development, and data analysis, collaborating with experienced professionals. Ideal for students in AI-focused disciplines with strong programming and analytical skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Senior SATCOM Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116634/Senior-SATCOM-Engineer",
        summary: "We are recruiting a Senior SATCOM Engineer to advance communications network engineering for MITRE’s Federally Funded Research and Development Centers. The role involves research, design, and analysis of complex networked environments, supporting national security initiatives. Ideal candidates bring strong networking expertise and a collaborative approach.",
        locations: [
            "San Diego ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree === 1 && experience >= 5) || (degree === 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior Nuclear Effects Engineer",
        mode: "Full time",
        date: "10/16/2026",
        family: "Physics",
        link: "https://careers.mitre.org/us/en/job/R117000/Senior-Nuclear-Effects-Engineer",
        summary: "We are expanding our team: As a Senior Nuclear Effects Engineer, you will analyze the impact of nuclear events on critical systems, supporting the development of survivable weapon systems. This role involves system-level analysis and technical assessments. Ideal candidates bring strong expertise in nuclear physics and experience in radiation environment compliance.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Lead Wireless Communications Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116888/Lead-Wireless-Communications-Systems-Engineer",
        summary: "We are looking for a Lead Wireless Communications Systems Engineer to drive the specification, integration, and testing of next-generation military communications systems. This role involves leading systems engineering analysis and collaborating across multiple engineering domains. Ideal candidates will have significant experience in systems engineering and a strong background in military communications.",
        locations: [
            "San Diego ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Applied Mathematician--Communications, Navigation, and Timing Engineering (PhD preferred)",
        mode: "Full time",
        date: "10/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116613/Senior-Applied-Mathematician-Communications-Navigation-and-Timing-Engineering-PhD-preferred",
        summary: "We are expanding our team: As a Senior Applied Mathematician in Communications, Navigation, and Timing Engineering, you will leverage your expertise to develop and evaluate advanced navigation and communication technologies. Ideal candidates bring strong mathematical backgrounds and experience in applied mathematics, with a focus on solving complex technical challenges.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3)"
    },
    {
        title: "Lead Communications Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117878/Lead-Communications-Engineer",
        summary: "Become part of our team as a Lead Communications Engineer, driving the development of advanced communications infrastructures and supporting national security initiatives. Advise senior government stakeholders and collaborate on technical solutions. Ideal for experienced engineers with expertise in radio frequency technologies and a strong background in communications engineering.",
        locations: [
            "McLean ",
            "See Sponsor City "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Software Developer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117189/Senior-Software-Developer",
        summary: "We are recruiting a Senior Software Developer to contribute to impactful software solutions supporting national security and government projects. You will develop and deliver computing capabilities, collaborate with cross-functional teams, and apply your expertise in Python and modern development practices. Ideal candidates bring significant software engineering experience and a commitment to solving critical challenges.",
        locations: [
            "Bridgeport, West Virginia, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Senior Network Engineer",
        mode: "Full time",
        date: "09/24/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117596/Senior-Network-Engineer",
        summary: "Join our team as a Senior Network Engineer, where you will design and implement secure, resilient network solutions for federal agencies. You will contribute to network architecture, software-defined and virtual networks, and mission security. Ideal candidates bring significant experience in network engineering and a strong technical background.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Lead Network Engineer",
        mode: "Full time",
        date: "09/29/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117669/Lead-Network-Engineer",
        summary: "We are currently hiring a Lead Network Engineer to drive the design and integration of secure, resilient network solutions for the Department of the Air Force. Lead technical initiatives, guide architecture, and collaborate with government stakeholders. Ideal for experienced professionals with strong network engineering expertise and a commitment to mission-driven work.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Principal Project Leader – National Space Program – Advanced Systems & Technology",
        mode: "Full time",
        date: "11/02/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117937/Principal-Project-Leader-National-Space-Program-Advanced-Systems-Technology",
        summary: "We are looking for a Principal Project Leader to drive technical strategy and innovation for the National Space Program’s Advanced Systems & Technology Directorate. Lead cross-functional teams to advance next-generation intelligence systems, ensuring mission-relevant solutions. Ideal for experienced leaders with deep expertise in space, ground, and data technologies.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Wireless Signal Processing Engineer, Principal",
        mode: "Full time",
        date: "09/15/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117504/Wireless-Signal-Processing-Engineer-Principal",
        summary: "Exciting opportunity for a Principal Wireless Signal Processing Engineer to lead the development and evaluation of advanced wireless communications and signal processing technologies. Drive technical leadership, mentor teams, and collaborate with government sponsors. Ideal for experienced engineers with deep expertise in RF systems and digital communications.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Wireless Communications Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116886/Wireless-Communications-Systems-Engineer",
        summary: "Join our team as a Wireless Communications Systems Engineer, contributing to the specification, integration, and testing of advanced military communications systems. Engage in systems engineering analysis and collaborate with multidisciplinary teams. Ideal for candidates with strong technical expertise and experience in systems engineering within complex, mission-critical environments.",
        locations: [
            "San Diego ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Communications & Signal Processing Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116815/Communications-Signal-Processing-Engineer",
        summary: "We are recruiting a Communications & Signal Processing Engineer to develop and prototype advanced wireless communication solutions for U.S. Government agencies. You will apply expertise in digital signal processing and wireless systems, focusing on resilient, mission-critical communications. Ideal candidates bring strong technical acumen and experience in communications or signal processing.",
        locations: [
            "San Diego ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree >= 3"
    },
    {
        title: "Senior Full Stack Engineer, TS/SCI w/Polygraph",
        mode: "Full time",
        date: "09/17/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R117531/Senior-Full-Stack-Engineer-TS-SCI-w-Polygraph",
        summary: "Become part of our team as a Senior Full Stack Engineer, supporting high-priority Intelligence Community initiatives. Lead the design and deployment of secure, mission-driven applications, collaborating with technical teams to deliver impactful solutions. Ideal for experienced professionals with a TS/SCI with Polygraph and expertise in secure, enterprise-level software development.",
        locations: [
            "Colorado Springs ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            122400,
            153000,
            183600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Lead Network Engineer",
        mode: "Full time",
        date: "10/22/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117866/Lead-Network-Engineer",
        summary: "Join us as a Lead Network Engineer to design and support advanced tactical communications network architectures for the U.S. Army. Lead technical initiatives, integrate network solutions, and provide expert guidance to military leadership. Ideal for experienced network engineers with a strong background in Army operations and complex network environments.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "degree >= 1 && experience >= 8"
    },
    {
        title: "Industrial Organization Economist",
        mode: "Full time",
        date: "08/28/2026",
        family: "Economics",
        link: "https://careers.mitre.org/us/en/job/R116678/Industrial-Organization-Economist",
        summary: "We are expanding our team: As an Industrial Organization Economist, you will develop advanced economic models and analyze policy impacts, supporting regulatory and applied research. Ideal candidates bring significant experience in econometrics and a strong background in economic analysis.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            113600,
            142000,
            170400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Senior DevOps/AI Engineer",
        mode: "Full time",
        date: "10/15/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R116869/Senior-DevOps-AI-Engineer",
        summary: "Join our team as a Senior DevOps/AI Engineer, leading the design and delivery of advanced DevOps and AI/ML capabilities to drive digital transformation. Oversee CI/CD pipelines, containerised deployments, and AI-enabled systems. Ideal for experienced professionals with strong technical expertise in software development and cloud technologies.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Intermediate Applied Operations Research Analyst",
        mode: "Full time",
        date: "09/29/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117670/Intermediate-Applied-Operations-Research-Analyst",
        summary: "Become part of our team as an Intermediate Applied Operations Research Analyst, applying advanced analytical and mathematical modeling to solve complex, interdisciplinary problems. Drive operational effectiveness and efficiency, collaborating with technical experts. Ideal for candidates with experience in operations research or analytics and a passion for impactful, policy-driven solutions.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford ",
            "Huntsville "
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116984/Communications-Engineer",
        summary: "We are recruiting a Communications Engineer to develop innovative solutions in wireless communications for government agencies. You will apply technical expertise in modeling and simulation, and contribute to advanced communication technologies. Ideal candidates have a background in communication systems or signal processing and experience with simulation tools.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience < 1) || experience < 1"
    },
    {
        title: "Lead Wireless Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116887/Lead-Wireless-Communications-Engineer",
        summary: "Exciting opportunity for a Lead Wireless Communications Engineer to drive the design and development of advanced communication systems supporting U.S. Government agencies. Lead technical teams in waveform component design and real-time signal processing. Ideal for experienced engineers with expertise in communications and digital signal processing.",
        locations: [
            "San Diego ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Underwater Sensors Engineer",
        mode: "Full time",
        date: "10/08/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117758/Senior-Underwater-Sensors-Engineer",
        summary: "We are looking for a Senior Underwater Sensors Engineer to advance maritime capabilities by developing and evaluating signal processing algorithms and acoustic communication systems. Lead multidisciplinary technical efforts and support government mission needs. Ideal for candidates with strong engineering expertise and experience in applied mathematics, physics, and underwater sensor systems.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Spectrum Compatibility Engineer, Senior",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116533/Spectrum-Compatibility-Engineer-Senior",
        summary: "Become part of our team as a Spectrum Compatibility Engineer, supporting advanced analysis and modeling of wireless systems in complex electromagnetic environments. Evaluate spectrum coexistence, compatibility, and operational performance across diverse RF systems. Ideal for candidates with strong RF engineering experience and expertise in wireless communications.",
        locations: [
            "Boulder ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior Applied Economist",
        mode: "Full time",
        date: "08/28/2026",
        family: "Economics",
        link: "https://careers.mitre.org/us/en/job/R116973/Senior-Applied-Economist",
        summary: "Become part of our team as a Senior Applied Economist, where you will conduct advanced economic modeling and analysis to inform policy and support government sponsors. Utilize your expertise in macroeconomics and econometrics to deliver actionable insights. Ideal for candidates with a Master’s in Economics and significant experience in applied research and technical development.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            113600,
            142000,
            170400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "degree >= 2 && experience >= 3"
    },
    {
        title: "Senior Communications Engineer",
        mode: "Full time",
        date: "09/29/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117668/Senior-Communications-Engineer",
        summary: "Take on the role of Senior Communications Engineer, providing technical leadership in advancing adaptive communications and networking infrastructure for national security. Lead architecture and implementation for mission-critical systems, collaborating with diverse stakeholders. Ideal for experienced engineers with expertise in RF communications and systems engineering.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 6) || (degree >= 2 && experience >= 4) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Associate Signal Processing Engineer",
        mode: "Full time",
        date: "10/27/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117538/Associate-Signal-Processing-Engineer",
        summary: "We are expanding our team: As an Associate Signal Processing Engineer, you will contribute to the development of advanced RF capabilities for U.S. Government sponsors. You will model and simulate electromagnetic environments and apply your expertise in signal processing to develop resilient communications systems. Ideal candidates have strong analytical skills and experience in RF systems.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Senior Agentic Software Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117514/Senior-Agentic-Software-Engineer",
        summary: "We are recruiting a Senior Agentic Software Engineer to design, build, and secure mission-focused software systems using agentic and AI-enabled development techniques. Lead the development of robust data platforms and collaborate with experts to deliver impactful solutions. Ideal for experienced engineers with strong Python skills and a passion for innovative software engineering.",
        locations: [
            "Colorado Springs ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Computable General Equilibrium Modeler",
        mode: "Full time",
        date: "08/28/2026",
        family: "Economics",
        link: "https://careers.mitre.org/us/en/job/R116699/Computable-General-Equilibrium-Modeler",
        summary: "Seeking a Computable General Equilibrium Modeler to advance applied macroeconomics research and policy assessment. Contribute to quantitative economic modeling and inform domestic and international policy changes. Ideal for candidates with significant CGE modeling experience and advanced econometric skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            113600,
            142000,
            170400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Senior Network Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116559/Senior-Network-Engineer",
        summary: "Seeking a Senior Network Engineer to design and implement secure, resilient network solutions for federal agencies. Key responsibilities include network architecture, software-defined/virtual networks, and mission security. Ideal candidates bring significant experience in enterprise networking and a strong technical background.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Wireless Communications Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116635/Wireless-Communications-Engineer",
        summary: "We are seeking a Wireless Communications Engineer to contribute to research, design, and analysis of advanced wireless networks. Key responsibilities include supporting lab-based testbeds and evaluating wireless communications systems. Ideal candidates will have foundational knowledge in networking protocols and a strong interest in wireless technology.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            96400,
            120500,
            144600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || degree >= 2"
    },
    {
        title: "Intermediate Complex Systems Modeler",
        mode: "Full time",
        date: "11/02/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117762/Intermediate-Complex-Systems-Modeler",
        summary: "Seeking a motivated Intermediate Complex Systems Modeler to develop and apply advanced models and simulations for critical national challenges. Contribute to research and analysis in domains such as national security, healthcare, and transportation. Ideal for candidates with strong computational modeling expertise and a passion for collaborative, impactful work.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 2 && experience >= 0) || (degree === 1 && experience >= 2)"
    },
    {
        title: "Associate Communications & Signal Processing Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116981/Associate-Communications-Signal-Processing-Engineer",
        summary: "We are seeking a motivated Associate Communications & Signal Processing Engineer to contribute to the development of resilient wireless communications for U.S. Government sponsors. Key responsibilities include applying DSP and wireless systems expertise to prototype innovative solutions and support mission-critical communications. Ideal for candidates with a technical background and a passion for impactful engineering.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 0 && experience <= 2"
    },
    {
        title: "Principal Network Engineer",
        mode: "Full time",
        date: "09/24/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117609/Principal-Network-Engineer",
        summary: "We are expanding our team: As a Principal Network Engineer, you will lead research, design, and analysis of complex communications networks, supporting national security and innovation. This role requires significant expertise in networking protocols and leadership, ideal for experienced professionals with a strong background in wireless and tactical networks.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Engineer or Physicist in Positioning, Navigation, and Timing",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R115751/Engineer-or-Physicist-in-Positioning-Navigation-and-Timing",
        summary: "Join our team as a key contributor to Positioning, Navigation, and Timing (PNT) projects, focusing on modeling, simulation, and testing of advanced PNT technologies. Ideal for candidates with a strong technical background in PNT, a relevant degree, and experience in data analysis or software development.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "Secret",
        clearance_1y: "None",
        experience: "experience >= 0 && (degree >= 1 || experience >= 1)"
    },
    {
        title: "Associate Communications Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116980/Associate-Communications-Systems-Engineer",
        summary: "Become part of our team as a Associate Communications Systems Engineer, supporting engineering initiatives for U.S. Government sponsors. Contribute to prototyping, process improvement, and requirements management. Ideal for entry-level engineers with a technical background and strong communication skills.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 0 && experience <= 2"
    },
    {
        title: "Lead Network Engineer",
        mode: "Full time",
        date: "09/04/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117335/Lead-Network-Engineer",
        summary: "Join us as a Lead Network Engineer to design, implement, and modernize secure, resilient Air Force network environments. Drive technical excellence in network architecture and integration, collaborating with federal sponsors. Ideal for experienced professionals with strong leadership and technical expertise in complex network challenges.",
        locations: [
            "Hanscom Air Force Base "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Cyber New Professionals Program",
        mode: "Full time",
        date: "09/15/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117365/Cyber-New-Professionals-Program",
        summary: "Join us as a Cyber New Professionals Program participant, where you will tackle complex national cybersecurity challenges and develop hands-on expertise in emerging technologies. Collaborate with leading experts, gain technical training, and build your professional network. Ideal for early-career professionals with a relevant degree and a passion for cybersecurity.",
        locations: [
            "Bedford ",
            "Huntsville "
        ],
        salary: [
            85200,
            106500,
            127800
        ],
        experience: "(degree >= 1 && experience < 2)"
    },
    {
        title: "Advanced Ground System Engineer",
        mode: "Full time",
        date: "11/02/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117943/Advanced-Ground-System-Engineer",
        summary: "Become part of our team as an Advanced Ground System Engineer, driving innovation in next-generation overhead reconnaissance and intelligence systems. Lead technical vision and strategy for advanced space, ground, and data capabilities, supporting the National Reconnaissance Office. Ideal for experienced engineers with expertise in space systems and a strong background in systems engineering.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Associate Generative AI Engineer",
        mode: "Full time",
        date: "11/04/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117797/Associate-Generative-AI-Engineer",
        summary: "Exciting opportunity for an Associate Generative AI Engineer to contribute to the development and deployment of advanced AI solutions supporting critical US government missions. Collaborate in cross-functional teams, prototype AI systems, and analyze data to address operational challenges. Ideal for candidates with recent experience in LLM technology and strong communication skills.",
        locations: [
            "Bedford "
        ],
        salary: [
            97600,
            122000,
            146400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 1) || (degree >= 1 && experience >= 0)"
    },
    {
        title: "Operations Analyst, Intermediate",
        mode: "Full time",
        date: "09/01/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117400/Operations-Analyst-Intermediate",
        summary: "We are seeking a creative Operations Analyst, Intermediate to apply advanced analytical and mathematical techniques to support strategic and technical decisions. Key responsibilities include developing customized algorithms and presenting actionable insights. Ideal candidates will have experience in operations research and a strong background in data analysis.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Principal Spectrum Systems Engineer (Mission Driven Integration)",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116976/Principal-Spectrum-Systems-Engineer-Mission-Driven-Integration",
        summary: "We are currently hiring a Principal Spectrum Systems Engineer to address critical technology challenges in electromagnetic spectrum operations and cybersecurity analytics. You will partner with senior command sponsors, communicate advanced concepts to stakeholders, and drive innovative solutions. Ideal candidates bring extensive experience in spectrum systems engineering and operational analysis.",
        locations: [
            "Bellevue, Nebraska, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead C2 Systems Engineer",
        mode: "Full time",
        date: "11/03/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117918/Lead-C2-Systems-Engineer",
        summary: "We are currently hiring a Lead C2 Systems Engineer to drive operational mission requirements and technical assessments for USAF warfighter operations. You will collaborate with military and government stakeholders, focusing on C2 communications and mission resiliency. Ideal candidates bring significant experience in national security and advanced systems engineering.",
        locations: [
            "Honolulu, Hawaii, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Wireless Signal Processing Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117112/Wireless-Signal-Processing-Engineer",
        summary: "Exciting opportunity for a Wireless Signal Processing Engineer to advance resilient wireless communications and mission systems for U.S. Government sponsors. Apply RF system expertise to model and simulate complex electromagnetic environments and develop innovative signal processing solutions. Ideal for candidates with strong analytical skills and experience in digital signal processing, machine learning, and wireless technologies.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Treasury Program Integration Lead",
        mode: "Full time",
        date: "10/20/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117819/Treasury-Program-Integration-Lead",
        summary: "We are recruiting a Treasury Program Integration Lead to provide strategic coordination and oversight for a portfolio of Treasury initiatives. Advise on mission priorities and stakeholder engagement, and facilitate collaboration across teams. Ideal for experienced Treasury professionals with strong project management and financial operations expertise.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Other",
        clearance_1y: "Other",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Software/Digital Modernization Transformation Lead, Principal",
        mode: "Full time",
        date: "09/11/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R116157/Software-Digital-Modernization-Transformation-Lead-Principal",
        summary: "We are looking for a senior leader to drive software and digital transformation across MITRE’s ASA Department. Lead modern software delivery models, collaborate with stakeholders, and shape national security initiatives. Ideal for experienced professionals with deep expertise in defense acquisition and digital modernization.",
        locations: [
            "Bedford ",
            "Huntsville ",
            "McLean "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "IC Finance Resource Lead",
        mode: "Full time",
        date: "10/13/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117718/IC-Finance-Resource-Lead",
        summary: "Become part of our team as the IC Finance Resource Lead, providing expert financial analysis and strategic support to government sponsors. Drive budget execution and policy integration within the Intelligence Community. Ideal for experienced professionals with strong analytical skills and a background in government finance.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Systems Engineer - Intelligence Systems & Integration",
        mode: "Full time",
        date: "11/04/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117964/Lead-Systems-Engineer-Intelligence-Systems-Integration",
        summary: "We are looking for a Lead Systems Engineer to drive the development and integration of enterprise capabilities for national intelligence missions. Collaborate with government stakeholders to define technical requirements and assess system architectures. Ideal for experienced engineers with strong analytical skills and a background in systems engineering or related fields.",
        locations: [
            "Bethesda ",
            "McLean "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "degree >= 1"
    },
    {
        title: "Systems Engineer",
        mode: "Full time",
        date: "09/18/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117553/Systems-Engineer",
        summary: "We are looking for a Systems Engineer to apply advanced systems engineering and digital engineering methods to national security challenges. You will lead technical analysis and integration activities, collaborating with stakeholders and technical teams. Ideal candidates have significant engineering experience and a strong technical background.",
        locations: [
            "Canberra, Australian Capital Territory, Australia"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Not Applicable",
        clearance_1y: "Not Applicable",
        experience: "experience >= 3"
    },
    {
        title: "Lead Cloud Engineer",
        mode: "Full time",
        date: "09/28/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R116663/Lead-Cloud-Engineer",
        summary: "Take on the role of Lead Cloud Engineer to drive architectural and hands-on solutions for critical cloud computing and DevOps challenges. Lead the identification and resolution of infrastructure vulnerabilities, collaborate with development teams, and provide technical guidance. Ideal for experienced cloud professionals with strong DevOps expertise and a commitment to technical excellence.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            144800,
            181000,
            217200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Talent Acquisition Sourcing, Senior",
        mode: "Full time",
        date: "11/05/2026",
        family: "Talent Acquisition",
        link: "https://careers.mitre.org/us/en/job/R117710/Talent-Acquisition-Sourcing-Senior",
        summary: "We are recruiting a Senior Talent Acquisition Sourcing professional to identify, engage, and attract top talent for MITRE’s mission-driven work. Collaborate with recruiters and hiring managers to build strong candidate pipelines and leverage modern sourcing tools. Ideal for experienced professionals with a background in talent sourcing and recruitment.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            99600,
            124500,
            149400
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "degree >= 1 && experience >= 6"
    },
    {
        title: "Principal Software Engineer",
        mode: "Full time",
        date: "11/06/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117969/Principal-Software-Engineer",
        summary: "We are seeking a Principal Software Engineer to drive technical innovation and lead cross-functional teams in developing robust, scalable cloud and distributed software solutions. This role focuses on enterprise data architecture and secure operations, ideal for experienced professionals with a strong background in cloud platforms and distributed systems.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "IC Congressional Budget Resource Advisor",
        mode: "Full time",
        date: "10/13/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117716/IC-Congressional-Budget-Resource-Advisor",
        summary: "Join us as an IC Congressional Budget & Resources Advisor, supporting the Government sponsor in coordinating mission management, budget analysis, and resource matters. You will analyze legislation, develop responses to congressional actions, and provide strategic recommendations. Ideal candidates bring significant experience in government budgeting and a strong understanding of intelligence community operations.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            161600,
            202000,
            242400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Intermediate Embedded Security Engineer",
        mode: "Full time",
        date: "09/15/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116827/Intermediate-Embedded-Security-Engineer",
        summary: "We are seeking an Intermediate Embedded Security Engineer to drive vulnerability research and exploit development for embedded systems. You will reverse engineer complex firmware and software, prototype proof-of-concept solutions, and contribute technical leadership. Ideal candidates have hands-on expertise in embedded security and experience with C/C++ and Python.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1 && experience >= 2"
    },
    {
        title: "SI Accelerator Mission Analyst",
        mode: "Full time",
        date: "11/05/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117983/SI-Accelerator-Mission-Analyst",
        summary: "Join us as a SI Accelerator Mission Analyst, leading end-to-end mission use cases to drive impactful solutions. Oversee analytic workflows, guide engineers, and ensure rigorous verification and validation. Ideal for experienced analysts with a strong background in operations research or systems analysis.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            171000,
            213500,
            256000
        ],
        clearance_current: "Not Applicable",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "IC Strategic Resource Lead",
        mode: "Full time",
        date: "10/13/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117719/IC-Strategic-Resource-Lead",
        summary: "We are seeking an IC Strategic Resource Lead to provide expert strategic resource advice to government sponsors, supporting budget formulation and execution. The role involves analyzing policy frameworks and collaborating with senior intelligence officials. Ideal candidates will have significant experience in government budgeting and a strong background in intelligence operations.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Business Operations, Lead",
        mode: "Part time",
        date: "10/16/2026",
        family: "Business Operations",
        link: "https://careers.mitre.org/us/en/job/R117807/Business-Operations-Lead",
        summary: "We are recruiting a Business Operations Lead to drive workforce and resource planning, supporting leadership in aligning staffing with organizational needs. The role involves analyzing demand, coordinating hiring, and providing operational insights. Ideal for experienced professionals with strong analytical and stakeholder management skills.",
        locations: [
            "Bedford ",
            "Tampa ",
            "McLean "
        ],
        salary: [
            132000,
            165000,
            198000
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Software Engineer, Lead",
        mode: "Full time",
        date: "11/05/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117974/Software-Engineer-Lead",
        summary: "Become part of our team as a Software Engineer, Lead, driving the development and integration of advanced Command and Control solutions for the Army. Lead engineering teams, collaborate with government and industry stakeholders, and ensure high-quality delivery of technical products. Ideal for experienced professionals with strong software engineering expertise and a commitment to secure, mission-critical systems.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            156800,
            196000,
            235200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Acquisition Mission Integrator",
        mode: "Full time",
        date: "11/06/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117985/Acquisition-Mission-Integrator",
        summary: "Become part of our team as an Acquisition Mission Integrator, driving innovation and capability delivery across defense acquisition and operational communities. Collaborate with sponsors and government stakeholders to modernize acquisition practices. Ideal for experienced professionals with expertise in digital engineering and acquisition strategy.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            190000,
            237500,
            285000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "Lead IC Systems Engineer (Intelligence Center)",
        mode: "Full time",
        date: "08/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117216/Lead-IC-Systems-Engineer-Intelligence-Center",
        summary: "Exciting opportunity for a Lead IC Systems Engineer to provide senior-level technical assessments and enterprise strategy support within the Intelligence Community. Drive cloud modernization and software integration, collaborating with senior government leaders. Ideal for experienced engineers with expertise in systems architecture and cloud-native solutions.",
        locations: [
            "Bethesda, Maryland, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior AI Engineer for Embedded Security",
        mode: "Full time",
        date: "10/01/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117682/Senior-AI-Engineer-for-Embedded-Security",
        summary: "Join us as a Senior AI Engineer for Embedded Security, where you will apply AI/ML solutions to embedded security challenges and collaborate with multidisciplinary teams. Ideal candidates bring significant experience in embedded systems security and AI/ML, with strong technical expertise and a commitment to mission-critical solutions.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Associate FIB-SEM Engineer",
        mode: "Full time",
        date: "10/14/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117799/Associate-FIB-SEM-Engineer",
        summary: "Join our team as an Associate FIB-SEM Engineer, advancing semiconductor processing and supporting national security projects. Contribute to hands-on security assessments and develop countermeasures for emerging threats. Ideal for candidates with engineering backgrounds and expertise in FIB, PFIB, and SEM.",
        locations: [
            "Albuquerque, New Mexico, United States of America"
        ],
        salary: [
            80400,
            100500,
            120600
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Senior Undersea Systems Engineer",
        mode: "Full time",
        date: "10/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117739/Senior-Undersea-Systems-Engineer",
        summary: "Become part of our team as a Senior Undersea Systems Engineer, leading multidisciplinary teams to deliver engineering solutions for undersea warfare and naval capabilities. Guide technical execution, manage risks, and translate complex analysis into actionable recommendations. Ideal for experienced engineers with strong systems engineering expertise and a background in naval operations.",
        locations: [
            "San Diego ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "IC Resource Manager, Principal",
        mode: "Full time",
        date: "10/13/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117717/IC-Resource-Manager-Principal",
        summary: "Seeking an expert to provide strategic resource management support for the Intelligence Community, aligning mission priorities and resources to achieve secure outcomes. Key responsibilities include analyzing resource requirements and supporting senior leaders. Ideal for candidates with significant experience in intelligence community resource management and strong analytical skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            161600,
            202000,
            242400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior Undersea Systems Engineer",
        mode: "Full time",
        date: "10/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117740/Senior-Undersea-Systems-Engineer",
        summary: "We are expanding our team: As a Senior Undersea Systems Engineer, you will lead multidisciplinary teams in developing and integrating engineering solutions for undersea warfare and naval capabilities. This role requires strong technical expertise and experience in systems engineering, ideally suited for candidates with a background in naval operations and advanced technical skills.",
        locations: [
            "San Diego ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Assistant General Counsel – Government Contracts & Compliance",
        mode: "Full time",
        date: "11/04/2026",
        family: "Legal Advisory - Internal",
        link: "https://careers.mitre.org/us/en/job/R117975/Assistant-General-Counsel-Government-Contracts-Compliance",
        summary: "Become part of our team as Assistant General Counsel – Government Contracts & Compliance, providing strategic legal advice on federal cybersecurity, compliance, and information security matters. Advise on government contracts and support MITRE’s nonprofit governance. Ideal for experienced attorneys with expertise in government contracting and privacy regulations.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            181500,
            227000,
            272500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "experience >= 8"
    },
    {
        title: "PAE Fires M&S Software Engineer",
        mode: "Full time",
        date: "11/04/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117327/PAE-Fires-M-S-Software-Engineer",
        summary: "Take on the role of a technical software engineer supporting modernization of Modeling and Simulation capabilities for Army systems. Collaborate with senior leaders to define and execute engineering strategies. Ideal for candidates with significant experience in software engineering and a strong technical background.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Electronic Warfare Systems Architect",
        mode: "Full time",
        date: "09/23/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117275/Electronic-Warfare-Systems-Architect",
        summary: "Seeking an experienced Electronic Warfare Systems Architect to define advanced capabilities and inform future procurement efforts. Lead the development of GRA-compliant solutions and serve as a trusted advisor to operational users. Ideal for candidates with deep systems engineering expertise and a strong background in defense or national security environments.",
        locations: [
            "Hanscom Air Force Base, Massachusetts, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Data Scientist",
        mode: "Full time",
        date: "10/07/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117188/Lead-Data-Scientist",
        summary: "We are recruiting a Lead Data Scientist to drive technical excellence and support national security initiatives. Lead test planning, automation, and data analysis for critical government programs. Ideal for experienced professionals with strong leadership in data science and a commitment to impactful research.",
        locations: [
            "Bridgeport, West Virginia, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Modeling and Simulation Analyst, Lead",
        mode: "Full time",
        date: "09/14/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117399/Modeling-and-Simulation-Analyst-Lead",
        summary: "Join our team as a Modeling and Simulation Analyst, Lead, where you will apply advanced analytical and mathematical techniques to support national security and public sector projects. Lead the development of high-fidelity space system models and simulations, collaborating with multidisciplinary teams. Ideal for experienced professionals with expertise in modeling, simulation, and operations research.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Data Scientist",
        mode: "Full time",
        date: "08/28/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117328/Data-Scientist",
        summary: "We are looking for a Senior Data Scientist to drive impactful analytics and business solutions within MITRE’s Acquisition Affordability and Business Analytics Department. You will analyze complex datasets, support strategic decision-making, and collaborate with multidisciplinary teams. Ideal candidates bring strong analytical skills and experience in data science or related fields.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Cyber Reverse Engineer",
        mode: "Full time",
        date: "10/01/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117107/Cyber-Reverse-Engineer",
        summary: "We are seeking a Cyber Reverse Engineer to perform advanced reverse engineering and cyber analysis across multiple hardware architectures. Key responsibilities include analyzing network systems and operating system internals. Ideal candidates will have significant experience in reverse engineering and assembly language, with a strong technical background.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior Cybersecurity Assessment Engineer",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117923/Senior-Cybersecurity-Assessment-Engineer",
        summary: "We are currently hiring a Senior Cybersecurity Assessment Engineer to conduct cybersecurity assessments and develop automation solutions. You will analyze risks, provide recommendations, and collaborate with government sponsors. Ideal candidates have significant experience in cybersecurity engineering and automation.",
        locations: [
            "Windsor "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Not Applicable",
        experience: "experience >= 5"
    },
    {
        title: "Digital Forensics Capability Development with Python - (TS Cleared)",
        mode: "Full time",
        date: "10/14/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117765/Digital-Forensics-Capability-Development-with-Python-TS-Cleared",
        summary: "We are seeking an experienced Python developer to lead technical development and provide technical leadership in digital forensics capability building. You will design and maintain Python-based applications, collaborate with sponsors, and mentor team members. Ideal candidates have significant software development experience and a strong background in technical problem solving.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead Engineer, Cryptography Engineer – Blockchain Specialist",
        mode: "Full time",
        date: "08/28/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117052/Lead-Engineer-Cryptography-Engineer-Blockchain-Specialist",
        summary: "We are currently hiring a Lead Engineer, Cryptography Engineer – Blockchain Specialist to drive innovation in cryptographic foundations for blockchain and digital asset ecosystems. Lead projects focused on secure systems and protocols, and serve as a subject matter expert. Ideal for experienced professionals with strong expertise in cryptography, cybersecurity, and digital assets.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 5) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Cryptography and Nuclear Codes Engineer, Lead",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117892/Cryptography-and-Nuclear-Codes-Engineer-Lead",
        summary: "Join our team as a Cryptography and Nuclear Codes Engineer, Lead, where you will advance security in modern nuclear weapon systems. Lead engineering analysis, develop cryptographic solutions, and advise on national security requirements. Ideal for experienced engineers with expertise in nuclear codes and cryptography, seeking to make a significant impact in national security.",
        locations: [
            "San Antonio ",
            "Hill AFB - Clearfield ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Data Science and Analytics, Senior",
        mode: "Full time",
        date: "08/31/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117396/Data-Science-and-Analytics-Senior",
        summary: "We are looking for a Senior Data Science and Analytics professional to support the design and implementation of data-driven solutions for Department of Veterans Affairs and Defense Health Agency initiatives. You will analyze complex technical challenges, develop actionable recommendations, and collaborate with multidisciplinary teams. Ideal candidates have significant experience in data analytics and technical problem-solving.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Data Science Intern",
        mode: "Full time",
        date: "11/06/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117632/Data-Science-Intern",
        summary: "Take on the role of Data Science Intern and contribute to impactful projects supporting government decisions. Collaborate with experienced data scientists to develop analytic pipelines and communicate findings. Ideal for students in data science or related fields with programming skills and a commitment to excellence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "is_student === true"
    },
    {
        title: "Lead Cybersecurity Engineer",
        mode: "Full time",
        date: "10/20/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117847/Lead-Cybersecurity-Engineer",
        summary: "Join our team as a Lead Cybersecurity Engineer, where you will drive technical innovation in cryptography, software assurance, and identity management. Advise on supply chain risk management and support government program security. Ideal for experienced professionals with deep technical expertise and a strong background in cybersecurity.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Python Developer - Digital Forensics",
        mode: "Full time",
        date: "10/16/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117409/Python-Developer-Digital-Forensics",
        summary: "We are recruiting a Python Developer to lead technical development and provide technical leadership in digital forensics investigations. You will design and maintain Python-based solutions, collaborate with sponsors, and mentor team members. Ideal candidates have significant Python expertise and experience in technical problem solving within a mission-driven environment.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "true"
    },
    {
        title: "Lead Cryptography Engineer",
        mode: "Full time",
        date: "09/15/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117053/Lead-Cryptography-Engineer",
        summary: "Become part of our team as a Lead Cryptography Engineer, driving innovation in cryptography and system assurance for critical national security missions. Lead technical research, develop secure solutions, and collaborate with multidisciplinary teams. Ideal for experienced professionals with strong analytical skills and expertise in cryptography and PQC standards.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Principal Cyber Intelligence Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117885/Principal-Cyber-Intelligence-Engineer",
        summary: "Become part of our team as a Principal Cyber Intelligence Engineer, advancing research and innovation in cyber intelligence for government and private sector sponsors. Lead projects, collaborate across teams, and apply your expertise in threat analysis and intelligence tools. Ideal for experienced professionals with strong leadership and technical skills in cyber intelligence.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Principal Cryptography Engineer",
        mode: "Full time",
        date: "09/15/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117051/Principal-Cryptography-Engineer",
        summary: "Seeking a Principal Cryptography Engineer to architect and apply modern cryptography and PQC technologies for secure systems and protocols. Lead research, development, and deployment of cryptographic solutions, collaborating with multidisciplinary teams. Ideal for experienced professionals with strong technical and analytical skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "TS/SCI Principal Cyber Intelligence Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117884/TS-SCI-Principal-Cyber-Intelligence-Engineer",
        summary: "We are looking for a Principal Cyber Intelligence Engineer to advance research and innovation in cyber intelligence, leading projects and collaborating with government and industry partners. The ideal candidate brings extensive expertise in cyber intelligence and leadership, with experience in threat analysis and technical frameworks.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "TSSCI Senior Offensive Security Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117888/TSSCI-Senior-Offensive-Security-Engineer",
        summary: "Exciting opportunity for a Senior Offensive Security Engineer to advance adversary emulation and threat intelligence research. Drive innovation in cyber operations and red teaming, leveraging your expertise in offensive security and adversary behavior. Ideal for experienced professionals with strong technical and communication skills.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Principal, Communications - MITRE Technology and Engineering",
        mode: "Full time",
        date: "09/16/2026",
        family: "External Communications",
        link: "https://careers.mitre.org/us/en/job/R117483/Principal-Communications-MITRE-Technology-and-Engineering",
        summary: "We are seeking a senior communications leader to drive strategic communications for MITRE Technology and Engineering. Lead the development of clear, impactful narratives for complex technical and scientific topics, engaging diverse audiences. Ideal for experienced professionals with strong technical fluency and a proven track record in communications strategy.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            147500,
            184500,
            221500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Lead Comms & Networking C2 Engineer",
        mode: "Full time",
        date: "11/04/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117947/Lead-Comms-Networking-C2-Engineer",
        summary: "Take on the role of Lead Communications & Networking C2 Engineer, providing technical leadership for Army Next Generation Command and Control (NGC2) initiatives. Shape and deliver integrated C2 capabilities, coordinate cross-functional teams, and drive operational outcomes. Ideal for experienced professionals with a strong networking engineering background and proven leadership in complex command-and-control environments.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Not Applicable",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Firmware Security Researcher",
        mode: "Full time",
        date: "08/28/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116568/Senior-Firmware-Security-Researcher",
        summary: "Exciting opportunity for a Senior Firmware Security Researcher to tackle embedded security challenges at MITRE. Lead vulnerability research, reverse engineer complex systems, and develop proof-of-concept exploits. Ideal for candidates with strong expertise in embedded security, reverse engineering, and technical leadership within a multidisciplinary team.",
        locations: [
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "C-WMD Assessor",
        mode: "Full time",
        date: "10/08/2026",
        family: "Life Sciences",
        link: "https://careers.mitre.org/us/en/job/R117088/C-WMD-Assessor",
        summary: "We are looking for a C-WMD Assessor to design and evaluate nonproliferation capacity-building programs, supporting national security and treaty compliance. You will conduct independent assessments, analyze data, and communicate findings. Ideal candidates have experience in biological threat reduction and international security cooperation.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            92800,
            116000,
            139200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience > 0)"
    },
    {
        title: "Senior Applied Operations Research Analyst",
        mode: "Full time",
        date: "09/29/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117672/Senior-Applied-Operations-Research-Analyst",
        summary: "We are looking for a Senior Applied Operations Research Analyst to drive impactful analytical work supporting national security and public interest initiatives. You will apply advanced mathematical modeling and programming techniques to solve complex, interdisciplinary problems. Ideal candidates bring significant experience in operations research or analytics and a strong background in data-driven decision-making.",
        locations: [
            "Colorado Springs ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior UX/UI Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117081/Senior-UX-UI-Engineer",
        summary: "We are looking for a Senior UX/UI Engineer to design and develop user-centered software solutions that address critical national missions. Collaborate with multidisciplinary teams, apply modern front-end technologies, and mentor junior engineers. Ideal for candidates with significant experience in UX/UI engineering and a passion for improving user experiences.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 4)"
    },
    {
        title: "Lead Data Scientist",
        mode: "Full time",
        date: "10/16/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117607/Lead-Data-Scientist",
        summary: "Become part of our team as a Lead Data Scientist, driving technical solutions for critical national security and intelligence challenges. Lead data science initiatives, develop and evaluate models, and deliver analytic capabilities. Ideal for experienced professionals with advanced data science expertise and a strong background in statistical analysis, machine learning, and software development.",
        locations: [
            "El Segundo ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Procurement Specialist",
        mode: "Full time",
        date: "10/20/2026",
        family: "Procurement",
        link: "https://careers.mitre.org/us/en/job/R117773/Senior-Procurement-Specialist",
        summary: "We are recruiting a Senior Procurement Specialist to manage procurement processes for commodities and labor-based services, ensuring compliance with corporate policies and federal regulations. The role involves negotiating vendor agreements and maintaining procurement systems. Ideal for candidates with significant procurement experience and strong analytical skills.",
        locations: [
            "Bedford ",
            "Tampa ",
            "McLean "
        ],
        salary: [
            88400,
            110500,
            132600
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Geospatial Data Scientist",
        mode: "Full time",
        date: "10/28/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117431/Geospatial-Data-Scientist",
        summary: "We are looking for a Geospatial Data Scientist to advance national security and public interest through geospatial data science, modeling, and analysis. You will develop spatial solutions and support research initiatives. Ideal candidates bring strong technical expertise and hands-on experience in geospatial systems and software development.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead Operations & Mission Systems Engineer",
        mode: "Full time",
        date: "11/03/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117917/Lead-Operations-Mission-Systems-Engineer",
        summary: "We are expanding our team: As a Lead Operations & Mission Systems Engineer, you will provide operational insight and guidance for Pacific Air Forces, focusing on mission analysis and scenario development. Ideal candidates bring significant military operations experience and expertise in systems engineering within complex, multi-domain environments.",
        locations: [
            "Honolulu, Hawaii, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Agentic Software Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117534/Lead-Agentic-Software-Engineer",
        summary: "Take on the role of Lead Agentic Software Engineer to design, build, and secure mission-focused software systems using agentic and AI-enabled development techniques. Lead system architecture, process improvements, and technical solutions for high-impact projects. Ideal for experienced engineers with strong software engineering fundamentals and hands-on expertise in agentic tools.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            156800,
            196000,
            235200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Software Engineer, TS/SCI w/ Polygraph",
        mode: "Full time",
        date: "09/17/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117517/Lead-Software-Engineer-TS-SCI-w-Polygraph",
        summary: "Exciting opportunity for a Lead Software Engineer to design and develop secure, mission-driven applications for Intelligence Community initiatives. Drive application architecture and collaborate with technical teams to deliver high-quality solutions. Ideal for experienced engineers with a TS/SCI with Polygraph and expertise in secure, full stack development.",
        locations: [
            "Colorado Springs ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            156800,
            196000,
            235200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead Network Engineer",
        mode: "Full time",
        date: "09/15/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117499/Lead-Network-Engineer",
        summary: "Become part of our team as a Lead Network Engineer, driving the design and implementation of secure, resilient network solutions for federal agencies. Lead technical teams, apply advanced networking technologies, and ensure mission security. Ideal for experienced professionals with strong leadership and expertise in enterprise and tactical networking.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Electrical Engineer",
        mode: "Full time",
        date: "09/02/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117276/Electrical-Engineer",
        summary: "Become part of our team as an Electrical Engineer, advancing USAF response to airborne threats by developing and integrating advanced Electronic Warfare capabilities. You will design and test electrical systems, supporting mission effectiveness and security. Ideal candidates bring significant experience in electrical engineering and a strong background in systems engineering.",
        locations: [
            "Hanscom Air Force Base, Massachusetts, United States of America"
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Data Scientist",
        mode: "Full time",
        date: "10/26/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117329/Data-Scientist",
        summary: "Take on the role of Data Scientist to support MITRE’s Acquisition Affordability and Business Analytics Department, focusing on cost estimation, economic modeling, and strategic business analytics. Engage with multidisciplinary teams to deliver actionable insights. Ideal for candidates with strong analytical skills and experience in data science within a collaborative, mission-driven environment.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 2"
    },
    {
        title: "Lead Systems Engineer",
        mode: "Full time",
        date: "09/21/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117573/Lead-Systems-Engineer",
        summary: "Join our team as a Lead Systems Engineer, providing technical leadership in the design and integration of enterprise systems for federal agencies. Drive the application of modern engineering methods and tools, and mentor engineering staff. Ideal for experienced systems engineers with strong technical and leadership skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Principal Cyber Intelligence Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R116700/Principal-Cyber-Intelligence-Engineer",
        summary: "Seeking a Principal Cyber Intelligence Engineer to advance research and innovation in cyber intelligence, lead projects, and collaborate with government and industry partners. Ideal candidates bring extensive experience in cyber intelligence and strong leadership skills.",
        locations: [
            "McLean ",
            "Fort Meade - Annapolis Junction "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "degree >= 1 && experience >= 10"
    },
    {
        title: "Cyber Investigations Engineer – Malware Analysis & Reverse Engineering",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117894/Cyber-Investigations-Engineer-Malware-Analysis-Reverse-Engineering",
        summary: "We are looking for a Cyber Investigations Engineer to provide hands-on expertise in malware analysis and reverse engineering, supporting federal law enforcement and digital investigations. The role involves analyzing malicious software, developing technical solutions, and collaborating with multidisciplinary teams. Ideal candidates have significant experience in malware analysis and strong technical communication skills.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Internships in Computer Science or Software Engineering",
        mode: "Full time",
        date: "11/06/2026",
        family: "[\"Microelectronics Engineering\",\"Computational Social Science\",\"Artificial Intelligence\",\"Student\",\"Human Systems Integration\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117315/Internships-in-Computer-Science-or-Software-Engineering",
        summary: "Join our team as a software or computer science intern, collaborating with experts to apply your academic knowledge in areas such as software development, AI, cybersecurity, and more. Gain hands-on experience while contributing to impactful projects. Ideal for full-time students pursuing a degree in Computer Science or Software Engineering.",
        locations: [
            "Shaw AFB ",
            " 16 "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        experience: "is_student === true"
    },
    {
        title: "Principal Cryptography Engineer – Blockchain Specialist",
        mode: "Full time",
        date: "09/15/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117505/Principal-Cryptography-Engineer-Blockchain-Specialist",
        summary: "Take on the role of Principal Cryptography Engineer – Blockchain Specialist, leading cryptographic research and development for blockchain and digital asset ecosystems. Drive innovation in secure systems and provide expert guidance on cryptography and PQC technologies. Ideal for experienced professionals with deep expertise in cryptography, cybersecurity, and digital assets.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 7) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Lead ATT&CK Engineer",
        mode: "Full time",
        date: "10/27/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117902/Lead-ATT-CK-Engineer",
        summary: "We are seeking a Lead ATT&CK Engineer to advance and support the MITRE ATT&CK® framework, contributing to cyber intelligence research and collaboration. Key responsibilities include authoring and refining knowledge bases and guiding sponsors in building cyber intelligence capabilities. Ideal candidates bring significant experience in cybersecurity and leadership.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Cybersecurity Assessment Engineer",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117846/Lead-Cybersecurity-Assessment-Engineer",
        summary: "Exciting opportunity for a Lead Cybersecurity Assessment Engineer to guide multidisciplinary cyber assessment programs, set direction, and coordinate with sponsors and partners. Ideal for experienced professionals with strong leadership in cybersecurity assessment and a background in risk evaluation.",
        locations: [
            "McLean ",
            "Fort Meade - Annapolis Junction "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Python Engineer – Space Modeling and Simulation",
        mode: "Full time",
        date: "11/06/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117988/Senior-Python-Engineer-Space-Modeling-and-Simulation",
        summary: "We are looking for a Senior Python Engineer to drive advanced space modeling and simulation for national security missions. You will develop and apply modeling tools, collaborate with multidisciplinary teams, and deliver actionable insights. Ideal candidates have significant experience in Python engineering and a strong background in scientific computing.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Tactical Air Dominance Strategic Advisor",
        mode: "Full time",
        date: "11/06/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117776/Tactical-Air-Dominance-Strategic-Advisor",
        summary: "Join us as a Tactical Air Dominance Strategic Advisor, leading the integration and strategic direction of advanced weapon systems for the U.S. Air Force. Drive cross-program collaboration, shape mission outcomes, and connect technical expertise to operational needs. Ideal for experienced leaders in systems engineering or related STEM fields with a strong background in technical and operational leadership.",
        locations: [
            "Wright-Patterson AFB - Fairborn, Ohio, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "SAP",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior Offensive Security Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117889/Senior-Offensive-Security-Engineer",
        summary: "Become part of our team as a Senior Offensive Security Engineer, advancing adversary emulation and cyber threat intelligence. Drive research and development in offensive security, supporting critical projects and government sponsors. Ideal for experienced professionals with strong technical expertise and a passion for national security.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Senior Cyber Intelligence Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R116907/Senior-Cyber-Intelligence-Engineer",
        summary: "Take on the role of Senior Cyber Intelligence Engineer, advancing research and innovation in cyber intelligence for government and private sector sponsors. Lead projects, collaborate across teams, and apply expertise in adversary tradecraft. Ideal for candidates with significant experience in cyber intelligence and strong communication skills.",
        locations: [
            "Fort Meade - Annapolis Junction, Maryland, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Critical Infrastructure Systems Security and Resilience, Principal",
        mode: "Full time",
        date: "08/28/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117267/Critical-Infrastructure-Systems-Security-and-Resilience-Principal",
        summary: "Join our team as a Principal in Critical Infrastructure Systems Security and Resilience, where you will lead a multidisciplinary team to defend national critical infrastructure from evolving cyber threats. Drive technical research, threat analysis, and strategic advisory to enhance operational resilience. Ideal for experienced professionals with deep expertise in ICS, OT, and cyber-physical systems.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Principal Cyber Operations Engineer",
        mode: "Full time",
        date: "10/06/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117209/Principal-Cyber-Operations-Engineer",
        summary: "Take on the role of Principal Cyber Operations Engineer to design and implement advanced cyber and AI-enabled capabilities supporting national security objectives. Lead the development of AI/ML tools for cyber operations and digital investigations. Ideal for experienced professionals with strong expertise in cybersecurity operations, digital forensics, and AI/ML technologies.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Cyber Operations Engineer - TS/SCI",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117816/Cyber-Operations-Engineer-TS-SCI",
        summary: "Take on the role of Lead Cyber Operations Engineer to drive advanced cyber operations and applied research initiatives. Lead technical analysis, prototype development, and deliver trusted solutions for national security. Ideal for experienced engineers with strong software reverse engineering and programming skills.",
        locations: [
            "McLean ",
            "Fort Meade - Annapolis Junction "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 4)"
    },
    {
        title: "Foreign Materiel Strategist",
        mode: "Full time",
        date: "09/28/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117663/Foreign-Materiel-Strategist",
        summary: "Take on the role of Foreign Materiel Strategist, providing technical leadership to modernize the Department of War’s Foreign Materiel Program. Drive strategic analysis and collaborate with government and MITRE teams to enhance operational effectiveness. Ideal for experienced professionals with a strong background in national security and technical strategy.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Identity Cybersecurity Engineer",
        mode: "Full time",
        date: "10/05/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R116574/Identity-Cybersecurity-Engineer",
        summary: "We are recruiting a Identity Cybersecurity Engineer to drive innovation in identity, credential, and access management. You will design and implement secure architectures, lead technical solutions, and collaborate with multidisciplinary teams. Ideal candidates bring significant experience in cybersecurity and a strong background in ICAM technologies.",
        locations: [
            "McLean ",
            "See Sponsor City "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Classified Systems Administrator (Linux)",
        mode: "Full time",
        date: "10/09/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117383/Senior-Classified-Systems-Administrator-Linux",
        summary: "Join us as a Senior Classified Systems Administrator, delivering hands-on system administration and operational support for classified infrastructure managed environments. You will manage system lifecycle activities, ensure security compliance, and collaborate with distributed teams. Ideal candidates bring significant Linux experience and a strong background in system administration within secure, high-stakes settings.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Principal Cost Analyst",
        mode: "Full time",
        date: "10/30/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117056/Principal-Cost-Analyst",
        summary: "Join us as a Principal Cost Analyst to lead cost and economic analyses for government projects, supporting critical economic and financial challenges. Drive data-driven decision-making and collaborate with multidisciplinary teams. Ideal for experienced professionals with strong analytical skills and a background in cost estimation or risk analysis.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            157200,
            196500,
            235800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior Systems Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118011/Senior-Systems-Engineer",
        summary: "Take on the role of Senior Systems Engineer, supporting Army modernization through technical leadership and data-driven recommendations. Guide technical planning, assess contractor solutions, and deliver actionable insights. Ideal for experienced professionals with expertise in systems engineering, AI, and data systems.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Intel Policy, Strategy, and Analyst Intern",
        mode: "Full time",
        date: "11/10/2026",
        family: "[\"Student\",\"Intel Strategy and Policy\"]",
        link: "https://careers.mitre.org/us/en/job/R118015/Intel-Policy-Strategy-and-Analyst-Intern",
        summary: "Become part of our team as an Intel Policy, Strategy, and Analyst Intern, contributing to the development of innovative intelligence solutions. Support technical research and analytical modeling, collaborating with teams to deliver impactful outcomes. Ideal for recent graduates with strong analytical skills and an interest in national security.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            76800,
            96000,
            115200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience < 1) || (experience >= 1 && degree >= 1)"
    },
    {
        title: "Lead AI Assurance Engineer",
        mode: "Full time",
        date: "10/20/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117845/Lead-AI-Assurance-Engineer",
        summary: "We are seeking a Lead AI Assurance Engineer to shape and operationalize AI governance frameworks, ensuring federal AI systems are trustworthy and compliant. You will partner with cross-functional teams to integrate governance into AI development, supporting risk assessments and policy translation. Ideal candidates bring significant AI assurance experience and strong stakeholder engagement skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Bilingual Intel Analyst",
        mode: "Full time",
        date: "10/20/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117804/Senior-Bilingual-Intel-Analyst",
        summary: "Become part of our team as a Senior Bilingual Intel Analyst, supporting the creation of intelligence analysis capabilities for federal agencies. Utilize your SIGINT/RF expertise and Spanish fluency to process and assess intelligence information. Ideal for experienced professionals with a background in intelligence analysis and strong communication skills.",
        locations: [
            "Summit Point, West Virginia, United States of America"
        ],
        salary: [
            116400,
            145500,
            174600
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Senior System Administrator",
        mode: "Full time",
        date: "10/13/2026",
        family: "IT Systems",
        link: "https://careers.mitre.org/us/en/job/R117767/Senior-System-Administrator",
        summary: "Join our team as a Senior System Administrator, supporting the deployment and maintenance of secure, mission-critical IT systems in a classified lab environment. You will manage server and desktop operations, network infrastructure, and system upgrades. Ideal candidates bring significant experience in classified IT administration and a strong understanding of lab IT architecture.",
        locations: [
            "El Segundo, California, United States of America"
        ],
        salary: [
            99200,
            124000,
            148800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Lead SATCOM MS&A Engineer",
        mode: "Full time",
        date: "11/09/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117977/Lead-SATCOM-MS-A-Engineer",
        summary: "Join our team as a Lead SATCOM MS&A Engineer, contributing to advanced research and development in satellite communications. Drive technical innovation and support complex network engineering projects. Ideal for experienced professionals with strong RF communications expertise and a commitment to national security.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead Cleared Intel AI Engineer",
        mode: "Full time",
        date: "09/30/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117664/Lead-Cleared-Intel-AI-Engineer",
        summary: "Join our team as a Lead Cleared Intel AI Engineer, where you will provide technical leadership in applying data analysis and AI techniques to address sponsor missions. Lead the development and evaluation of AI models, and collaborate with teams to deliver impactful solutions. Ideal for candidates with strong AI expertise and relevant experience.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 3) || (degree >= 2 && experience >= 1) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Information Systems, Lead",
        mode: "Full time",
        date: "10/28/2026",
        family: "IT Systems",
        link: "https://careers.mitre.org/us/en/job/R117822/Information-Systems-Lead",
        summary: "Exciting opportunity for a Senior Cloud Operations Engineer to deliver robust cloud operations and user support for AWS-managed environments. Key responsibilities include configuring and troubleshooting AWS infrastructure and developing automation solutions. Ideal for candidates with significant AWS experience and strong technical expertise.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            122400,
            153000,
            183600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Computational Imaging Engineer",
        mode: "Full time",
        date: "09/24/2026",
        family: "Physics",
        link: "https://careers.mitre.org/us/en/job/R117631/Computational-Imaging-Engineer",
        summary: "We are seeking a Computational Imaging Engineer to drive innovation in computer vision and image processing for emerging technologies. You will contribute expertise in optical laboratory experimentation and machine learning, supporting data analysis and integration. Ideal candidates bring experience in optics, machine learning, and laboratory work, with strong communication skills and a commitment to technical excellence.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "experience >= 3 || degree >= 2"
    },
    {
        title: "Decision Analyst, Lead (Intelligence Center)",
        mode: "Full time",
        date: "09/24/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R116594/Decision-Analyst-Lead-Intelligence-Center",
        summary: "Become part of our team as a Decision Analyst, Lead (Intelligence Center) and drive innovative acquisition solutions for the Intelligence Community. Lead the development and implementation of acquisition strategies, ensuring alignment with organizational goals. Ideal for experienced professionals with a strong background in federal acquisition support and a commitment to integrity.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            138800,
            173500,
            208200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Generative AI Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116621/Lead-Generative-AI-Engineer",
        summary: "Exciting opportunity for a Lead Generative AI Engineer to drive the development and deployment of advanced AI solutions for US Government agencies. Lead cross-functional teams, prototype AI/GenAI systems, and deliver innovative solutions to mission-critical challenges. Ideal for experienced professionals with a strong background in AI/GenAI and large language model technology.",
        locations: [
            "Bedford "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Associate AI and Decision Engineer",
        mode: "Full time",
        date: "10/20/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117848/Associate-AI-and-Decision-Engineer",
        summary: "Seeking an Associate AI and Decision Engineer to develop and implement AI-enhanced decision systems, applying expertise in machine learning and decision science. Contribute to mission-critical solutions and collaborate in interdisciplinary teams. Ideal for candidates with hands-on experience in AI, strong communication skills, and a keen interest in advancing artificial intelligence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            97600,
            122000,
            146400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "experience < 1 || degree >= 1"
    },
    {
        title: "Intermediate Applied Mathematician--Communications, Navigation, and Timing Engineering",
        mode: "Full time",
        date: "08/31/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116709/Intermediate-Applied-Mathematician-Communications-Navigation-and-Timing-Engineering",
        summary: "Join us as an Intermediate Applied Mathematician to advance solutions in communications, navigation, and timing engineering. Apply your mathematical expertise to develop and evaluate state-of-the-art navigation and communication technologies. Ideal for candidates with a strong mathematics background and experience in modeling and data analysis.",
        locations: [
            "El Segundo ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "Secret",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 2) || degree >= 2"
    },
    {
        title: "Pursuits and Proposals Lead",
        mode: "Full time",
        date: "11/09/2026",
        family: "Business Development",
        link: "https://careers.mitre.org/us/en/job/R117999/Pursuits-and-Proposals-Lead",
        summary: "Become part of our team as a Pursuits and Proposals Lead, driving strategic execution of priority pursuits and proposals within the Finance sector. Lead project coordination, provide analytical support, and deliver training to finance teams. Ideal for experienced professionals with a strong background in government contracting and proposal management.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            156000,
            195000,
            234000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3) || experience >= 8"
    },
    {
        title: "Senior, Public Health",
        mode: "Full time",
        date: "11/11/2026",
        family: "Health",
        link: "https://careers.mitre.org/us/en/job/R118009/Senior-Public-Health",
        summary: "Join our team as a Senior Public Health subject matter expert, contributing to federal health priorities and supporting evidence-based analysis and strategic guidance. Lead complex health data governance and project management, collaborating with multidisciplinary teams. Ideal for candidates with significant public health experience and strong analytical and stakeholder engagement skills.",
        locations: [
            "Windsor ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            106400,
            133000,
            159600
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "National Intelligence Systems Engineering Task Lead",
        mode: "Full time",
        date: "11/10/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118029/National-Intelligence-Systems-Engineering-Task-Lead",
        summary: "We are looking for a National Intelligence Systems Engineering Task Lead to drive technical direction and support for MITRE’s research objectives. Lead the development of computational frameworks and user interfaces, manage technical teams, and engage with government sponsors. Ideal for experienced engineering professionals with strong leadership and project management skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Enterprise Business Transformation, Lead",
        mode: "Full time",
        date: "09/17/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117307/Enterprise-Business-Transformation-Lead",
        summary: "Join us as an Enterprise Business Transformation Lead, where you will drive strategic initiatives and organizational transformation for complex Department of Veterans Affairs and Defense Health Agency priorities. Lead multidisciplinary teams, engage with senior government stakeholders, and deliver innovative solutions. Ideal for experienced leaders with a background in federal enterprise transformation and strong executive advisory skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "A&SF Center Business Operations Analyst",
        mode: "Full time",
        date: "11/09/2026",
        family: "Business Operations",
        link: "https://careers.mitre.org/us/en/job/R117914/A-SF-Center-Business-Operations-Analyst",
        summary: "We are recruiting an A&SF Center Business Operations Analyst to support program management and operations within MITRE’s Air and Space Forces Center. The role involves reviewing deliverables for compliance, analyzing program progress, and collaborating with stakeholders. Ideal candidates will have significant experience in business operations or program management and a strong understanding of government contract requirements.",
        locations: [
            "Bedford ",
            "Wright-Patterson AFB - Fairborn ",
            "McLean "
        ],
        salary: [
            132000,
            165000,
            198000
        ],
        clearance_current: "Secret",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Defensive Cybersecurity Engineer/SOC SME",
        mode: "Full time",
        date: "11/09/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117994/Defensive-Cybersecurity-Engineer-SOC-SME",
        summary: "Join us as a Defensive Cybersecurity Engineer/SOC SME, providing subject matter expertise to government sponsors in enterprise security operations. Lead threat hunting, develop training content, and apply AI-driven methodologies to enhance SOC capabilities. Ideal for experienced professionals with a strong background in cybersecurity operations and technical training.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Tampa ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Defensive Cybersecurity Engineer/Incident Response",
        mode: "Full time",
        date: "11/09/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117993/Defensive-Cybersecurity-Engineer-Incident-Response",
        summary: "Become part of our team as a Defensive Cybersecurity Engineer/Incident Response, where you will provide subject matter expertise in enterprise security operations and develop practical training for government sponsors. Ideal candidates bring significant operational experience and a strong background in cybersecurity, with a focus on incident response and AI-enabled technologies.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Tampa ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Systems Engineer",
        mode: "Full time",
        date: "11/09/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117987/Systems-Engineer",
        summary: "We are currently hiring a Systems Engineer to provide strategic guidance and technical expertise supporting the Federal Treasury & Tax Administration Division. You will coordinate complex initiatives, collaborate with multidisciplinary teams, and deliver mission-critical outcomes. Ideal candidates bring significant experience in data science, analytics, or AI, and a strong background in technical leadership.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Principal Software Engineer",
        mode: "Full time",
        date: "11/09/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117990/Principal-Software-Engineer",
        summary: "We are seeking a Principal Software Engineer to lead engineering efforts across MITRE’s Enterprise Capabilities, driving the design and operation of advanced software and data systems. This senior role requires deep expertise in software engineering and aviation domain, ideal for candidates with significant experience in high-level programming and a strong background in mission-critical technology.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 0)"
    },
    {
        title: "Finance Intern",
        mode: "Full time",
        date: "11/09/2026",
        family: "Student",
        link: "https://careers.mitre.org/us/en/job/R117462/Finance-Intern",
        summary: "Take on the role of Finance Intern and gain hands-on experience in supporting analytics, financial analysis, and business decision-making. Collaborate with leaders to maximize value for government sponsors. Ideal for students progressing to a BA or BS in Finance, Accounting, or related fields, with strong analytical and Microsoft Office skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "true"
    },
    {
        title: "Associate Network Engineer",
        mode: "Full time",
        date: "11/09/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117727/Associate-Network-Engineer",
        summary: "We are recruiting an Associate Network Engineer to contribute to mission-driven projects in national security and technology. You will develop prototypes, collaborate on innovative solutions, and analyze network data. Ideal for candidates with a bachelor’s degree and at least one year of relevant experience, eager to engage in hands-on, impactful work.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            80400,
            100500,
            120600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1"
    },
    {
        title: "Assistant General Counsel, Labor & Employment",
        mode: "Full time",
        date: "10/06/2026",
        family: "Legal Advisory - Internal",
        link: "https://careers.mitre.org/us/en/job/R117724/Assistant-General-Counsel-Labor-Employment",
        summary: "We are recruiting an Assistant General Counsel, Labor & Employment to provide legal expertise and support across employment law, workplace investigations, and compliance matters. The role involves advising HR on benefits and employee relations, and managing employment-related litigation. Ideal for experienced legal professionals with strong employment law knowledge.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            149200,
            186500,
            223800
        ],
        clearance_current: "None",
        clearance_1y: "Not Applicable",
        experience: "experience >= 5"
    },
    {
        title: "Decision Analyst, Lead",
        mode: "Full time",
        date: "09/24/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117099/Decision-Analyst-Lead",
        summary: "Become part of our team as a Decision Analyst, Lead, where you will provide expert guidance on defense acquisition and innovation. Drive strategic initiatives, deliver data-driven insights, and collaborate with senior stakeholders. Ideal for experienced professionals with a strong background in federal acquisition and a proven track record in thought leadership.",
        locations: [
            "Bedford ",
            "Huntsville ",
            "McLean "
        ],
        salary: [
            138800,
            173500,
            208200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Associate AI Research Engineer",
        mode: "Full time",
        date: "11/03/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117936/Associate-AI-Research-Engineer",
        summary: "We are looking for an Associate AI Research Engineer to advance secure AI systems for national security. You will assess threats, develop AI defense strategies, and integrate solutions into government systems. Ideal candidates have foundational AI knowledge and experience in AI/ML, with strong communication skills and eligibility for a Top Secret/SCI security clearance.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            97600,
            122000,
            146400
        ],
        clearance_current: "Not Applicable",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience < 1)"
    },
    {
        title: "Lead AI and Decision Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116748/Lead-AI-and-Decision-Engineer",
        summary: "Exciting opportunity for a Lead AI and Decision Engineer to drive the development and evaluation of AI-enhanced decision systems. Lead interdisciplinary teams, apply advanced machine learning techniques, and deliver impactful solutions. Ideal for experienced AI professionals with strong technical expertise and leadership skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Systems Engineer, Lead",
        mode: "Full time",
        date: "09/11/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117454/Systems-Engineer-Lead",
        summary: "We are seeking a Lead Systems Engineer to drive high-impact solutions for Department of Defense and Intelligence Community sponsors. Lead mission engineering, architecture development, and technical analysis, collaborating across multidisciplinary teams. Ideal for experienced professionals with expertise in systems engineering and a strong background in government technical environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead Bilingual Intel Analyst",
        mode: "Full time",
        date: "10/20/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117803/Lead-Bilingual-Intel-Analyst",
        summary: "We are looking for a Lead Bilingual Intel Analyst to support intelligence analysis for a federal agency, focusing on SIGINT analysis and Spanish fluency. Key responsibilities include defining intelligence requirements and refining intelligence products. Ideal candidates have significant experience in intelligence analysis and bilingual proficiency.",
        locations: [
            "Summit Point, West Virginia, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Intermediate Systems Engineer",
        mode: "Full time",
        date: "09/21/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117567/Intermediate-Systems-Engineer",
        summary: "We are recruiting an Intermediate Systems Engineer to support the design, implementation, and integration of enterprise systems for federal agencies. You will apply modern engineering methods and tools to assess system capabilities and architecture. Ideal candidates have experience in systems engineering and a strong understanding of mission and enterprise engineering.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            95200,
            119000,
            142800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "experience >= 2"
    },
    {
        title: "Principal Network Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117566/Principal-Network-Engineer",
        summary: "Join our team as a Principal Network Engineer, where you will design, implement, and optimize secure, scalable network environments for federal organizations. You will drive network architecture, automation, and monitoring, collaborating with technical experts. Ideal candidates bring extensive experience in enterprise networking and a strong background in network security.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Principal Space Cyber Engineer",
        mode: "Full time",
        date: "11/11/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117150/Principal-Space-Cyber-Engineer",
        summary: "Become part of our team as a Principal Space Cyber Engineer, leading network and cyber engineering initiatives for resilient space command and control. Drive technical leadership and collaborate with government agencies to deliver advanced cybersecurity solutions. Ideal for experienced professionals with deep expertise in space C2, network architecture, and DoD cyber programs.",
        locations: [
            "Albuquerque, New Mexico, United States of America"
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Systems of Systems Integration Engineering Capability Chief Engineer",
        mode: "Full time",
        date: "10/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117784/Systems-of-Systems-Integration-Engineering-Capability-Chief-Engineer",
        summary: "We are seeking a visionary technical leader to drive the technical strategy and integration of systems of systems engineering at MITRE. Lead technical quality initiatives, mentor staff, and collaborate on mission-critical projects. Ideal for experienced professionals with deep expertise in systems integration and a strong background in complex, multi-stakeholder environments.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            190000,
            237500,
            285000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "SSC/S6 CIO Project Leader",
        locations: [
            "El Segundo, California, United States of America"
        ],
        mode: "Full time",
        date: "10/30/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117933/SSC-S6-CIO-Project-Leader",
				salary: [],
				experience: "true"
    },
    {
        title: "Intel Policy, Strategy, and Analyst",
        mode: "Full time",
        date: "11/12/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117777/Intel-Policy-Strategy-and-Analyst",
        summary: "We are expanding our team: As an Intel Policy, Strategy, and Analyst, you will contribute to modernizing intelligence tools and strategies, supporting the U.S. Intelligence Community. Ideal candidates are recent graduates with strong analytical skills and an interest in national security.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            76800,
            96000,
            115200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience < 1) || (degree >= 1 && experience < 1)"
    },
    {
        title: "Capability Chief Engineer, Microelectronics",
        mode: "Full time",
        date: "11/04/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117874/Capability-Chief-Engineer-Microelectronics",
        summary: "Take on the role of Capability Chief Engineer, Microelectronics to provide technical leadership for microelectronics capabilities within the Signals & Electronics Division. Guide technical strategy, ensure mission relevance, and deliver independent technical judgment. Ideal for experienced engineers with deep expertise in microelectronics and a strong background in ASIC or FPGA design.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            202000,
            252500,
            303000
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "AI Security Engineer",
        mode: "Full time",
        date: "10/27/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116626/AI-Security-Engineer",
        summary: "We are recruiting an AI Security Engineer to assess threats to AI systems and develop secure, data-driven solutions for national security. You will conduct adversarial threat analysis and integrate AI into government systems. Ideal candidates have hands-on AI experience and strong communication skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121600,
            152000,
            182400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Senior SATCOM Lab Engineer",
        mode: "Full time",
        date: "11/09/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117979/Senior-SATCOM-Lab-Engineer",
        summary: "We are expanding our team: As a Senior SATCOM Lab Engineer, you will support lab-based testbeds, conduct field and lab testing, and contribute to system integration and prototype development. Ideal candidates bring significant hands-on experience in SATCOM or RF environments and a strong technical background.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Associate Data Scientist",
        mode: "Full time",
        date: "11/10/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R118007/Associate-Data-Scientist",
        summary: "We are expanding our team: As an Associate Data Scientist, you will apply advanced analytics to government challenges, building data analytic pipelines and collaborating with government sponsors. Ideal candidates have experience with large datasets and analytic tools, and are passionate about impactful research in a dynamic environment.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Huntsville "
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Associate Modeling and Simulation / Operations Research Analyst",
        mode: "Full time",
        date: "11/10/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117949/Associate-Modeling-and-Simulation-Operations-Research-Analyst",
        summary: "We are looking for an experienced Associate Modeling and Simulation / Operations Research Analyst to support critical national security missions. You will develop and apply advanced modeling and simulation tools, collaborating with multidisciplinary teams to address complex challenges. Ideal candidates have a strong foundation in physics, applied mathematics, and object-oriented programming.",
        locations: [
            "Colorado Springs ",
            "Bellevue ",
            "Wright-Patterson AFB - Fairborn ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "Not Applicable",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience < 1) || (degree >= 1 && experience >= 1) || (degree === 0 && experience >= 1)"
    },
    {
        title: "Senior Antenna/Electromagnetics Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R116369/Senior-Antenna-Electromagnetics-Engineer",
        summary: "Take on the role of Senior Antenna/Electromagnetics Engineer, driving innovative solutions in antenna design and electromagnetics. Lead technical projects, develop engineering models, and collaborate with a multidisciplinary team. Ideal for candidates with strong technical expertise and experience in antenna technologies.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || degree >= 2"
    },
    {
        title: "Lead Adversarial AI Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116813/Lead-Adversarial-AI-Engineer",
        summary: "Join our team as a Lead Adversarial AI Engineer, driving the development and integration of secure AI systems to address national security challenges. Lead cross-functional teams in threat analysis and innovation, leveraging advanced AI and cybersecurity expertise. Ideal for experienced professionals with a strong background in AI, security, and technical leadership.",
        locations: [
            "Fort Meade - Annapolis Junction, Maryland, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Artificial Intelligence Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117859/Senior-Artificial-Intelligence-Engineer",
        summary: "We are looking for a Senior Artificial Intelligence Engineer to independently develop and integrate prototype capabilities combining software, data processing, and AI methods. You will design and evaluate data workflows and AI solutions for mission-critical challenges. Ideal candidates have significant experience in AI, software development, and cloud engineering.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Classified Infrastructure Engineer, Manager",
        mode: "Full time",
        date: "10/27/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117910/Classified-Infrastructure-Engineer-Manager",
        summary: "We are expanding our team: As a Principal Engineer in our Classified Infrastructure Services, you will lead and develop a diverse IT team, oversee classified network operations, and ensure the reliability of critical infrastructure. Ideal candidates bring significant leadership experience and expertise in network and system engineering within secure environments.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Associate Data Scientist",
        mode: "Full time",
        date: "11/11/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117791/Associate-Data-Scientist",
        summary: "Exciting opportunity for an Associate Data Scientist to support national security missions by transforming DOJ sponsor data into actionable insights. Collaborate with senior technical staff, apply statistical and data analysis methods, and develop reproducible analyses. Ideal for recent graduates with foundational programming skills and a strong interest in data science.",
        locations: [
            "Bridgeport, West Virginia, United States of America"
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "true"
    },
    {
        title: "Generative AI Engineer",
        mode: "Full time",
        date: "10/19/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117818/Generative-AI-Engineer",
        summary: "Join our team as a Generative AI Engineer, where you will research, develop, and integrate advanced AI solutions to address complex mission needs. Lead cross-functional teams, prototype AI/GenAI systems, and deliver innovative solutions. Ideal candidates bring significant experience in large language model applications and strong technical leadership skills.",
        locations: [
            "See Sponsor City, West Virginia, United States of America"
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Intermediate Bilingual Intel Analyst",
        mode: "Full time",
        date: "10/23/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117812/Intermediate-Bilingual-Intel-Analyst",
        summary: "Join our team as an Intermediate Bilingual Intel Analyst, supporting the creation of intelligence analysis capabilities for a federal agency. Utilize SIGINT analysis and Spanish fluency to process and assess intelligence information. Ideal for candidates with a bachelor’s degree and relevant experience, strong communication skills, and a background in intelligence domains.",
        locations: [
            "Summit Point, West Virginia, United States of America"
        ],
        salary: [
            82800,
            103500,
            124200
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || degree >= 2"
    },
    {
        title: "Associate Autonomous Systems Engineer",
        mode: "Full time",
        date: "09/29/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117618/Associate-Autonomous-Systems-Engineer",
        summary: "We are looking for an Associate Autonomous Systems Engineer to contribute to the development of advanced AI and autonomous systems. You will support robotics and AI projects, working closely with a team of experts. Ideal candidates have a STEM background and experience in robotics or AI, with a strong interest in autonomous technologies.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            97600,
            122000,
            146400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Lead Data Scientist",
        mode: "Full time",
        date: "09/03/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117414/Lead-Data-Scientist",
        summary: "Join us as a Lead Data Scientist to drive advanced analytics and machine learning solutions for critical national challenges. Lead teams in designing data systems and applying AI techniques to solve complex problems. Ideal for experienced professionals with strong data science expertise and hands-on technical skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8)"
    },
    {
        title: "Principal Cybersecurity Architect",
        mode: "Full time",
        date: "11/10/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R118019/Principal-Cybersecurity-Architect",
        summary: "Become part of our team as a Principal Cybersecurity Architect, driving the development and delivery of secure enterprise IT and cloud solutions for government clients. Lead the design of advanced security architectures and collaborate with senior officials to address complex cyber challenges. Ideal for experienced professionals with deep expertise in enterprise security and zero trust principles.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "O’Fallon ",
            "Bedford "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior Modeling and Simulation / Operations Research Analyst",
        mode: "Full time",
        date: "08/28/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117082/Senior-Modeling-and-Simulation-Operations-Research-Analyst",
        summary: "Seeking an experienced Modeling and Simulation / Operations Research Analyst to support critical national security missions. Collaborate with multidisciplinary teams to develop advanced modeling and simulation tools, integrating mathematics, physics, and programming. Ideal for candidates with strong technical expertise and a passion for solving complex challenges in a collaborative environment.",
        locations: [
            "Colorado Springs ",
            "Bellevue ",
            "Wright-Patterson AFB - Fairborn ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Modeling and Simulation Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R118022/Modeling-and-Simulation-Engineer",
        summary: "Become part of our team as a Modeling and Simulation Engineer, leading the development and integration of advanced simulation capabilities for Army Soldier and Weapon Systems. Drive technical excellence and collaborate with senior leaders to deliver impactful solutions. Ideal for experienced professionals with a strong background in systems engineering and software development.",
        locations: [
            "Orlando, Florida, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior Cleared Intel AI Engineer",
        mode: "Full time",
        date: "09/30/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117665/Senior-Cleared-Intel-AI-Engineer",
        summary: "Join us as a Senior Cleared Intel AI Engineer, where you will provide technical leadership in applying data analysis and AI techniques to address sponsor missions. Lead the development and evaluation of AI models, and design data solutions. Ideal for candidates with strong AI expertise and experience in secure, mission-driven environments.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 3) || (degree >= 2 && experience >= 2) || degree === 3"
    },
    {
        title: "Principal Hybrid SATCOM Solution Architect",
        mode: "Full time",
        date: "11/09/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R117978/Principal-Hybrid-SATCOM-Solution-Architect",
        summary: "Become part of our team as a Principal Hybrid SATCOM Solution Architect, driving the development of resilient connectivity solutions for ground, mobility, and aviation applications. Lead technical engagements, collaborate across teams, and shape the future of SATCOM. Ideal for experienced professionals with deep expertise in SATCOM architectures and strong analytical and communication skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 7) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Senior AI Security Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116625/Senior-AI-Security-Engineer",
        summary: "We are currently hiring a Senior AI Security Engineer to assess threats to AI systems and develop secure, data-driven solutions for national security. You will conduct AI adversarial threat analysis and integrate AI solutions into government systems. Ideal candidates have significant AI expertise and experience in security engineering.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Decision Analyst, Principal",
        mode: "Full time",
        date: "08/31/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117256/Decision-Analyst-Principal",
        summary: "Become part of our team as a Decision Analyst, Principal, where you will provide expert guidance on defense acquisition and innovation. Advise senior government officials, drive acquisition modernization, and support strategic initiatives. Ideal for experienced professionals with deep expertise in defense acquisition and a strong background in program management.",
        locations: [
            "Bedford ",
            "Huntsville ",
            "McLean "
        ],
        salary: [
            157200,
            196500,
            235800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Senior Data Scientist",
        mode: "Full time",
        date: "09/03/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117413/Senior-Data-Scientist",
        summary: "Join our team as a Senior Data Scientist to drive impactful solutions in national security, healthcare, and transportation. Lead advanced data science and engineering projects, applying machine learning and AI techniques. Ideal for experienced professionals with strong computer science backgrounds and hands-on expertise in data analytics and engineering.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 5"
    },
    {
        title: "Lead Artificial Intelligence Engineer",
        mode: "Full time",
        date: "10/02/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117689/Lead-Artificial-Intelligence-Engineer",
        summary: "Join our team as a Lead Artificial Intelligence Engineer, driving the development of advanced prototype capabilities for mission-critical AI solutions. Lead technical teams, design complex data integration, and apply advanced analytical methods to address challenging data sources. Ideal for experienced professionals with strong AI, software, and cloud engineering expertise.",
        locations: [
            "McLean ",
            "Springfield "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Autonomous Systems Engineer",
        mode: "Full time",
        date: "10/16/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116645/Senior-Autonomous-Systems-Engineer",
        summary: "We are recruiting a Senior Autonomous Systems Engineer to provide technical leadership in evaluating and improving autonomous systems. Lead cross-functional teams, drive adoption of autonomy and AI technologies, and contribute to high-impact research. Ideal for candidates with significant experience in autonomy and AI, and strong leadership skills.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead Data Engineer, Army NGC2",
        mode: "Full time",
        date: "11/11/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R118033/Lead-Data-Engineer-Army-NGC2",
        summary: "We are looking for an experienced Lead Data Engineer to design and implement secure, scalable data platforms supporting critical national missions. You will lead technical workstreams, develop data solutions, and mentor engineers. Ideal candidates bring advanced data engineering expertise and hands-on experience in distributed systems and cloud-based environments.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8)"
    },
    {
        title: "Industrial Security Manager (DoW CSSO Team Lead)",
        mode: "Full time",
        date: "10/30/2026",
        family: "Security",
        link: "https://careers.mitre.org/us/en/job/R117119/Industrial-Security-Manager-DoW-CSSO-Team-Lead",
        summary: "Exciting opportunity for an experienced leader to provide strategic oversight of Industrial Security operations, managing a team of Security Professionals and ensuring compliance with government security standards. Oversee Special Access and SCI programs, drive operational excellence, and support mission success. Ideal for candidates with significant leadership experience in security operations and government security systems.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            133500,
            167000,
            200500
        ],
        clearance_current: "SAP",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Principal Counterintelligence Analyst",
        mode: "Full time",
        date: "11/06/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117932/Principal-Counterintelligence-Analyst",
        summary: "We are expanding our team: As a Principal Counterintelligence Analyst, you will drive counterintelligence strategy and campaign development, supporting senior government leaders. This role requires deep expertise in HUMINT and counterintelligence, with a strong background in offensive activities. Ideal candidates bring significant experience and a solid understanding of intelligence community operations.",
        locations: [
            "Bethesda, Maryland, United States of America"
        ],
        salary: [
            161600,
            202000,
            242400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Not Applicable",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead OSINT & Data Analyst",
        mode: "Full time",
        date: "11/04/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R117960/Lead-OSINT-Data-Analyst",
        summary: "We are recruiting a Lead OSINT & Data Analyst to drive the identification and evaluation of open-source data for classified missions. You will lead research, analyze complex datasets, and communicate findings to stakeholders. Ideal candidates bring significant experience in intelligence analysis and a strong background in data-driven decision-making.",
        locations: [
            "Bethesda, Maryland, United States of America"
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Information Systems Security Officer (ISSO)",
        mode: "Full time",
        date: "09/22/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117540/Senior-Information-Systems-Security-Officer-ISSO",
        summary: "We are looking for a Senior Information Systems Security Officer to lead cybersecurity efforts for classified systems, ensuring compliance with Risk Management Framework policies. You will develop and monitor security programs and mentor junior staff. Ideal candidates bring significant experience in information assurance and cybersecurity within classified environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Associate Data Scientist",
        mode: "Full time",
        date: "10/22/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117872/Associate-Data-Scientist",
        summary: "We are seeking an Associate Data Scientist to advance and apply innovative data science and analytical techniques to address critical national challenges. You will support the analysis, design, and integration of enterprise systems, leveraging your expertise in data science and systems engineering. Ideal for motivated candidates with a technical background and a passion for impactful work.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            80000,
            100000,
            120000
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience < 1) || experience < 1"
    },
    {
        title: "Senior Generative AI Engineer",
        mode: "Full time",
        date: "11/11/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116622/Senior-Generative-AI-Engineer",
        summary: "We are seeking a Senior Generative AI Engineer to lead the development and deployment of advanced AI solutions supporting critical mission objectives. Drive technical innovation in generative and agentic AI, collaborate with cross-functional teams, and apply state-of-the-art machine learning techniques. Ideal for experienced professionals with a strong background in AI research and prototyping.",
        locations: [
            "Bedford "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Personnel Security Specialist",
        mode: "Full time",
        date: "11/11/2026",
        family: "Security",
        link: "https://careers.mitre.org/us/en/job/R118028/Personnel-Security-Specialist",
        summary: "Become part of our team as a Personnel Security Specialist, supporting employees undergoing vetting for U.S. government agencies. Manage security records, conduct background investigations, and maintain compliance with agency policies. Ideal for candidates with relevant experience and strong attention to detail.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            67600,
            84500,
            101400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 0 && experience >= 3) || (degree >= 1 && experience >= 2)"
    },
    {
        title: "Senior AI and Decision Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116408/Senior-AI-and-Decision-Engineer",
        summary: "Join us as a Senior AI and Decision Engineer, where you will design and implement AI-enhanced decision systems and lead research in artificial intelligence. Collaborate with interdisciplinary teams to solve complex decision problems. Ideal candidates bring significant experience in machine learning and decision science.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Associate Software Engineer",
        mode: "Full time",
        date: "11/11/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R118031/Associate-Software-Engineer",
        summary: "Seeking an Associate Software Engineer to develop software systems addressing critical national challenges. Contribute to software architecture and engineering in a collaborative environment, leveraging modern technologies. Ideal for candidates with hands-on programming skills and a technical degree, seeking to make a meaningful impact.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            79200,
            99000,
            118800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "degree >= 1"
    },
    {
        title: "Lead Artificial Intelligence Engineer (Intelligence Center)",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R115852/Lead-Artificial-Intelligence-Engineer-Intelligence-Center",
        summary: "We are looking for a Lead Artificial Intelligence Engineer to drive innovative solutions and technical strategy for the Intelligence Community. You will provide subject matter expertise in IT architecture and data center management, supporting mission-critical systems. Ideal candidates bring significant experience in AI engineering and a strong background in technical analysis.",
        locations: [
            "Chantilly, Virginia, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Lead AI Security Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116926/Lead-AI-Security-Engineer",
        summary: "Join us as a Lead AI Security Engineer to provide technical leadership in assessing and mitigating threats to AI-enabled systems. Drive research and development of secure AI solutions, collaborating with cross-functional teams. Ideal for experienced AI professionals with strong technical and leadership skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Adversarial AI Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116694/Senior-Adversarial-AI-Engineer",
        summary: "We are looking for a Senior Adversarial AI Engineer to assess threats to AI systems and develop defense strategies for national security. You will conduct technical research, analyze vulnerabilities, and communicate findings to non-technical audiences. Ideal candidates have significant AI experience and strong communication skills.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            143600,
            179500,
            215400
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Senior Data Engineer",
        mode: "Full time",
        date: "09/04/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117438/Senior-Data-Engineer",
        summary: "Become part of our team as a Senior Data Engineer, where you will design and implement secure, scalable data platforms and pipelines to address critical national challenges. You will develop data solutions and collaborate on mission-critical projects. Ideal candidates bring advanced data engineering expertise and hands-on experience in distributed systems and cloud-based environments.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 5"
    },
    {
        title: "National and Defense Intelligence Intern",
        mode: "Full time",
        date: "09/29/2026",
        family: "[\"Student\",\"Intel Strategy and Policy\"]",
        link: "https://careers.mitre.org/us/en/job/R117405/National-and-Defense-Intelligence-Intern",
        summary: "Seeking a National and Defense Intelligence Intern to contribute to impactful projects supporting the U.S. Intelligence Community. Engage in technical research, analytical modeling, and presentations, while developing your skills in national security and intelligence analysis. Ideal for upperclassmen or graduate students with strong academic performance and a keen interest in intelligence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "is_student === true"
    },
    {
        title: "Principal Artificial Intelligence Engineer",
        mode: "Full time",
        date: "10/06/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R117712/Principal-Artificial-Intelligence-Engineer",
        summary: "Join us as a Principal Artificial Intelligence Engineer to set technical direction for advanced AI and data engineering initiatives. Lead multidisciplinary teams, drive research approaches, and influence mission outcomes. Ideal for experienced professionals with deep expertise in AI, software, and cloud engineering.",
        locations: [
            "McLean ",
            "Springfield "
        ],
        salary: [
            191200,
            239000,
            286800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead Cyber Operations Engineer – Secure Communications (TS/SCI)",
        mode: "Full time",
        date: "10/02/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117650/Lead-Cyber-Operations-Engineer-Secure-Communications-TS-SCI",
        summary: "Become part of our team as a Lead Cyber Operations Engineer – Secure Communications, where you will design and develop secure communications systems supporting mission-critical operations. Lead threat modeling and security architecture analysis, and collaborate with multidisciplinary teams. Ideal for experienced professionals in cybersecurity operations and secure communications.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 5) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead Cyber Operations Engineer - Secure Communications -TS/SCI",
        mode: "Full time",
        date: "10/29/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117557/Lead-Cyber-Operations-Engineer-Secure-Communications-TS-SCI",
        summary: "Become part of our team as a Lead Cyber Operations Engineer, driving the development of secure communications and cyber operations solutions. Lead threat modeling, secure communications architecture, and operational analysis. Ideal for experienced professionals with strong technical expertise in cybersecurity operations and secure systems engineering.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 5) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Lead Spectrum Engineer",
        mode: "Full time",
        date: "10/04/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R117654/Lead-Spectrum-Engineer",
        summary: "Join us as a Lead Spectrum Engineer to provide technical leadership and hands-on engineering support for critical weather and environmental sensing missions. Lead complex spectrum engineering projects, analyze radar and spectrum systems, and collaborate with government stakeholders. Ideal for experienced professionals with deep expertise in spectrum engineering and RF systems.",
        locations: [
            "Silver Spring ",
            "McLean "
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Senior Cyber Operations Analyst (TS Cleared)",
        mode: "Full time",
        date: "10/28/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117764/Senior-Cyber-Operations-Analyst-TS-Cleared",
        summary: "Take on the role of Senior Cyber Operations Analyst to lead high-impact cyber threat analysis and provide strategic guidance to senior leaders. Drive proactive research, attribution, and intelligence gathering on cybercriminal activities. Ideal for experienced professionals with strong analytical and communication skills, and a proven ability to work independently in a fast-paced environment.",
        locations: [
            "Spring ",
            "McLean "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree === 1 && experience >= 5) || (degree === 2 && experience >= 3) || (degree === 3 && experience >= 3)"
    },
    {
        title: "DevOps/AI Engineer",
        mode: "Full time",
        date: "11/04/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117488/DevOps-AI-Engineer",
        summary: "Seeking a DevOps/AI Engineer to lead the design and delivery of advanced DevOps and AI/ML capabilities, driving digital transformation for complex technical systems. Key responsibilities include architecting CI/CD pipelines and implementing MLOps workflows. Ideal candidates have hands-on experience in software development and a strong background in DevOps and AI.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            95200,
            119000,
            142800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1) || (degree >= 3 && experience >= 0)"
    },
    {
        title: "Senior Cyber Intelligence Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117887/Senior-Cyber-Intelligence-Engineer",
        summary: "Seeking a Senior Cyber Intelligence Engineer to advance research and innovation in cyber intelligence, supporting government and private sector sponsors. Lead projects, collaborate across teams, and apply expertise in threat analysis. Ideal for candidates with significant experience in cyber intelligence and strong communication skills.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "TSSCI Senior Cyber Intelligence Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117886/TSSCI-Senior-Cyber-Intelligence-Engineer",
        summary: "Exciting opportunity for a Senior Cyber Intelligence Engineer to advance research and innovation in cyber intelligence, supporting government and private sector sponsors. Lead projects, collaborate across teams, and apply expertise in threat analysis. Ideal for candidates with significant experience in cyber intelligence and strong communication skills.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Associate Embedded Security Engineer",
        mode: "Full time",
        date: "09/29/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R115645/Associate-Embedded-Security-Engineer",
        summary: "Seeking an Associate Embedded Security Engineer to develop and conduct security assessments and research on embedded systems. Key responsibilities include hands-on vulnerability research and prototype development. Ideal for candidates with a background in embedded systems and strong programming skills.",
        locations: [
            "Albuquerque ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience < 1) || (experience >= 0 && degree >= 1)"
    },
    {
        title: "GMD TDA Nuclear Survivability Internship",
        mode: "Full time",
        date: "10/27/2026",
        family: "[\"Physics\",\"Student\"]",
        link: "https://careers.mitre.org/us/en/job/R117897/GMD-TDA-Nuclear-Survivability-Internship",
        summary: "Take on the role of a Nuclear Survivability Intern, contributing to modeling and simulation of strategic missile defense systems. Engage in radiation transport analysis and software development. Ideal for students in physics or nuclear engineering with strong programming skills and a commitment to national security.",
        locations: [
            "Bedford ",
            "Huntsville "
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "Principal Space Systems Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118005/Principal-Space-Systems-Engineer",
        locations: [
            "Albuquerque ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead EW Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R118004/Lead-EW-Engineer",
        summary: "We are expanding our team: As a Lead EW Engineer, you will drive innovative solutions to electromagnetic warfare challenges, focusing on both fielded and developmental systems. Lead sponsor engagement and provide expert technical review. Ideal candidates bring significant EW experience and strong technical and analytical skills.",
        locations: [
            "Bedford "
        ],
        salary: [
            147200,
            184000,
            220800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "CNC Machinist",
        mode: "Full time",
        date: "11/10/2026",
        family: "Technical Project Support",
        link: "https://careers.mitre.org/us/en/job/R118014/CNC-Machinist",
        summary: "Become part of our team as a CNC Machinist, contributing to the development and fabrication of advanced electronic prototypes for mission-critical systems. You will work on real-time design changes, prototype production, and collaborate with engineers. Ideal candidates bring hands-on machining experience and a strong understanding of CNC and fabrication technologies.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            70000,
            87500,
            105000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "experience >= 2"
    },
    {
        title: "Associate Software Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R118003/Associate-Software-Engineer",
        summary: "We are currently hiring an Associate Software Engineer to support national security and public safety initiatives. You will contribute to software development and prototyping, working with advanced technologies and collaborating with multidisciplinary teams. Ideal for recent graduates with programming skills and a passion for applied research in computer science or related fields.",
        locations: [
            "Bridgeport, West Virginia, United States of America"
        ],
        salary: [
            79200,
            99000,
            118800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "degree >= 1"
    },
    {
        title: "Senior Sensor Engineer - Huntsville, AL",
        mode: "Full time",
        date: "08/28/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R116641/Senior-Sensor-Engineer-Huntsville-AL",
        summary: "We are seeking a Senior Sensor Engineer to lead the development of innovative sensor solutions within MITRE Labs. Drive technical leadership in sensor design and evaluation, collaborating across teams to address complex sensing challenges. Ideal for candidates with strong sensor technology expertise and experience in programming environments such as MATLAB or Python.",
        locations: [
            "Huntsville, Alabama, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Systems Engineer, Lead",
        mode: "Full time",
        date: "11/09/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118002/Systems-Engineer-Lead",
        summary: "Become part of our team as a Lead Systems Engineer, driving the development of mission architectures and system-of-systems solutions to address critical warfighting challenges. Lead multidisciplinary teams and collaborate with government stakeholders to deliver high-impact engineering solutions. Ideal for experienced professionals with expertise in systems engineering and a strong background in mission engineering.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Complex Systems Engineer",
        mode: "Full time",
        date: "10/13/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117798/Senior-Complex-Systems-Engineer",
        summary: "Seeking a Senior Complex Systems Engineer to develop and apply advanced models and simulations for critical national challenges. Drive impactful research and collaborate with government sponsors to solve complex problems. Ideal for candidates with significant experience in modeling, data analysis, and a strong background in quantitative fields.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            124400,
            155500,
            186600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead Embedded Software Engineer",
        mode: "Full time",
        date: "10/23/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117876/Lead-Embedded-Software-Engineer",
        summary: "We are expanding our team: As a Lead Embedded Software Engineer, you will architect and develop advanced embedded systems supporting national security and critical missions. Lead multidisciplinary teams, drive technical innovation, and mentor junior engineers. Ideal candidates bring significant experience in embedded systems and a strong background in high-performance programming.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Senior Embedded Security Engineer – Digital Systems Security",
        mode: "Full time",
        date: "10/08/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117756/Senior-Embedded-Security-Engineer-Digital-Systems-Security",
        summary: "We are looking for a Senior Embedded Security Engineer to advance secure design and development of embedded systems. You will research new security approaches, build prototypes, and analyze secure implementations. Ideal candidates have significant experience in embedded security and strong technical expertise.",
        locations: [
            "El Segundo ",
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Lead ASIC Design Engineer",
        mode: "Full time",
        date: "08/31/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117338/Lead-ASIC-Design-Engineer",
        summary: "We are seeking a Lead ASIC Design Engineer to architect and develop advanced embedded systems for national security missions. Drive design and integration of ASIC and FPGA solutions, collaborating with multidisciplinary teams. Ideal for experienced engineers with expertise in RTL languages and semiconductor technologies.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            156400,
            195500,
            234600
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6)"
    },
    {
        title: "Senior Embedded Hardware Security Engineer",
        mode: "Full time",
        date: "11/10/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116816/Senior-Embedded-Hardware-Security-Engineer",
        summary: "Become part of our team as a Senior Embedded Hardware Security Engineer, focusing on hands-on security assessments and advanced research in embedded systems. Lead technical initiatives, collaborate with multidisciplinary teams, and mentor junior engineers. Ideal for experienced engineers with expertise in hardware reverse engineering and embedded security.",
        locations: [
            "Bedford "
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3)"
    },
    {
        title: "Digital Investigations Software Engineer",
        mode: "Full time",
        date: "10/14/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117693/Digital-Investigations-Software-Engineer",
        summary: "Exciting opportunity for a Digital Investigations Software Engineer to design, develop, and maintain software supporting complex technical analysis for national security. Key responsibilities include developing scalable workflows and collaborating with technical teams. Ideal for candidates with hands-on software development experience and a strong background in computer science or related fields.",
        locations: [
            "Fort Belvoir, Virginia, United States of America"
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2)"
    },
    {
        title: "Principal 5G/ nextG Cybersecurity Architect",
        mode: "Full time",
        date: "09/22/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117556/Principal-5G-nextG-Cybersecurity-Architect",
        summary: "Become part of our team as a Principal 5G/nextG Cybersecurity Architect, leading the development and implementation of secure, next-generation communications architectures for Federal Government sponsors. Drive innovation in 5G/nextG strategies, leveraging deep expertise in telecommunications, AI, and cybersecurity. Ideal for experienced professionals with a strong background in 5G/nextG and advanced technical leadership.",
        locations: [
            "San Antonio ",
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Cross Domain Solutions Principal Engineer",
        mode: "Full time",
        date: "09/02/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117419/Cross-Domain-Solutions-Principal-Engineer",
        summary: "We are looking for a Cross Domain Solutions Principal Engineer to provide expert technical leadership in cyber security and information system engineering. You will develop requirements, analyze vendor products, and design mission-mitigated security solutions. Ideal candidates bring significant experience in cross-domain solutions and strong expertise in security architecture.",
        locations: [
            "Springfield, Virginia, United States of America"
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Defensive Cybersecurity Engineer/Blue Team",
        mode: "Full time",
        date: "11/09/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117995/Defensive-Cybersecurity-Engineer-Blue-Team",
        summary: "We are looking for a Defensive Cybersecurity Engineer/Blue Team member to design and implement next-generation defensive capabilities using AI and advanced analytics. You will enhance adversary detection and network defense, collaborating with cybersecurity experts. Ideal candidates have significant experience in SOC, threat hunting, or detection engineering.",
        locations: [
            "McLean ",
            "Springfield "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "PAE MS Project Leader",
        mode: "Full time",
        date: "11/09/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117984/PAE-MS-Project-Leader",
        summary: "We are looking for a Project Leader to drive the advancement of Navy nuclear command, control, and communications capabilities. Oversee project execution, lead multidisciplinary teams, and ensure technical excellence. Ideal for experienced professionals with strong leadership in defense systems and sponsor engagement.",
        locations: [
            "San Diego, California, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "degree >= 1"
    },
    {
        title: "Associate Project Leader, Naval Digital Infrastructure & Services",
        mode: "Full time",
        date: "11/09/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117991/Associate-Project-Leader-Naval-Digital-Infrastructure-Services",
        summary: "We are expanding our team: As Associate Project Leader, Naval Digital Infrastructure & Services, you will support the Project Leader in executing a major work program, integrating outcomes across enterprise network and service delivery tasks. Ideal candidates bring significant experience in technical leadership and acquisition environments within the defense sector.",
        locations: [
            "McLean ",
            "Quantico "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Lead Autonomous Systems Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116643/Lead-Autonomous-Systems-Engineer",
        summary: "Become part of our team as a Lead Autonomous Systems Engineer, providing technical leadership in advancing autonomous and AI solutions across critical sectors. Drive innovation in robotics and autonomy, collaborating with cross-functional teams. Ideal for experienced professionals with deep expertise in autonomous systems and a strong background in robotics-relevant fields.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            174000,
            217500,
            261000
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Surface Transportation Strategy and Innovation, Principal",
        mode: "Full time",
        date: "11/12/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R118040/Surface-Transportation-Strategy-and-Innovation-Principal",
        summary: "Exciting opportunity for a senior transportation technologist and strategist to advise federal and state transportation sponsors, shape research agendas, and drive innovation across data infrastructure, automated vehicles, and connected infrastructure. Ideal for candidates with extensive experience in transportation policy and strong technical and advisory expertise.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            191200,
            239000,
            286800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "degree >= 1 && experience >= 10 || degree >= 2 && experience >= 8 || degree === 3 && experience >= 5"
    },
    {
        title: "Project Lead, Army PM IS&A",
        mode: "Full time",
        date: "11/12/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118041/Project-Lead-Army-PM-IS-A",
        summary: "We are expanding our team: As Project Lead, Army PM IS&A, you will drive the development and delivery of advanced intelligence systems and analytics, collaborating with Army and industry partners. This role requires strong experience in systems and digital engineering, with a focus on project leadership and technical expertise.",
        locations: [
            "Aberdeen, Maryland, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree === 3 && experience >= 3)"
    },
    {
        title: "Senior Software Engineer",
        mode: "Full time",
        date: "09/25/2026",
        family: "Software Engineering",
        link: "https://careers.mitre.org/us/en/job/R117515/Senior-Software-Engineer",
        summary: "Join us as a Senior Software Engineer to design, build, and secure mission-focused software systems at MITRE. Lead the development of cloud-native solutions, drive architectural excellence, and collaborate with cross-functional teams. Ideal for experienced engineers with strong Python skills and expertise in distributed systems and DevSecOps.",
        locations: [
            "Colorado Springs ",
            "McLean ",
            "Bedford "
        ],
        salary: [
            129200,
            161500,
            193800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree === 3 && experience >= 1)"
    },
    {
        title: "Space Development Agency Project Leader",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        mode: "Full time",
        date: "10/27/2026",
        family: "Aerospace, Space and Defense Engineering",
        link: "https://careers.mitre.org/us/en/job/R117908/Space-Development-Agency-Project-Leader",
        salary: [],
        experience: "true"
    },
    {
        title: "Lead Systems Engineer",
        mode: "Full time",
        date: "09/17/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117508/Lead-Systems-Engineer",
        summary: "We are expanding our team: As a Lead Systems Engineer, you will drive the design and integration of complex mission systems, applying both Traditional and Model-Based Systems Engineering methods. This role requires significant experience in systems engineering and the ability to collaborate with multidisciplinary teams to deliver impactful solutions for national security missions.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Intermediate Systems Engineer",
        mode: "Full time",
        date: "10/12/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117775/Intermediate-Systems-Engineer",
        summary: "Become part of our team as an Intermediate Systems Engineer, supporting the design, implementation, and integration of enterprise systems for federal agencies. Apply systems engineering expertise and modern tools to assess requirements and architecture. Ideal for candidates with experience in systems engineering and a strong background in quantitative analysis.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            95200,
            119000,
            142800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1) || degree === 3"
    },
    {
        title: "Senior Embedded Software Engineer",
        mode: "Full time",
        date: "08/28/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116321/Senior-Embedded-Software-Engineer",
        summary: "Join our team as a Senior Embedded Software Engineer to lead the design and prototyping of advanced embedded systems for national security and defense. Drive technical solutions, mentor junior engineers, and collaborate on multidisciplinary projects. Ideal for experienced professionals with strong embedded software expertise and a commitment to high-performance programming.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            126800,
            158500,
            190200
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || (degree >= 3 && experience >= 1)"
    },
    {
        title: "Chief Engineer, Defensive Cyber Operations",
        mode: "Full time",
        date: "10/12/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117575/Chief-Engineer-Defensive-Cyber-Operations",
        summary: "We are expanding our team: As Chief Engineer, Defensive Cyber Operations, you will lead technical strategy and development for Security Operations Centers, threat hunting, and analytics. This senior role requires deep expertise in defensive cyber operations and proven leadership in complex, multi-stakeholder environments.",
        locations: [
            "Colorado Springs ",
            "Bedford "
        ],
        salary: [
            205500,
            257000,
            308500
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "Intermediate Cybersecurity Automation & Assessment Engineer",
        mode: "Full time",
        date: "11/11/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R118035/Intermediate-Cybersecurity-Automation-Assessment-Engineer",
        summary: "We are looking for an Intermediate Cybersecurity Automation & Assessment Engineer to conduct cybersecurity assessments and develop automation tools. You will analyze security events, support vulnerability management, and collaborate with technical teams. Ideal candidates have experience in automation, security assessment, and scripting languages.",
        locations: [
            "Fort Meade - Annapolis Junction ",
            "McLean "
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Intermediate Data Scientist",
        mode: "Full time",
        date: "11/12/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117998/Intermediate-Data-Scientist",
        summary: "We are expanding our team: As an Intermediate Data Scientist, you will transform Department of Justice sponsor data into actionable insights, supporting national security missions. Collaborate with senior staff, apply data analysis and coding skills, and contribute to mission-critical projects. Ideal for recent master's graduates with foundational programming experience and a strong analytical mindset.",
        locations: [
            "Washington ",
            "McLean "
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "true"
    },
    {
        title: "Associate Cloud Developer",
        mode: "Full time",
        date: "11/12/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R117424/Associate-Cloud-Developer",
        summary: "Exciting opportunity for an Associate Cloud Developer to support critical cloud computing and DevOps projects. Contribute to developing and deploying full stack web applications and managing cloud environments. Ideal for candidates with a background in computer science or related fields and hands-on experience in cloud platforms and modern software development.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            79200,
            99000,
            118800
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "degree >= 1"
    },
    {
        title: "Principal Telecommunications Network Architect",
        mode: "Full time",
        date: "11/12/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R118023/Principal-Telecommunications-Network-Architect",
        summary: "Seeking a senior technical leader to provide expert guidance on telecommunications carrier core, backbone, and service architectures supporting national security and critical infrastructure. Lead mission-driven engineering analysis and technical leadership. Ideal for candidates with extensive experience in carrier network engineering and a strong background in telecommunications infrastructure.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "None",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 7) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Principal Systems Engineer",
        mode: "Full time",
        date: "11/02/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117942/Principal-Systems-Engineer",
        summary: "We are expanding our team: As a Principal Systems Engineer, you will provide technical leadership for national security initiatives, focusing on sensor integration and enterprise-level system evolution. You will analyze complex mission challenges and collaborate with multidisciplinary teams. Ideal candidates bring extensive experience in systems engineering and a strong background in mission and enterprise integration.",
        locations: [
            "McLean ",
            "Springfield "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Lead Data Engineer",
        mode: "Full time",
        date: "09/04/2026",
        family: "Data Science and Analytics",
        link: "https://careers.mitre.org/us/en/job/R117439/Lead-Data-Engineer",
        summary: "We are recruiting a Lead Data Engineer to design and implement secure, scalable data platforms and pipelines for critical national missions. You will develop data solutions, manage data governance, and mentor engineers. Ideal candidates bring advanced data engineering expertise and hands-on experience in distributed systems and cloud-based environments.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 8"
    },
    {
        title: "Modeling and Simulation Mission Engineer",
        mode: "Full time",
        date: "11/12/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R118034/Modeling-and-Simulation-Mission-Engineer",
        summary: "We are seeking a Lead Modeling and Simulation Mission Engineer to drive advanced modeling and simulation initiatives supporting national security missions. Collaborate with multidisciplinary teams to develop and apply analytical tools, addressing complex technical challenges. Ideal for experienced professionals with expertise in modeling, simulation, and operational analysis.",
        locations: [
            "McLean ",
            "Fort Eustis "
        ],
        salary: [
            155200,
            194000,
            232800
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Cyber Threat Intelligence Group Leader",
        mode: "Full time",
        date: "11/05/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117582/Cyber-Threat-Intelligence-Group-Leader",
        summary: "Become part of our team as a Cyber Threat Intelligence Group Leader, overseeing staff management and driving departmental excellence. Lead a team of professionals in delivering advanced cyber threat intelligence, with a focus on quality and continuous improvement. Ideal for experienced leaders with a strong background in cyber operations and team development.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            158800,
            198500,
            238200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "degree >= 1 && experience >= 7"
    },
    {
        title: "Lead Cloud Engineer",
        mode: "Full time",
        date: "11/12/2026",
        family: "Computer Science",
        link: "https://careers.mitre.org/us/en/job/R118044/Lead-Cloud-Engineer",
        summary: "We are recruiting a Lead Cloud Engineer to drive architectural and hands-on solutions for critical cloud computing and DevOps challenges. Lead the identification and resolution of infrastructure vulnerabilities, collaborate with development teams, and provide technical guidance. Ideal for experienced cloud professionals with strong DevOps expertise.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            144800,
            181000,
            217200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Operational Technology Cyber Threat Intelligence, Principal",
        mode: "Full time",
        date: "11/03/2026",
        family: "Cyber Security",
        link: "https://careers.mitre.org/us/en/job/R117961/Operational-Technology-Cyber-Threat-Intelligence-Principal",
        summary: "Seeking an Operational Technology Cyber Threat Intelligence Lead to analyze adversary behavior and support automated threat emulation in critical infrastructure. Key responsibilities include translating threat intelligence into technical requirements and advising on threat-informed defense strategies. Ideal for experienced professionals in OT, ICS, or SCADA environments with strong threat modeling expertise.",
        locations: [
            "Colorado Springs ",
            "Huntsville ",
            "Bedford "
        ],
        salary: [
            172800,
            216000,
            259200
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Electrical Engineer—Power Systems and Energy Resilience",
        mode: "Full time",
        date: "11/12/2026",
        family: "Electrical Engineering",
        link: "https://careers.mitre.org/us/en/job/R118030/Electrical-Engineer—Power-Systems-and-Energy-Resilience",
        summary: "Become part of our team as an Electrical Engineer, focusing on power systems and energy resilience. Lead the evaluation and design of electrical power generation and distribution systems, collaborating with multidisciplinary teams. Ideal for experienced engineers with deep expertise in power electronics and a commitment to technical excellence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            118000,
            147500,
            177000
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Strategic Industry Engagement Coordinator",
        mode: "Full time",
        date: "11/12/2026",
        family: "Intel Strategy and Policy",
        link: "https://careers.mitre.org/us/en/job/R118047/Strategic-Industry-Engagement-Coordinator",
        summary: "Become part of our team as a Strategic Industry Engagement Coordinator, supporting government sponsors in translating Super Intelligence concepts into actionable strategies. Drive policy and mission integration, and provide senior decision support. Ideal for candidates with experience in SI concepts and strong communication skills.",
        locations: [
            "Austin, Texas, United States of America"
        ],
        salary: [
            82800,
            103500,
            124200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 2) || (experience >= 2)"
    },
    {
        title: "Senior Systems Engineer",
        mode: "Full time",
        date: "10/28/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117511/Senior-Systems-Engineer",
        summary: "We are looking for a Senior Systems Engineer to drive the design and integration of complex mission systems for national security. You will apply both traditional and model-based systems engineering methods, collaborating with multidisciplinary teams. Ideal candidates bring significant experience in systems engineering and a strong understanding of mission-focused environments.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            121200,
            151500,
            181800
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 5) || (degree >= 2 && experience >= 3) || degree === 3"
    },
    {
        title: "Systems Engineering Methods & Innovation Capability Chief Engineer",
        mode: "Full time",
        date: "10/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117785/Systems-Engineering-Methods-Innovation-Capability-Chief-Engineer",
        summary: "Become part of our team as the Systems Engineering Methods & Innovation Capability Chief Engineer, leading the development and application of advanced systems engineering methods and innovation. Drive technical strategy, mentor staff, and collaborate across divisions to deliver impactful solutions. Ideal for a visionary technical leader with deep expertise in systems engineering and a strong record of strategic influence.",
        locations: [
            "San Diego ",
            "Colorado Springs ",
            "Huntsville ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            190000,
            237500,
            285000
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 12) || (degree >= 2 && experience >= 10) || (degree >= 3 && experience >= 7)"
    },
    {
        title: "Intermediate Communications Systems Engineer",
        mode: "Full time",
        date: "11/12/2026",
        family: "Imaging and Communication Engineering",
        link: "https://careers.mitre.org/us/en/job/R118046/Intermediate-Communications-Systems-Engineer",
        summary: "Become part of our team as an Intermediate Communications Systems Engineer, contributing to the design and development of advanced wireless communications systems for U.S. Government agencies. Engage in systems engineering, RF communications, and networking, collaborating with multidisciplinary teams. Ideal for candidates with a bachelor’s degree and relevant experience in engineering.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Autonomous Systems Engineer",
        mode: "Full time",
        date: "10/16/2026",
        family: "Artificial Intelligence",
        link: "https://careers.mitre.org/us/en/job/R116644/Autonomous-Systems-Engineer",
        summary: "We are currently hiring a Autonomous Systems Engineer to drive the adoption of autonomous and AI solutions across critical sectors. You will evaluate and improve AI/autonomy system performance, provide thought leadership, and contribute to high-impact research. Ideal candidates have hands-on expertise in autonomy, robotics, and AI, with strong communication skills and a commitment to technical excellence.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            121600,
            152000,
            182400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 1)"
    },
    {
        title: "Associate Embedded Software Engineer",
        mode: "Full time",
        date: "11/11/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R117857/Associate-Embedded-Software-Engineer",
        summary: "We are currently hiring an Associate Embedded Software Engineer to design and prototype advanced embedded systems for national security applications. You will work on real-time communication and sensor systems, collaborating with cross-disciplinary teams. Ideal for candidates with foundational embedded software experience and strong programming skills.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            89200,
            111500,
            133800
        ],
        clearance_current: "Secret",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience < 1) || (degree >= 2 && experience < 3)"
    },
    {
        title: "USAFE Joint Fires Systems Engineer",
        mode: "Full time",
        date: "11/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117965/USAFE-Joint-Fires-Systems-Engineer",
        summary: "We are currently hiring a USAF Joint Fires Systems Engineer to provide operational insight and guidance for USAFE-AFAFRICA’s mission. You will lead the planning and integration of advanced operational concepts, collaborating with military and government partners. Ideal candidates bring significant experience in joint military operations and systems engineering.",
        locations: [
            "Ramstein Air Base, Germany"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Principal Quantitative Researcher - Finance",
        mode: "Full time",
        date: "10/07/2026",
        family: "Computational Social Science",
        link: "https://careers.mitre.org/us/en/job/R117745/Principal-Quantitative-Researcher-Finance",
        summary: "Join our team as a Principal Quantitative Researcher - Finance, where you will provide expert analysis and consulting to federal government clients, transforming technologic and regulatory processes to enhance financial stability. Ideal candidates bring significant expertise in financial market analysis and computational finance, with a strong academic background and experience in multidisciplinary research environments.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            173200,
            216500,
            259800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree >= 3 && experience >= 5)"
    },
    {
        title: "Principal Systems Engineer",
        mode: "Full time",
        date: "09/17/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117510/Principal-Systems-Engineer",
        summary: "Take on the role of Principal Systems Engineer to define, design, and integrate complex mission systems for national security. Lead system architecture and technical transitions, collaborating with multidisciplinary teams. Ideal for experienced professionals with strong systems engineering expertise and a commitment to mission-critical solutions.",
        locations: [
            "Chantilly ",
            "McLean "
        ],
        salary: [
            162400,
            203000,
            243600
        ],
        clearance_current: "Top Secret/SCI/Polygraph",
        clearance_1y: "Top Secret/SCI/Polygraph",
        experience: "(degree >= 1 && experience >= 10) || (degree >= 2 && experience >= 8) || (degree === 3 && experience >= 5)"
    },
    {
        title: "Decision Analyst",
        mode: "Full time",
        date: "09/24/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117603/Decision-Analyst",
        summary: "Become part of our team as a Decision Analyst, supporting critical economic and financial challenges for government sponsors. Lead teams in cost and decision analysis, develop models, and engage with sponsors to deliver data-driven insights. Ideal for experienced professionals with strong analytical skills and a background in cost estimation or budgeting.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            138800,
            173500,
            208200
        ],
        clearance_current: "None",
        clearance_1y: "Top Secret",
        experience: "experience >= 8"
    },
    {
        title: "Intermediate Modeling and Simulation / Operations Research Analyst",
        mode: "Full time",
        date: "11/04/2026",
        family: "Operations Research",
        link: "https://careers.mitre.org/us/en/job/R117676/Intermediate-Modeling-and-Simulation-Operations-Research-Analyst",
        summary: "We are looking for an experienced Modeling and Simulation / Operations Research Analyst to support critical national security missions. You will develop and apply advanced modeling and simulation tools, collaborating with multidisciplinary teams to address complex challenges. Ideal candidates have strong technical expertise and a passion for innovation in a collaborative environment.",
        locations: [
            "Colorado Springs ",
            "Bellevue ",
            "Wright-Patterson AFB - Fairborn ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            98800,
            123500,
            148200
        ],
        clearance_current: "Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 2)"
    },
    {
        title: "Intermediate Systems Engineer",
        mode: "Full time",
        date: "11/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R117825/Intermediate-Systems-Engineer",
        summary: "Seeking an Intermediate Systems Engineer to support government sponsors in architecting and integrating complex mission systems. Contribute to model-based engineering and digital transformation initiatives. Ideal for experienced engineers with strong systems engineering expertise and a passion for innovative solutions.",
        locations: [
            "Bedford ",
            "McLean "
        ],
        salary: [
            95200,
            119000,
            142800
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || degree >= 2"
    },
    {
        title: "Lead Project Management Specialist",
        mode: "Full time",
        date: "08/28/2026",
        family: "Acquisition Analysis",
        link: "https://careers.mitre.org/us/en/job/R117240/Lead-Project-Management-Specialist",
        summary: "Become part of our team as a Lead Project Management Specialist, driving project leadership and managing end-to-end project planning for MITRE’s federally funded initiatives. Oversee project schedules, risk management, and communications, leveraging your expertise in project management and AI applications. Ideal for experienced professionals with strong leadership and technical skills.",
        locations: [
            "Bedford "
        ],
        salary: [
            138800,
            173500,
            208200
        ],
        clearance_current: "Top Secret/SCI",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Modeling, Simulation, and Analysis Intern",
        mode: "Full time",
        date: "09/03/2026",
        family: "[\"Data Science and Analytics\",\"Systems Engineering\",\"Physics\",\"Student\",\"Aerospace, Space and Defense Engineering\",\"Operations Research\",\"Mechanical Engineering\",\"Software Engineering\"]",
        link: "https://careers.mitre.org/us/en/job/R117401/Modeling-Simulation-and-Analysis-Intern",
        summary: "Become part of our team as a Modeling, Simulation, and Analysis Intern, contributing to complex technical and operational challenges. Support modeling, simulation, and data analysis, collaborating with interdisciplinary teams. Ideal for students in relevant fields with strong academic performance and a passion for applied research.",
        locations: [
            "McLean, Virginia, United States of America"
        ],
        salary: [
            46500,
            58000,
            69500
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "is_student === true"
    },
    {
        title: "NLCC Systems Engineer, Lead",
        mode: "Full time",
        date: "11/13/2026",
        family: "Systems Engineering",
        link: "https://careers.mitre.org/us/en/job/R118043/NLCC-Systems-Engineer-Lead",
        summary: "Join us as a Lead Systems Engineer, contributing to the DISA/CIO Department’s NLCC Project. Drive operational employment of classified NLCC services, support mission-critical communications, and collaborate with government leadership. Ideal for experienced systems engineers with strong technical expertise and leadership skills.",
        locations: [
            "Fort Meade - Annapolis Junction, Maryland, United States of America"
        ],
        salary: [
            146400,
            183000,
            219600
        ],
        clearance_current: "Top Secret",
        clearance_1y: "Top Secret/SCI",
        experience: "(degree >= 1 && experience >= 8) || (degree >= 2 && experience >= 6) || (degree >= 3 && experience >= 3)"
    },
    {
        title: "Intermediate Embedded Software Engineer",
        mode: "Full time",
        date: "11/13/2026",
        family: "Microelectronics Engineering",
        link: "https://careers.mitre.org/us/en/job/R116666/Intermediate-Embedded-Software-Engineer",
        summary: "Seeking an Intermediate Embedded Software Engineer to design and prototype advanced embedded systems for national security and defense projects. Collaborate with cross-disciplinary teams on real-time communication and sensor systems. Ideal for candidates with strong C/C++ skills and experience in embedded systems.",
        locations: [
            "Bedford, Massachusetts, United States of America"
        ],
        salary: [
            103600,
            129500,
            155400
        ],
        clearance_current: "None",
        clearance_1y: "Secret",
        experience: "(degree >= 1 && experience >= 2) || (degree >= 2 && experience >= 2)"
    },
    {
        title: "Lead, Health Program Analysis and Transformation",
        mode: "Full time",
        date: "11/13/2026",
        family: "Health",
        link: "https://careers.mitre.org/us/en/job/R118012/Lead-Health-Program-Analysis-and-Transformation",
        summary: "We are expanding our team: As Lead, Health Program Analysis and Transformation, you will drive evidence-based analysis and strategic guidance to strengthen public health outcomes. Lead complex health data governance and program evaluation, collaborating with multidisciplinary teams. Ideal for experienced professionals with expertise in health research and program management.",
        locations: [
            "Windsor ",
            "Bedford ",
            "McLean "
        ],
        salary: [
            132800,
            166000,
            199200
        ],
        clearance_current: "None",
        clearance_1y: "None",
        experience: "(degree >= 1 && experience >= 7) || (degree >= 2 && experience >= 5)"
    }
]

export { mitreJobs, type JobPosting };