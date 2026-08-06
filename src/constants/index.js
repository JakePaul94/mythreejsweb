import {
  h2,
  freelance,
  carrent,
  jobit,
  tridos,
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
    title: "Lập trình viên - Thiết kế",
    company_name: " H2 Financial",
    icon: h2,
    iconBg: "#383e56",
    date: "Tháng 11/2020 - Tháng 4/2021",
    points: [
      "Phát triển và bảo trì các ứng dụng web bằng React.js và các công nghệ liên quan khác.",
      "Hợp tác với các đội ngũ liên chức năng bao gồm nhà thiết kế, quản lý sản phẩm và các lập trình viên khác để tạo ra các sản phẩm chất lượng cao.",
      "Triển khai thiết kế đáp ứng (responsive) và đảm bảo tính tương thích trên nhiều trình duyệt.",
      "Thiết kế, chỉnh sửa video, hình ảnh và nội dung..."
    ]
  },
  {
    title: "Lập trình viên",
    company_name: "Tự do (Freelancer)",
    icon: freelance,
    iconBg: "#383e56",
    date: "Tháng 5/2021 - Hiện tại",
    points: [
      "Tham gia vào các dự án phát triển front-end, back-end và full-stack.",
      "Tối có nhiều kinh nghiệm trong việc cung cấp các giải pháp công nghệ chất lượng cao, quản lý dự án hiệu quả và đáp ứng các nhu cầu đa dạng của khách hàng. Công việc của tôi bao gồm phát triển phần mềm, bảo trì hệ thống và hỗ trợ kỹ thuật theo yêu cầu, luôn đạt được sự hài lòng của khách hàng thông qua các phương pháp hiệu quả và sáng tạo."
    ]
  }
];
const projects = [
  {
    name: "TriD - Languages",
    description:
      "Ứng dụng học ngôn ngữ bao gồm từ điển , thẻ từ vựng và ứng dụng AI vào học tập.",
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
    name: "TriD - Music",
    description:
      "Ứng dụng nghe nhạc đầy đủ tính năng với giao diện hiện đại.",
    tags: [
      {
        name: "Expo",
        color: "blue-text-gradient"
      },
      {
        name: "Swift - Kotlin",
        color: "green-text-gradient"
      },
      {
        name: "react-native",
        color: "pink-text-gradient"
      }
    ],
    image: jobit,
    source_code_link: "https://github.com/"
  },
  {
    name: "TriD - OS ",
    description:
      "Hệ điều hành AI - Hệ thống các AI Agent và khung liên kết , điều phối giữ chúng , có thể ứng dụng gần như mọi trường hợp trên tất cả nền tảng ( web, mobile app).",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient"
      },
      {
        name: "Python",
        color: "green-text-gradient"
      },
      {
        name: "React Native",
        color: "pink-text-gradient"
      }
    ],
    image: tridos,
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
