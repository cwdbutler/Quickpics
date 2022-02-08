module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Logo"],
      },
      lineHeight: {
        text: "18px",
      },
      fontSize: {
        xxs: "10px",
        m: "14px",
        mm: "16px",
      },
      borderRadius: {
        s: "3px",
        m: "4px",
      },
      colors: {
        background: "#FAFAFA",
        lightblue: "#B2DFFC",
        blue: "#0095F6",
        modal: "#1c1c1c",
      },
      transitionProperty: {
        width: "width",
        height: "height",
      },
      strokeWidth: {
        0.5: "0.5px",
        1.5: "1.5px",
      },
    },
  },
  plugins: [],
};
