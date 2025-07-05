import { faker } from '@faker-js/faker';

interface ChatboxProps {
  message?: string;
  username?: string;
  avatar?: string;
  time?: string;
}

export default function Chatbox({ message, username, avatar, time }: ChatboxProps) {
  const _avatar = avatar || faker.image.avatar();
  const _username = username || faker.internet.userName();
  const _time = time || faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const _message = message || faker.lorem.sentence();

  return (
    <div className="flex w-full max-w-2xl py-4 px-2">
      
      <div className="w-11 h-11 rounded-md bg-white overflow-hidden flex-shrink-0 mr-4">
        <img src={_avatar} alt="avatar" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <div className="bg-[#18191c] rounded-lg px-5 py-3">
          
          <div className="flex items-center mb-1">
            <span className="text-white font-semibold text-sm mr-2">{_username}</span>
            <span className="text-xs text-gray-400">{_time}</span>
          </div>
          
          <div className="text-[#e5e7eb] text-base leading-6">
            {_message}
          </div>
        </div>
      </div>
    </div>
  );
}
