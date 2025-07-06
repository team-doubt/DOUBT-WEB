import { faker } from '@faker-js/faker';

interface ChatboxProps {
  message?: string;
  username?: string;
  avatar?: string;
  time?: string;
  isMine?: boolean;
}

export default function Chatbox({ message, username, avatar, time, isMine }: ChatboxProps) {
  const _avatar = avatar || faker.image.avatar();
  const _username = username || faker.internet.userName();
  const _time = time || faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const _message = message || faker.lorem.sentence();

  return (
    <div
      className="flex w-full max-w-2xl py-4 px-2"
      style={{ flexDirection: isMine ? 'row-reverse' : 'row', justifyContent: isMine ? 'flex-end' : 'flex-start' }}
    >
      <div className="w-11 h-11 rounded-md bg-white overflow-hidden flex-shrink-0 mr-4" style={isMine ? { marginLeft: 16, marginRight: 0 } : {}}>
        <img src={_avatar} alt="avatar" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1" style={isMine ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } : {}}>
        <div className="bg-[#18191c] rounded-lg px-5 py-3">
          <div className="flex items-center mb-1" style={isMine ? { justifyContent: 'flex-end' } : {}}>
            <span className="text-white font-semibold text-sm mr-2">{_username}</span>
            <span className="text-xs text-gray-400">{_time}</span>
          </div>
          <div className="text-[#e5e7eb] text-base leading-6" style={isMine ? { color: '#fff' } : {}}>
            {_message}
          </div>
        </div>
      </div>
    </div>
  );
}
