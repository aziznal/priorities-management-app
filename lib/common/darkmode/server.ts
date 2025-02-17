import { cookies } from "next/headers";
import { DARKMODE_COOKIE_NAME } from "./core";

export async function getIsDarkmode_server() {
  return (await cookies()).get(DARKMODE_COOKIE_NAME)?.value === "true";
}

export async function setDarkmode_server(value: "true" | "false") {
  return (await cookies()).set(DARKMODE_COOKIE_NAME, value);
}

export async function toggleDarkmode_server() {
  if (await getIsDarkmode_server()) await setDarkmode_server("false");
  else await setDarkmode_server("true");
}
