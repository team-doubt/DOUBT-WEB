import { useState } from 'react';
import send from '../assets/send.svg';

interface TextInputProps {
    onSend?: (msg: string) => void;
}

export default function TextInput({ onSend }: TextInputProps) {
    const [value, setValue] = useState('');

    const handleSend = () => {
        if (onSend) onSend(value);
        setValue('');
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
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
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
            />
            <button
                className="no-hover-btn"
                onClick={handleSend}
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
                <span style={{ color: '#6B7280', fontSize: 20 }}>⌲</span>
            </button>
        </div>
    );
}