import React, { useState, useEffect, useRef } from "react";
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
  const silentRefetchRef = useRef(false);

  const highlightMatch = (value) => {
    const text = String(value ?? "");
    const query = searchQuery.trim();
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let start = 0;

    while (true) {
      const index = lowerText.indexOf(lowerQuery, start);
      if (index === -1) {
        if (start === 0) {
          // no match at all
          return text;
        }
        result.push(text.slice(start));
        break;
      }
      if (index > start) {
        result.push(text.slice(start, index));
      }
      result.push(
        <span key={index} className="bg-yellow-200">
          {text.slice(index, index + query.length)}
        </span>
      );
      start = index + query.length;
    }

    return result;
  };

  const fetchSuppliers = async () => {
    try {
      if (!silentRefetchRef.current) setLoading(true);
      else silentRefetchRef.current = false;
      const params = {};
      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (filtersCities.length > 0) params.city = filtersCities.join(",");
      if (filterSupplieditems.length > 0) params.itemsSupplied = filterSupplieditems.join(",");

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
  }, [searchQuery, filtersCities, filterSupplieditems]);

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

  const handleView = (supplier) => {
    // Avoid refetching supplier, use list row data
    const s = supplier || {};
    const fullName = (s.name || "").trim();
    const nameParts = fullName ? fullName.split(/\s+/) : [];
    const lastNameOnly =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    setViewData({
      modalTitle: "Supplier Details",
      _id: s._id,
      supplierId: s.supplierId || s._id,
      name: fullName || "N/A",
      lastName: lastNameOnly,
      email: s.email || "N/A",
      phone: s.phone || "N/A",
      city: s.city || "N/A",
      country: s.country || "N/A",
      itemsSupplied: s.itemsSupplied || [],
    });
    setIsViewModalOpen(true);
  };

  const handleRemoveFromView = async () => {
    if (!viewData || !viewData._id) return;
    try {
      await supplierService.delete(viewData._id);
      setIsViewModalOpen(false);
      setViewData(null);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier from view modal:", error);
      alert("Failed to delete supplier. Please try again.");
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
                        {highlightMatch(supplier.name)}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {highlightMatch(supplier.supplierId || supplier._id)}
                      </td>
                      <td className="py-4 font-light text-sm">
                        {highlightMatch(supplier.email)}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {highlightMatch(supplier.phone || "N/A")}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {highlightMatch(supplier.city || "N/A")}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {highlightMatch(supplier.country || "N/A")}
                      </td>
                      <td className="py-4 px-4 font-light flex justify-center gap-3">
                        <MdOutlineEdit
                          onClick={() =>
                            navigate(`/update-supplier/${supplier._id}`, {
                              state: { supplier },
                            })
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
          onRemove={handleRemoveFromView}
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
          onClose={() => {
            silentRefetchRef.current = true;
            setFiltersCities([]);
            setFilterSupplieditems([]);
            setIsFilterBarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SupplierManagement;
