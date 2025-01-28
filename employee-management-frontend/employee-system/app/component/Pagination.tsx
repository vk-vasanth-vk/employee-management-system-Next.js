const Pagination = ({ totalEmployees, setCurrentPage }: { totalEmployees: number, setCurrentPage: (page: number) => void }) => {
    const pages = [];

    for(let i=1; i<= Math.ceil(totalEmployees /10); i++) {
        pages.push(i);
    }

    return(
        <div className="mt-2 mb-2 flex justify-center">
            {pages.map((page, index) => (
                <button key={index} className="w-10 h-11 border-none bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setCurrentPage(page)}
                >{page}</button>
            ))

            }
        </div>
    )
}

export default Pagination;