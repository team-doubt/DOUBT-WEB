import logo from '../assets/logo.svg'
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 w-full h-12 flex justify-center border-b border-[#33333A] bg-[#171718]">
        <div className="flex items-center">
            <img src={logo} alt="logo" className="h-8" />
        </div>
        <div className="flex items-center">
            <Countdown
                date={Date.now() + 1 * 60 * 1000}
                renderer={({ minutes, seconds }) => (
                <span className="ml-4 h-8 flex items-center text-white text-[28px]">
                    {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                </span>
                )}
                onComplete={() => navigate('/vote')}
            />
        </div>
    </div>
  )
}