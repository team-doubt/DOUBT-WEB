import blueProfile from "../assets/blue.svg";
import greenProfile from "../assets/green.svg";
import redProfile from "../assets/red.svg";
import whiteProfile from "../assets/white.svg";
import yellowProfile from "../assets/yellow.png";

export const USERS = [
  { avatar: blueProfile, name: "파스칼" },
  { avatar: greenProfile, name: "가우스" },
  { avatar: redProfile, name: "오일러" },
  { avatar: whiteProfile, name: "튜링" },
];

export const MY_USER = { avatar: yellowProfile, name: "노이만" };

export const GAME_CONFIG = {
  CHAT_DURATION: 0.1 * 60 * 1000, // 6초 (개발용)
  VOTE_DURATION: 10000, // 1분
  MAX_VOTE_TARGETS: 5,
} as const;
