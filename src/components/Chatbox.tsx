import { faker } from '@faker-js/faker';

export default function Chatbox() {
  const avatar = faker.image.avatar();
  const username = faker.internet.userName();
  const time = faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message = faker.lorem.sentence();

  return (
    <div className="flex w-full max-w-2xl py-4 px-2">
      
      <div className="w-11 h-11 rounded-md bg-white overflow-hidden flex-shrink-0 mr-4 border">
        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <div className="bg-[#18191c] rounded-lg px-5 py-3">
          
          <div className="flex items-center mb-1">
            <span className="text-white font-semibold text-sm mr-2">{username}</span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          
          <div className="text-[#e5e7eb] text-base leading-6">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
