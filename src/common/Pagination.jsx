import { useState } from "react";

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-end items-center mt-6 text-[#B3C7DA] font-vivita">
      <span onClick={handlePrevious} className="cursor-pointer">
        &laquo; Previous
      </span>
      {getPages().map((page) => (
        <span
          key={page}
          onClick={() => handlePageClick(page)}
          className={`cursor-pointer m-2 px-3 py-1 rounded-full ${
            currentPage === page
              ? "bg-[#337FBA] text-white"
              : "hover:text-[#337FBA]"
          }`}
        >
          {page}
        </span>
      ))}

      <span onClick={handleNext} className="cursor-pointer text-[#337FBA]">
        Next &raquo;
      </span>
    </div>
  );
};

export default Pagination;
