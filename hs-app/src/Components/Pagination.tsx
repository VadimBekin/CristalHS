interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    function handlePageClick(page: number) {
        if ( page >= 1 && page <= totalPages ) {
            onPageChange(page);
        }
    }
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage === 1) {
                pages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };
    if (totalPages <= 1) return null;
    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2 my-8 flex-wrap">
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
            px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm cursor-pointer
            ${currentPage === 1
                    ? 'bg-stone-800/20 text-stone-600 cursor-not-allowed'
                    : 'bg-stone-800/40 text-gray-300 hover:bg-stone-700/70 hover:scale-105 border border-white/10'
                }
        `}
            >
                ← Назад
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`
                w-10 h-10 rounded-xl transition-all duration-200 font-medium backdrop-blur-sm  cursor-pointer
                ${currentPage === page
                        ? 'bg-gradient-to-br from-amber-600 to-yellow-500 text-white shadow-lg scale-110 border border-white/20'
                        : 'bg-stone-800/40 text-gray-300 hover:bg-stone-700/70 hover:scale-105 border border-white/5'
                    }
            `}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
            px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm cursor-pointer
            ${currentPage === totalPages
                    ? 'bg-stone-800/20 text-stone-600 cursor-not-allowed'
                    : 'bg-stone-800/40 text-gray-300 hover:bg-stone-700/70 hover:scale-105 border border-white/10'
                }
        `}
            >
                Вперёд →
            </button>
        </div>
    )
}