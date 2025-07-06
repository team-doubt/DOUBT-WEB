import React from "react";
import Background from "../assets/background/index.png";
import Logo from "../assets/logo.svg";

const Index = () => {
  return (
    <main
      className="w-full h-screen bg-cover bg-center flex items-center justify-center flex-col gap-3"
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      <img src={Logo} alt="Logo" className="w-[27.75rem]" />
      <h1 className="text-[2.625rem] text-white font-bold">
        당신은 인공지능을 찾아낼 수 있습니까?
      </h1>
      <p className="text-[24px] text-[#D1D5DB] text-center">
        5분 동안 실제 사람과 AI가 섞여있는 채팅방에서
        <br />
        누가 인공지능인지 맞춰보세요!
      </p>
      <button
        className="bg-[#BE54A5] text-white text-[1.5rem] py-4 px-[6.25rem] width-[280px] cursor-pointer"
        onClick={() => {
          window.location.href = "/chat";
        }}
      >
        매칭하기
      </button>
    </main>
  );
};

export default Index;
