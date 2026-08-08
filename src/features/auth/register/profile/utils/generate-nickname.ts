import { nicknamePrefixes, nicknameSuffixes } from "../data/nickname-parts";

const MAX_NICKNAME_LENGTH = 16;

export function generateNickname(currentNickname: string) {
  const candidates = nicknamePrefixes.flatMap((prefix) =>
    nicknameSuffixes
      .map((suffix) => `${prefix}${suffix}`)
      .filter((candidate) => candidate.length <= MAX_NICKNAME_LENGTH && candidate !== currentNickname),
  );

  return candidates[Math.floor(Math.random() * candidates.length)] ?? currentNickname;
}
