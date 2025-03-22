import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import bangs from "./bangs.js";
import redirect from "./redirect.js";
import MainSearch from "./MainSearch";
import Time from "./ShowTime.jsx";
import Loader from "./Loader.jsx";
import DeepSeekChat from "./DeepSeekChat.jsx";

export function getQueryParams(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const paramsObj = {};

  params.forEach((value, key) => {
    if (paramsObj.hasOwnProperty(key)) {
      if (Array.isArray(paramsObj[key])) {
        paramsObj[key].push(value);
      } else {
        paramsObj[key] = [paramsObj[key], value];
      }
    } else {
      paramsObj[key] = value;
    }
  });

  return paramsObj;
}

if (getQueryParams(window.location.href).q) {
  const query = getQueryParams(window.location.href).q;

  let s = false;
  Object.keys(redirect).forEach((redirectm) => {
    if (query === redirectm) {
      const redirectData = redirect[redirectm];
      window.location.href = redirectData.redirection;
      s = true;
    }
  });

  if (!s) {
    let a = false;
    Object.keys(bangs).forEach((bang) => {
      if (query.startsWith(bang)) {
        const bangData = bangs[bang];
        a = true;
        window.location.href = bangData.redirection.replaceAll(
          "{input}",
          query.replace(bang, "").trim(),
        );
        return;
      }
    });
    if (!a) {
      if (query.length <= 12 && query.includes("=>")) {
        const lang1 = query.split("=>")[0];
        let lang2 = query.split("=>")[1];
        if (lang2.includes(":")) {
          lang2 = lang2.split(":")[0];
          const text = query.split("=>")[1].split(":")[1];
          window.location.href = `https://translate.google.es/?sl=${lang1}&tl=${lang2}&text=${text}&op=translate`;
        } else {
          window.location.href = `https://translate.google.es/?sl=${lang1}&tl=${lang2}&op=translate`;
        }
      } else if (query.includes("=>")) {
        const lang1 = query.split("=>")[0];
        let lang2 = query.split("=>")[1];
        if (lang2.includes(":")) {
          const text = query.split("=>")[1].split(":")[1];
          lang2 = lang2.split(":")[0];
          window.location.href = `https://translate.google.es/?sl=${lang1}&tl=${lang2}&text=${text}&op=translate`;
        }
      } else {
        window.location.href = bangs["<void>"].redirection.replaceAll(
          "{input}",
          query,
        );
      }
    }
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {getQueryParams(window.location.href).deepseek ? (
      <DeepSeekChat />
    ) : getQueryParams(window.location.href).q ? (
      <Loader />
    ) : getQueryParams(window.location.href).clock ? (
      <Time />
    ) : (
      <MainSearch />
    )}
  </StrictMode>,
);
