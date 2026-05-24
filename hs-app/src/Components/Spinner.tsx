import type {Spinner as SpinnerProps} from "../Interfaces/Interfaces.tsx";

export default function Spinner({size = 'md', color = 'border-t-amber-500'}: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 border-2',
        md: 'h-16 w-16 border-4',
        lg: 'h-24 w-24 border-[6px]',
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            role="status"
            aria-label="Загрузка"
        >
            <div className={`relative rounded-full border-white/20 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] ${sizeClasses[size]}`}>
                <div
                    className={`
                        absolute 
                        -inset-[4px]
                        animate-spin 
                        rounded-full 
                        border-transparent 
                        ${color}
                    `}
                    style={{
                        borderWidth: size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px'
                    }}
                />
            </div>
        </div>
    )
}