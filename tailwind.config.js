// tailwind.config.js
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        // Brand primary colors
        gold: "#D4AF37", // Logo, buttons, highlights
        blush: "#F9D5D3", // Soft feminine backgrounds, accents
        rosewood: "#65000B", // Dark rich accents, headings, footer bg

        // Neutral & background colors
        beige: "#EFE6DD", // Main page background
        white: "#FFFFFF", // Clean background & text contrast
        lightGray: "#F5F5F5", // Input fields, sections bg

        // Complementary accent colors
        lavender: "#B497BD", // Links, subtle hover effects
        sage: "#9DC183", // Calm accents, buttons hover
        charcoal: "#333333", // Dark text alternative for readability

        // Footer specific color
        footerBg: "#3B1F0B", // Deep dark brownish-gold for footer background
        footerText: "#F9D5D3", // Light blush for footer text
      },
      fontFamily: {
        work: ['"Work Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
