import {
  h2,
  freelance,
  tridchinese,
  tridmusic,
  tridos,
  thanhkim,
  layer1,
  layer10,
  layer2,
  layer3,
  layer4,
  layer5,
  layer6,
  layer7,
  layer8,
  layer9,
  kimtruongphuc,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About me",
  },
  {
    id: "work",
    title: "Công việc",
  },
  {
    id: "contact",
    title: "Liên hệ tôi",
  },
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
      "Design , Edit Video and Image,Contents... ",
    ],
  },
  {
    title: "Developer",
    company_name: "Freelancer",
    icon: freelance,
    iconBg: "#383e56",
    date: "May 2021 - Now",
    points: [
      "Participate in front-end, back-end and full-stack development projects",
      " I bring extensive experience in delivering high-quality tech solutions, effectively managing projects, and meeting diverse client needs. My work spans across software development, system maintenance, and customized tech support, consistently achieving client satisfaction through efficient and innovative approaches..",
    ],
  },
];
const projects = [
  {
    name: "Social Media Auto-Poster",
    description:
      "An automated content scheduling & cross-posting platform designed to streamline real estate marketing. Reduces manual posting effort by automating scheduled publication, media management, and multi-channel campaign tracking.",
    tags: [
      {
        name: "React Native",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "AI Agent",
        color: "pink-text-gradient",
      },
    ],
    image: thanhkim,
    source_code_link: "https://github.com/JakePaul94/thanhkimbds",
  },
  {
    name: "Boiler & Facility Management",
    description:
      "An enterprise system for industrial boiler operations and maintenance. Features preventative inspection workflows, location-based cleaning tasks, water quality testing with photo reports, on-site QR scanning, and role-based access control.",
    tags: [
      {
        name: "React Native",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "sql",
        color: "white-text-gradient",
      },
    ],
    image: kimtruongphuc,
    source_code_link: "https://github.com/JakePaul94/kimtruongphuc_server",
  },
  {
    name: "TriD - OS",
    description:
      "An AI operating system: a network of AI agents plus a framework that connects and orchestrates them, adaptable to almost any use case on every platform (web, mobile app).",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Python",
        color: "green-text-gradient",
      },
      {
        name: "React Native",
        color: "pink-text-gradient",
      },
    ],
    image: tridos,
  },{
  name: "Learn Chinese",
  description:
    "A React Native (Expo) app for learning Chinese: look up words in a built-in dictionary, view word details, and save words into custom study groups.",
  tags: [
    {
      name: "React Native",
      color: "blue-text-gradient",
    },
    {
      name: "Expo",
      color: "green-text-gradient",
    },
    {
      name: "Android",
      color: "pink-text-gradient",
    },
  ],
  image: tridchinese,
},
{
  name: "Music Player",
  description:
    "A React Native (Expo) music player for Android with a sleep timer, backed by native Android code for reliable background playback.",
  tags: [
    {
      name: "React Native",
      color: "blue-text-gradient",
    },
    {
      name: "Expo",
      color: "green-text-gradient",
    },
    {
      name: "Android",
      color: "pink-text-gradient",
    },
  ],
  image: tridmusic,
},
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
  { id: 10, img: layer10 },
];
export { experiences, projects, loadings };
