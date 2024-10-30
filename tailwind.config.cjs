/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#021d99",
        secondary: "#f8f8f6",
        tertiary: "#1c044f",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3"
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35"
      },
      screens: {
        xs: "450px"
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')"
      },
      height: {
        'fix': 'var(--vh)' // Custom class 'h-fix' với chiều cao bằng window.innerHeight
      }
    }
  },
  plugins: []
};
