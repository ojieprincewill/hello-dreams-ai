/**
 * Trigger the browser print dialog for the currently rendered page.
 * Users can select "Save as PDF" in the print dialog.
 * This replaces the previous broken /api/export-docx endpoint.
 */
export const exportResumeDocx = () => {
  window.print();
};
