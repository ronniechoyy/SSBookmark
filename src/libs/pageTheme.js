import { createContext, useContext, useEffect, useState } from "react";

const pageThemeStyle = {
  dark: { bg: "#222222", text: "#eeeeee", bg_hover: "#333333" },
  light: { bg: "#eeeeee", text: "#222222", bg_hover: "#dddddd" },
  modern: { bg: "#333333", text: "#eeeeee", bg_hover: "#444444" },
  cyberpunk: { bg: "#0f0f0f", text: "#00ff00", bg_hover: "#1f1f1f" },
  minimal: { bg: "#ffffff", text: "#000000", bg_hover: "#f0f0f0" },
  contrast: { bg: "#000000", text: "#ffcc00", bg_hover: "#111111" },
  monochrome: { bg: "#ffffff", text: "#2f2f2f", bg_hover: "#f0f0f0" },
  warm: { bg: "#f5deb3", text: "#8b4513", bg_hover: "#e5cea3" },
  rg31: { bg: "#dcd2f1", text: "#571cc7", bg_hover: "#d4c7eb" },
  love: { bg: "#ffffff", text: "#ff27a7", bg_hover: "#f1eaee" },
  pl5: { bg: "#ffffff", text: "#d4421d", bg_hover: "#f5edec" },
};

function usePageTheme({ themeStyle, prefix = "cms" } = {}) {
  const themeState = useState(null);

  useEffect(() => {
    let theme = localStorage.getItem(`${prefix}-theme`);
    if (!theme) {
      theme = "dark";
      localStorage.setItem(`${prefix}-theme`, theme);
    }
    themeState[1](theme);
  }, []);

  useEffect(() => {
    if (!themeState[0]) return;

    let styleElement = document.getElementById(`${prefix}-theme`);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = `${prefix}-theme`;
      document.head.appendChild(styleElement);
    }

    let newStyles = '';

    const theme = themeStyle[themeState[0]];

    // Helper function to adjust color brightness
    const adjustBrightness = (color, amount) => {
      return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    };

    // Helper function to calculate contrast color
    const getContrastColor = (hexcolor) => {
      const r = parseInt(hexcolor.substr(1, 2), 16);
      const g = parseInt(hexcolor.substr(3, 2), 16);
      const b = parseInt(hexcolor.substr(5, 2), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return (yiq >= 128) ? '#000000' : '#FFFFFF';
    };

    Object.keys(theme).forEach((key) => {
      // Base variables
      newStyles += `--${prefix}-${key}: ${theme[key]};`;
      // Calculated variables
      newStyles += `--${prefix}-${key}-l: ${adjustBrightness(theme[key], 40)};`;
      newStyles += `--${prefix}-${key}-ll: ${adjustBrightness(theme[key], 80)};`;
      newStyles += `--${prefix}-${key}-d: ${adjustBrightness(theme[key], -40)};`;
      newStyles += `--${prefix}-${key}-dd: ${adjustBrightness(theme[key], -80)};`;
      newStyles += `--${prefix}-${key}-c: ${getContrastColor(theme[key])};`;
      // newStyles += `--${prefix}-${key}-t: ${createTransparentColor(theme[key], 0.1)};`;
      // newStyles += `--${prefix}-${key}-a: ${createTransparentColor(theme[key], 0.5)};`;
      newStyles += `--${prefix}-${key}-pg: linear-gradient(45deg, var(--${prefix}-${key}), var(--${prefix}-${key}-l));`;
      newStyles += `--${prefix}-${key}-sg: linear-gradient(45deg, var(--${prefix}-${key}), var(--${prefix}-${key}-d));`;

    });

    styleElement.textContent = `:root { ${newStyles} }`;

    localStorage.setItem(`${prefix}-theme`, themeState[0]);


  }, [themeState[0]])

  return themeState;
}

export default usePageTheme;
export { pageThemeStyle };