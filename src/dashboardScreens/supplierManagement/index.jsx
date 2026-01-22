import React, { useState } from "react";
import { suppliersData } from "../../../dummyData";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import ViewModal from "../../common/ViewModal";
import FilterCanvasBar from "./FilterCanvasBar";
import { supplierViewData } from "../../../dummyData";

const SupplierManagement = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [filtersCities, setFiltersCities] = useState([]);
  const [filterSupplieditems, setFilterSupplieditems] = useState([]);

  const handleDelete = () => {
    console.log("delete");
    setIsDeleteModalOpen(false);
    alert("ok");
  };
  return (
    <div className="flex py-3">
      <div className={`space-y-5 ${isFilterBarOpen ? "w-[82%]" : "w-full"}`}>
        <div className="md:flex md:justify-between md:items-center space-y-3">
          <h1 className="font-vivita text-[24px] font-medium">
            Supplier Management
          </h1>
          <div className="flex justify-end md:w-[25%] w-full">
            <button
              onClick={() => navigate("/add-supplier")}
              className="custom-shadow-button whitespace-nowrap font-vivita !py-3 !px-6 md:!w-full !w-[50%]"
            >
              Add New Supplier
            </button>
          </div>
        </div>
        <div className="global-bg-color h-auto rounded-[20px] md:p-7 p-3 box-shadow">
          <div className="flex flex-row justify-between items-center w-full gap-4 flex-wrap">
            <h1 className="font-Geom text-lg md:text-xl">Suppliers List</h1>
            <div className="flex w-full md:w-[70%] gap-3">
              <SearchField />
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>
          <div className="overflow-x-auto my-7 whitespace-nowrap">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th>User Name</th>
                  <th>Supplier ID</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Country</th>
                  <th className="!text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliersData?.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className="border-b-[1px] border-[#DEDFE0] last:border-0"
                  >
                    <td className="py-4 px-4 text-sm font-light ">
                      {supplier.name}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {supplier._id}
                    </td>
                    <td className="py-4 font-light text-sm">
                      {supplier.email}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {supplier.phone}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {supplier.city}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {" "}
                      {supplier.country}
                    </td>
                    <td className="py-4 px-4 font-light flex justify-center gap-3">
                      <MdOutlineEdit
                        onClick={() =>
                          navigate("/update-supplier/3978237273723")
                        }
                        size={20}
                        className="text-[#0061A9]"
                      />
                      <IoEyeOutline
                        onClick={() => setIsViewModalOpen(true)}
                        size={20}
                        className="text-[#0061A9]"
                      />
                      <RiDeleteBin6Line
                        onClick={() => setIsDeleteModalOpen(true)}
                        size={20}
                        className="text-red-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          viewData={supplierViewData}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          module="Supplier"
          handleDelete={handleDelete}
        />
      </div>
      {isFilterBarOpen && (
        <FilterCanvasBar
          setFiltersCities={setFiltersCities}
          filtersCities={filtersCities}
          setFilterSupplieditems={setFilterSupplieditems}
          filterSupplieditems={filterSupplieditems}
          onClose={() => setIsFilterBarOpen(false)}
        />
      )}
    </div>
  );
};

export default SupplierManagement;
