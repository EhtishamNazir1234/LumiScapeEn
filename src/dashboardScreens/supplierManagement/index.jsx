import React, { useState, useEffect } from "react";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import ViewModal from "../../common/ViewModal";
import FilterCanvasBar from "./FilterCanvasBar";
import { supplierService } from "../../services/supplier.service";

const SupplierManagement = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [filtersCities, setFiltersCities] = useState([]);
  const [filterSupplieditems, setFilterSupplieditems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filtersCities.length > 0) params.city = filtersCities.join(",");
      
      const response = await supplierService.getAll(params);
      setSuppliers(response.suppliers || response || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchQuery, filtersCities]);

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await supplierService.delete(supplierToDelete._id);
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier. Please try again.");
    }
  };

  const handleView = async (supplier) => {
    try {
      const supplierDetails = await supplierService.getById(supplier._id);
      setViewData({
        modalTitle: "Supplier Details",
        supplierId: supplierDetails.supplierId || supplierDetails._id,
        name: supplierDetails.name,
        lastName: supplierDetails.lastName || "",
        email: supplierDetails.email,
        phone: supplierDetails.phone || "N/A",
        city: supplierDetails.city || "N/A",
        country: supplierDetails.country || "N/A",
        itemsSupplied: supplierDetails.itemsSupplied || [],
      });
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      alert("Failed to load supplier details.");
    }
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
              <SearchField 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
            </div>
          </div>
          <div className="overflow-x-auto my-7 whitespace-nowrap">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-8">No suppliers found</div>
            ) : (
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
                  {suppliers.map((supplier, index) => (
                    <tr
                      key={supplier._id || index}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-4 px-4 text-sm font-light ">
                        {supplier.name}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {supplier.supplierId || supplier._id}
                      </td>
                      <td className="py-4 font-light text-sm">
                        {supplier.email}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {supplier.phone || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {supplier.city || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {supplier.country || "N/A"}
                      </td>
                      <td className="py-4 px-4 font-light flex justify-center gap-3">
                        <MdOutlineEdit
                          onClick={() =>
                            navigate(`/update-supplier/${supplier._id}`)
                          }
                          size={20}
                          className="text-[#0061A9] cursor-pointer"
                        />
                        <IoEyeOutline
                          onClick={() => handleView(supplier)}
                          size={20}
                          className="text-[#0061A9] cursor-pointer"
                        />
                        <RiDeleteBin6Line
                          onClick={() => {
                            setSupplierToDelete(supplier);
                            setIsDeleteModalOpen(true);
                          }}
                          size={20}
                          className="text-red-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewData(null);
          }}
          viewData={viewData}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSupplierToDelete(null);
          }}
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
