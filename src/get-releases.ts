import fetch from "node-fetch";

export default async (user: string, repo: string) => {
  const url = `https://api.github.com/repos/${user}/${repo}/releases`;

  const res = await fetch(url);
  const resJson = await res.json();

  return resJson;
};
