import blueProfile from "../assets/blue.svg";
import greenProfile from "../assets/green.svg";
import redProfile from "../assets/red.svg";
import whiteProfile from "../assets/white.svg";
import yellowProfile from "../assets/yellow.png";

export const AVATARS = [blueProfile, greenProfile, redProfile, whiteProfile];
export const MY_AVATAR = yellowProfile;
export const MY_USERNAME = "노이만";

export const GAME_CONFIG = {
  CHAT_DURATION: 0.1 * 60 * 1000, // 6초 (개발용)
  VOTE_DURATION: 60000, // 1분
  MAX_VOTE_TARGETS: 5,
} as const;
