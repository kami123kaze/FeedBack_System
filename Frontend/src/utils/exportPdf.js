import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function exportNodeToPdf(node, filename = "feedback") {
  if (!node) return;


  const style = document.createElement("style");
  style.id = "html2canvas-oklab-fix";
  style.innerHTML = `
    * {
      --tw-shadow: 0 0 #0000 !important;
      --tw-shadow-colored: 0 0 #0000 !important;
      box-shadow: none !important;
      text-shadow: none !important;
      filter: none !important;
    }
  `;
  document.head.appendChild(style);

  try {
    /* 2render */
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#0d0d0d",
      useCORS: true,
    });

    /* 3generate PDF */
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error("❌ Failed to export PDF:", err);
  } finally {
    /* 4remove override so page styles return to normal */
    style.remove();
  }
}
