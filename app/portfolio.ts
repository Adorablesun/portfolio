// Replace sample content with your details and actual multimedia projects.
export const portfolio = {
  name: 'Ong Yu Yang',
  intro: 'Exploring the space between visual identity, moving images, and digital experiences.',
  about: 'I’m Ong Yu Yang, a student at Asia Pacific University, currently in Year 3, Semester 2 through January 2027. My journey also includes an internship at ZTE Corporation Malaysia. I explore multimedia through visual identity, moving images, and digital experiences.',
  email: '',
  disciplines: ['Visual identity', 'Motion & video', 'Editorial design', 'Digital experiences'],
};
export const academicJourney = [
  { stage: 'Primary education', name: 'SJK(C) Kong Hoe', description: 'Primary school.', current: false },
  { stage: 'Secondary education', name: 'SM Pinhwa High School', description: 'Secondary school.', current: false },
  { stage: 'University', name: 'Asia Pacific University', description: 'Year 3, Semester 2', detail: 'Current semester through January 2027.', current: true },
  { stage: 'Industry experience', name: 'ZTE Corporation Malaysia', description: 'Internship', current: false },
];
// Aspirations, not completed qualifications or scheduled roles.
export const futureJourney = [
  { stage: 'First ambition', name: 'UI / UX design', description: 'Design digital products that are intuitive, accessible, and a pleasure to use.', focus: 'User research · Interaction design · Prototyping', project: 'Build a research-led app case study, from interviews and user flows to a tested prototype.' },
  { stage: 'Next exploration', name: 'Immersive AR / VR', description: 'Take experiences beyond the screen, into spaces people can move through and interact with.', focus: 'Spatial interfaces · 3D storytelling · XR prototyping', project: 'Prototype an immersive exhibition or an AR experience with a clear, useful interaction.' },
  { stage: 'Then, new possibilities', name: 'AI-assisted experiences', description: 'Explore how AI can support creativity and help people accomplish something meaningful.', focus: 'Human–AI interaction · Generative media · Responsible design', project: 'Design an AI creative assistant that gives people clear control, useful feedback, and room to revise.' },
  { stage: 'Long-term direction', name: 'Creative technology & leadership', description: 'Bring design, immersive media, and AI together to lead thoughtful experiences across disciplines.', focus: 'Art direction · Experience strategy · Collaboration', project: 'Lead a collaborative concept that combines a strong story, purposeful interaction, and a distinctive visual identity.' },
];
export const projects = [
  { id: 'form', title: 'Form / in motion', category: 'ART DIRECTION · MULTIMEDIA', label: 'CONCEPT ARTWORK', style: 'form-cover', image: '/images/form-study.png', description: 'A sample visual study exploring form, material, and colour.', finalPrompt: 'Add the final artwork and relevant close-ups. If this becomes an animation, include a captioned video with playback controls.' },
  { id: 'frame', title: 'Frame by frame', category: 'MOTION · VIDEO', label: 'TYPOGRAPHY STUDY', style: 'frame-cover', coverTop: 'A STUDY IN RHYTHM', coverTitle: 'Frame\nby frame.', coverBottom: 'STILL → SEQUENCE → STORY', description: 'A sample cover for a motion piece, short film, or video project.', finalPrompt: 'Embed your video with controls, captions or a transcript, and a poster frame. Add selected storyboard frames.' },
  { id: 'type', title: 'Beyond the page', category: 'GRAPHIC · EDITORIAL', label: 'LAYOUT STUDY', style: 'editorial-cover', coverTop: 'EXPERIMENTS IN TYPE / VOL. 01', coverTitle: 'Aa\nBb', coverBottom: 'BEYOND THE PAGE', description: 'A sample cover for an identity, publication, or graphic design project.', finalPrompt: 'Add layouts, type details, and real applications of the design. Explain the visual system and your choices.' },
];
