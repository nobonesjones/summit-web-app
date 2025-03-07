/**
 * Utility functions for file operations
 */

/**
 * Generates a filename based on the business idea and current date
 * 
 * @param businessIdea - The business idea to include in the filename
 * @param prefix - Optional prefix for the filename
 * @returns A formatted filename
 */
export function generateFilename(businessIdea: string, prefix: string = 'business-plan'): string {
  // Format the business idea for the filename
  const formattedBusinessIdea = businessIdea
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
  
  // Get the current date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];
  
  return `${prefix}-${formattedBusinessIdea}-${date}`;
}

/**
 * Converts a business plan object to a downloadable text file
 * 
 * @param businessPlan - The business plan object with sections
 * @param businessIdea - The business idea for the filename
 */
export function downloadBusinessPlanAsText(
  businessPlan: { title: string; sections: Array<{ title: string; content: string }> },
  businessIdea: string
): void {
  // Generate the filename
  const filename = generateFilename(businessIdea);
  
  // Format the business plan as text
  let content = `# ${businessPlan.title}\n\n`;
  
  businessPlan.sections.forEach(section => {
    content += `## ${section.title}\n\n${section.content}\n\n`;
  });
  
  // Create a blob with the content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts a business plan object to a downloadable HTML file
 * 
 * @param businessPlan - The business plan object with sections
 * @param businessIdea - The business idea for the filename
 */
export function downloadBusinessPlanAsHTML(
  businessPlan: { title: string; sections: Array<{ title: string; content: string }> },
  businessIdea: string
): void {
  // Generate the filename
  const filename = generateFilename(businessIdea);
  
  // Create HTML content
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessPlan.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2563eb;
      text-align: center;
      margin-bottom: 30px;
    }
    h2 {
      color: #1e40af;
      margin-top: 30px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }
    p {
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <h1>${businessPlan.title}</h1>
`;

  // Add each section
  businessPlan.sections.forEach(section => {
    // Convert plain text to HTML paragraphs
    const paragraphs = section.content
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');
    
    htmlContent += `
  <h2>${section.title}</h2>
  ${paragraphs}
`;
  });

  // Close HTML tags
  htmlContent += `
</body>
</html>
`;

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts a business plan object to a downloadable PDF file
 * Note: This is a placeholder function that would require a PDF generation library
 * 
 * @param businessPlan - The business plan object with sections
 * @param businessIdea - The business idea for the filename
 */
export function downloadBusinessPlanAsPDF(
  businessPlan: { title: string; sections: Array<{ title: string; content: string }> },
  businessIdea: string
): void {
  // This is a placeholder - in a real implementation, you would use a library like jsPDF
  alert('PDF download functionality requires a PDF generation library. Please implement with a library like jsPDF.');
  
  // Example implementation with jsPDF would look something like:
  /*
  import { jsPDF } from 'jspdf';
  
  const filename = generateFilename(businessIdea);
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(24);
  doc.text(businessPlan.title, 20, 20);
  
  // Add sections
  let yPosition = 40;
  businessPlan.sections.forEach(section => {
    doc.setFontSize(16);
    doc.text(section.title, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(section.content, 170);
    doc.text(contentLines, 20, yPosition);
    yPosition += contentLines.length * 7 + 10;
    
    // Add new page if needed
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
  */
} 