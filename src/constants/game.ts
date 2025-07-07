import blueProfile from "../assets/profile/pascal/human.svg";
import greenProfile from "../assets/profile/gauss/human.svg";
import redProfile from "../assets/profile/euler/human.svg";
import whiteProfile from "../assets/profile/turing/human.svg";
import yellowProfile from "../assets/profile/neumann/human.svg";

import blueBot from "../assets/profile/pascal/bot.svg";
import greenBot from "../assets/profile/gauss/bot.svg";
import redBot from "../assets/profile/euler/bot.svg";
import whiteBot from "../assets/profile/turing/bot.svg";
import yellowBot from "../assets/profile/neumann/bot.svg";

export const USERS = [
  { avatar: blueProfile,  name: "파스칼", bot: blueBot },
  { avatar: greenProfile, name: "가우스", bot: greenBot },
  { avatar: redProfile, name: "오일러", bot: redBot },
  { avatar: whiteProfile, name: "튜링", bot: whiteBot },
];

export const MY_USER = { avatar: yellowProfile, bot: yellowBot, name: "노이만" };

export const GAME_CONFIG = {
  CHAT_DURATION: 0.1 * 600 * 1000, // 6초 (개발용)
  VOTE_DURATION: 10000, // 1분
  MAX_VOTE_TARGETS: 5,
} as const;
