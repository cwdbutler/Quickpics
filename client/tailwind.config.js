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
      fontSize: {
        xxs: "10px",
        m: "14px",
      },
      borderRadius: {
        s: "3px",
        m: "4px",
      },
      colors: {
        background: "#FAFAFA",
        lightblue: "#B2DFFC",
        blue: "#0095F6",
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
