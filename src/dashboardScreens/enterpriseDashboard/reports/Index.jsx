import React, { useEffect, useMemo, useState } from "react";
import SearchField from "../../../common/SearchField";
import Filters from "../../../common/Filters";
import Tooltip from "../../../common/Toltip";
import { FiDownload } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../../common/custom-dropdown";
import { timeOptions, ReportsHeaderData } from "../../../../dummyData";
import { reportService } from "../../../services/report.service";

const Index = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState("This Month");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTimeChange = (value, dateData) => {
    setSelectedTime(value);
    // dateData is currently unused; can be wired for custom ranges later
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reportService.getAll(
        searchQuery ? { search: searchQuery } : {}
      );
      setReports(data.reports || data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err?.response?.data?.message || "Failed to load reports. Please try again."
      );
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await reportService.delete(reportId);
      await fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      alert(
        err?.response?.data?.message || "Failed to delete report. Please try again."
      );
    }
  };

  const handleDownload = (report) => {
    const rows = [
      [
        "Report Name",
        "Type",
        "Format",
        "Exported On",
        "Exported By",
        "Delivered To",
        "Status",
      ],
      [
        report.reportName,
        report.type,
        report.format,
        report.exportedOn
          ? new Date(report.exportedOn).toLocaleString()
          : "",
        report.exportedByName ||
          report.exportedBy?.name ||
          report.exportedBy ||
          "",
        report.deliveredTo,
        report.status,
      ],
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${report.reportName || "report"}-${report._id || ""}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReports = useMemo(() => {
    if (!reports?.length) return [];
    const now = new Date();

    const withinRange = (date) => {
      if (!date) return false;
      const d = new Date(date);
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      switch (selectedTime) {
        case "This Month":
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        case "Last 7 days":
          return diffDays <= 7;
        case "Last 14 days":
          return diffDays <= 14;
        case "Last Month": {
          const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          const thisMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );
          return d >= lastMonth && d < thisMonthStart;
        }
        case "Date Range":
        default:
          return true;
      }
    };

    return reports.filter((r) => withinRange(r.exportedOn));
  }, [reports, selectedTime]);

  return (
    <div className="">
      <div className="flex gap-4 items-center justify-between">
        <h1 className="font-vivita my-10 text-lg md:text-xl">Reports</h1>
        <div className="whitespace-nowrap gap-4">
          <div className="flex gap-x-4">
            <div>
              <CustomDropdown
                options={timeOptions}
                placeholder="Select Time Period"
                value={selectedTime}
                onChange={handleTimeChange}
                rounded
              />
            </div>
            <div className="py-0">
              <button
                className="custom-shadow-button h-full whitespace-nowrap font-vivita md:mt-0 mt-3"
                onClick={() => navigate("/generate-report")}
              >
                Create New Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="global-bg-color rounded-[20px] md:p-7 p-3 box-shadow">
          <div className="md:flex  justify-between items-center gap-4">
            <h1 className="text-lg md:text-xl">Reports</h1>
            <div className="flex gap-3 sm:w-[70%] w-full">
              <SearchField
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filters />
            </div>
          </div>

          <div className="overflow-x-auto my-7">
            {loading ? (
              <div className="text-center py-8 text-sm text-gray-600">
                Loading reports...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-sm text-red-500">
                {error}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-600">
                No reports found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="table-header">
                  {ReportsHeaderData.map((heading) => (
                    <th key={heading._id}>{heading.heading}</th>
                  ))}
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-light ">
                        {report.reportName}
                      </td>
                      <td className="py-3 font-light text-sm">
                        {report.type}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {report.format}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {report.exportedOn
                          ? new Date(report.exportedOn).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {report.exportedByName ||
                          report.exportedBy?.name ||
                          "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {report.deliveredTo}
                      </td>
                      <td className="py-3 px-4 text-sm font-light">
                        {report.status}
                      </td>

                      <td className="py-3 mr-4 font-light flex justify-center gap-4">
                        <div className="flex mr-4 gap-4">
                          <button
                            type="button"
                            onClick={() => handleDownload(report)}
                            title="Download report"
                          >
                            <FiDownload
                              size={20}
                              className="text-[#0061A9] cursor-pointer"
                            />
                          </button>
                          <Tooltip tooltipContent="View Report">
                            <IoEyeOutline
                              size={22}
                              className="text-[#0061A9]"
                            />
                          </Tooltip>

                          <button
                            type="button"
                            onClick={() => handleDelete(report._id)}
                            title="Delete report"
                          >
                            <RiDeleteBin6Line
                              size={22}
                              className="text-red-600 cursor-pointer"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
