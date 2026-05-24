import { useState } from 'react';

interface CopyInputProps {
    value: string;
    label?: string;
}

export default function CopyInput({ value, label = 'Код колоды' }: CopyInputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-xs text-gray-300 mb-2">{label}</label>}
            <div className="grid gap-2">
                <input
                    type="text"
                    value={value}
                    readOnly
                    className="flex-1 px-3 py-2 bg-stone-800/50 border border-white/10 rounded-lg text-gray-300 text-sm font-mono cursor-default truncate"
                />
                <button
                    onClick={handleCopy}
                    className={`
                        px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap
                        ${copied
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-600 hover:bg-yellow-500 border-white/20'
                    }
                    `}
                >
                    {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
            </div>
        </div>
    );
}