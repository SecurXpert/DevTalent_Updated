import React from "react";
import { FiFileText, FiFile } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportHeader: React.FC = () => {
  const exportPDF = async () => {
    const reportElement = document.getElementById("report-container");
    if (!reportElement) return;
    toast.info("Generating PDF report, please wait...");
    
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5f3ff",
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Analytics_Report.pdf");
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  const exportExcel = () => {
    alert("Export Excel clicked");
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h1 className="text-[16px] font-bold text-[#1f2937] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]">
          Reports & Analytics
        </h1>
        <p className="text-[11px] text-[#6b7280] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px]">
          Comprehensive analytics and performance reports
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto" data-html2canvas-ignore="true">
        <button
          onClick={exportPDF}
          className="bg-[#ff0000] hover:bg-[#e00000] text-white rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 font-medium shadow-sm transition w-full h-[36px] sm:h-[40px] lg:h-[44px] text-[11px] sm:text-[13px] lg:text-[14px]"
        >
          <FiFileText size={14} />
          Export PDF
        </button>

        <button
          onClick={exportExcel}
          className="bg-[#00b140] hover:bg-[#009438] text-white rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 font-medium shadow-sm transition w-full h-[36px] sm:h-[40px] lg:h-[44px] text-[11px] sm:text-[13px] lg:text-[14px]"
        >
          <FiFile size={14} />
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
