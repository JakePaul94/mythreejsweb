import {
  h2,
  freelance,
  carrent,
  jobit,
  tripguide,
  layer1,
  layer10,
  layer2,
  layer3,
  layer4,
  layer5,
  layer6,
  layer7,
  layer8,
  layer9
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About me"
  },
  {
    id: "work",
    title: "Công việc"
  },
  {
    id: "contact",
    title: "Liên hệ tôi"
  }
];

const experiences = [
  {
    title: "Developer - Designer",
    company_name: " H2 Financial",
    icon: h2,
    iconBg: "#383e56",
    date: "November 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Design , Edit Video and Image,Contents... "
    ]
  },
  {
    title: "Developer",
    company_name: "Freelancer",
    icon: freelance,
    iconBg: "#383e56",
    date: "May 2021 - Now",
    points: [
      "Participate in front-end, back-end and full-stack development projects",
      " I bring extensive experience in delivering high-quality tech solutions, effectively managing projects, and meeting diverse client needs. My work spans across software development, system maintenance, and customized tech support, consistently achieving client satisfaction through efficient and innovative approaches.."
    ]
  }
];

const projects = [
  {
    name: "Trinhdc.id.vn",
    description:
      "My portfolio web - use Blender for model , threejs for WebGL and Vite js for UI ...",
    tags: [
      {
        name: "Vite",
        color: "blue-text-gradient"
      },
      {
        name: "NextJs",
        color: "green-text-gradient"
      },
      {
        name: "blender",
        color: "pink-text-gradient"
      }
    ],
    image: carrent,
    source_code_link: "https://trinhdc.id.vn/"
  },
  {
    name: "autoTool",
    description:
      "Desktop application allows users to automatically upload videos, interact on Youtube, Reels, Tiktok platforms, automatically create Facebook satellite pages. Integrate channel analysis, videos and batch video editing.",
    tags: [
      {
        name: "electron",
        color: "blue-text-gradient"
      },
      {
        name: "Python",
        color: "green-text-gradient"
      },
      {
        name: "react",
        color: "pink-text-gradient"
      }
    ],
    image: jobit,
    source_code_link: "https://github.com/"
  },
  {
    name: "Apple English ",
    description:
      "A multi-platform English learning app for kids offers a fun, engaging, and interactive experience, helping children improve their vocabulary, grammar, and communication skills through games, visual lessons, and exciting quizzes. Suitable for various age groups, the app is available on both mobile devices and computers, allowing kids to learn anytime, anywhere with ease and efficiency.",
    tags: [
      {
        name: "Expo",
        color: "blue-text-gradient"
      },
      {
        name: "SQLite",
        color: "green-text-gradient"
      },
      {
        name: "React Native",
        color: "pink-text-gradient"
      }
    ],
    image: tripguide,
    source_code_link: "https://github.com/"
  }
];

const loadings = [
  { id: 1, img: layer1 },
  { id: 2, img: layer2 },
  { id: 3, img: layer3 },
  { id: 4, img: layer4 },
  { id: 5, img: layer5 },
  { id: 6, img: layer6 },
  { id: 7, img: layer7 },
  { id: 8, img: layer8 },
  { id: 9, img: layer9 },
  { id: 10, img: layer10 }
];
export { experiences, projects, loadings };
