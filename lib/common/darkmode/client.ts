import Cookies from "js-cookie";
import { DARKMODE_COOKIE_NAME } from "./core";

export function getIsDarkmode_client() {
  return Cookies.get(DARKMODE_COOKIE_NAME) === "true";
}

export function setDarkmode_client(value: "true" | "false") {
  Cookies.set(DARKMODE_COOKIE_NAME, value);

  updateHtmlTagClass();
}

export function toggleDarkmode_client() {
  if (getIsDarkmode_client()) setDarkmode_client("false");
  else setDarkmode_client("true");
}

function updateHtmlTagClass() {
  const isDarkmode = getIsDarkmode_client();

  if (isDarkmode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
