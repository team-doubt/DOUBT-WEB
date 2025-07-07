import { useState } from 'react';
import send from "../assets/send.svg";

interface TextInputProps {
    onSend?: (msg: string) => void;
    disabled?: boolean;
}

export default function TextInput({ onSend, disabled }: TextInputProps) {
    const [value, setValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [endTime] = useState(() => Date.now() + 1 * 60 * 1000);
    const [isTimeEnded, setIsTimeEnded] = useState(false);

    const handleSend = () => {
        if (isSending) return;
        if (!value.trim()) return;
        setIsSending(true);
        if (onSend) onSend(value);
        setTimeout(() => {
            setValue('');
            setIsSending(false);
        }, 100);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 24,
            height: 48,
            width: '100%',
            padding: '0 16px',
            boxSizing: 'border-box',
        }}>
            <input
                type="text"
                placeholder="Type your message..."
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 14,
                    color: '#111827',
                    background: 'transparent',
                }}
                disabled={disabled}
            />
            <button
                className="no-hover-btn"
                onClick={handleSend}
                disabled={isSending || disabled}
                style={{
                    marginLeft: 8,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                }}
            >
                <img src={send} alt="send" className="w-6 h-6 text-[#6B7280]" />
            </button>
        </div>
    );
}