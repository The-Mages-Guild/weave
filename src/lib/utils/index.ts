import { renderToString } from "react-dom/server";
import { unescape } from "he";

export const getString = (component: React.ReactNode) => {
  return unescape(renderToString(component)).split("<!-- -->").join(`
  `);
}