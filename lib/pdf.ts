import jsPDF from 'jspdf';

export interface PDFData {
  name: string;
  email: string;
  mode: 'audit' | 'create';
  score?: number;
  highlights?: string[];
  recommendations?: string[];
  detailedAnalysis?: any;
  asin?: string;
  productUrl?: string;
  keywords?: string[];
  fulfilment?: string;
  category?: string;
  productDesc?: string;
}

export function generateAuditReportPDF(data: PDFData): jsPDF {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Amazon Audit Report - E-CTRL',
    subject: `Audit Report for ${data.asin || 'Product'}`,
    author: 'E-CTRL',
    creator: 'E-CTRL Amazon Audit Tool'
  });

  // Add header with brand colors (orange, blue, black)
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('E-CTRL', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Black color
  doc.text('Amazon Audit Report', 105, 35, { align: 'center' });
  
  // Add brand tagline
  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22); // Orange color
  doc.text('Your shortcut to Amazon success', 105, 45, { align: 'center' });
  
  // Add report details
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99); // Medium gray
  
  let yPosition = 55;
  
  // Basic info
  doc.text(`Generated for: ${data.name}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Email: ${data.email}`, 20, yPosition);
  yPosition += 8;
  doc.text(`ASIN: ${data.asin || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;
  
  // Score section with improved design
  if (data.score !== undefined) {
    // Add a subtle background for the score section
    doc.setFillColor(249, 115, 22, 0.1); // Light orange background
    doc.rect(15, yPosition - 5, 180, 35, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // Black
    doc.text('Audit Score', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(28);
    // Use brand colors for score
    const scoreColor = data.score >= 80 ? [37, 99, 235] : data.score >= 60 ? [249, 115, 22] : [239, 68, 68];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${data.score}/100`, 20, yPosition);
    yPosition += 12;
    
    // Score interpretation with better styling
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    let interpretation = '';
    if (data.score >= 80) interpretation = 'Excellent - Your listing is well-optimized!';
    else if (data.score >= 60) interpretation = 'Good - Room for improvement with our recommendations.';
    else interpretation = 'Needs Work - Significant optimization opportunities identified.';
    doc.text(interpretation, 20, yPosition);
    yPosition += 20;
  }

  // Binary IDQ Results section
  if (data.detailedAnalysis?.binaryIdqResult) {
    const binaryResult = data.detailedAnalysis.binaryIdqResult;
    
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue color for section headers
    doc.text('Binary IDQ Analysis', 20, yPosition);
    yPosition += 8;
    
    // IDQ Score and Grade
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(`Binary Score: ${binaryResult.score}/${binaryResult.maxPossible} (${binaryResult.qualityPercent}%)`, 20, yPosition);
    yPosition += 6;
    doc.text(`Grade: ${binaryResult.grade}`, 20, yPosition);
    yPosition += 10;
    
    // Sales opportunities
    if (binaryResult.notes && binaryResult.notes.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(249, 115, 22); // Orange for opportunities
      doc.text('Sales Opportunities:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      binaryResult.notes.forEach((note: string) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${note}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;
    }
  }
  
  // Highlights section with improved styling
  if (data.highlights && data.highlights.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue color for section headers
    doc.text('Biggest Sales Opportunities', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Black for content
    data.highlights.forEach((highlight, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      // Use orange bullet points
      doc.setTextColor(249, 115, 22);
      doc.text('•', 20, yPosition);
      doc.setTextColor(31, 41, 55);
      doc.text(highlight, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  }
  
  // Recommendations section with improved styling
  if (data.recommendations && data.recommendations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue color for section headers
    doc.text('How to Increase Your Sales', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Black for content
    data.recommendations.forEach((rec, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      // Use orange numbers
      doc.setTextColor(249, 115, 22);
      doc.text(`${index + 1}.`, 20, yPosition);
      doc.setTextColor(31, 41, 55);
      doc.text(rec, 30, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  }
  
  // Detailed analysis section
  if (data.detailedAnalysis) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Detailed Analysis', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    
    // Handle different types of detailed analysis
    if (typeof data.detailedAnalysis === 'object') {
      Object.entries(data.detailedAnalysis).forEach(([key, value]) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(`${label}:`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        const text = String(value);
        if (text.length > 80) {
          // Split long text into multiple lines
          const words = text.split(' ');
          let line = '';
          words.forEach(word => {
            if ((line + word).length > 80) {
              doc.text(line, 25, yPosition);
              yPosition += 5;
              line = word + ' ';
            } else {
              line += word + ' ';
            }
          });
          if (line) {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          }
        } else {
          doc.text(text, 25, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }
  }
  
  // Footer
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by E-CTRL - AI-Powered Amazon Growth Audit Tool', 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setTextColor(249, 115, 22); // Orange color for tagline
  doc.text('Your shortcut to Amazon success', 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setTextColor(107, 114, 128);
  doc.text('For questions or support, reply to this email', 105, yPosition, { align: 'center' });
  
  return doc;
}

export function generateListingPackPDF(data: PDFData): jsPDF {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Amazon Listing Pack - E-CTRL',
    subject: 'Complete Amazon Listing Pack',
    author: 'E-CTRL',
    creator: 'E-CTRL Amazon Audit Tool'
  });

  // Add header with brand colors (orange, blue, black)
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('E-CTRL', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Black color
  doc.text('Amazon Listing Pack', 105, 35, { align: 'center' });
  
  // Add brand tagline
  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22); // Orange color
  doc.text('Your shortcut to Amazon success', 105, 45, { align: 'center' });
  
  // Add report details
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99); // Medium gray
  
  let yPosition = 60;
  
  // Basic info
  doc.text(`Generated for: ${data.name}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Email: ${data.email}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;
  
  // Product details
  if (data.category) {
    doc.text(`Category: ${data.category}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (data.fulfilment) {
    doc.text(`Fulfilment: ${data.fulfilment}`, 20, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Product description
  if (data.productDesc) {
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Product Description', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    
    // Split long description into multiple lines
    const words = data.productDesc.split(' ');
    let line = '';
    words.forEach(word => {
      if ((line + word).length > 80) {
        doc.text(line, 20, yPosition);
        yPosition += 5;
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    });
    if (line) {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    }
    yPosition += 10;
  }
  
  // Keywords section with improved styling
  if (data.keywords && data.keywords.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue color for section headers
    doc.text('Recommended Keywords', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Black for content
    data.keywords.forEach((keyword, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      // Use orange bullet points
      doc.setTextColor(249, 115, 22);
      doc.text('•', 20, yPosition);
      doc.setTextColor(31, 41, 55);
      doc.text(keyword, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  }
  
  // Detailed analysis section
  if (data.detailedAnalysis) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue color for section headers
    doc.text('Listing Pack Details', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    
    // Handle different types of detailed analysis
    if (typeof data.detailedAnalysis === 'object') {
      Object.entries(data.detailedAnalysis).forEach(([key, value]) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(`${label}:`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        const text = String(value);
        if (text.length > 80) {
          // Split long text into multiple lines
          const words = text.split(' ');
          let line = '';
          words.forEach(word => {
            if ((line + word).length > 80) {
              doc.text(line, 25, yPosition);
              yPosition += 5;
              line = word + ' ';
            } else {
              line += word + ' ';
            }
          });
          if (line) {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          }
        } else {
          doc.text(text, 25, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }
  }
  
  // Footer
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by E-CTRL - AI-Powered Amazon Growth Audit Tool', 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setTextColor(249, 115, 22); // Orange color for tagline
  doc.text('Your shortcut to Amazon success', 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setTextColor(107, 114, 128);
  doc.text('For questions or support, reply to this email', 105, yPosition, { align: 'center' });
  
  return doc;
}

export function generatePDF(data: PDFData): jsPDF {
  if (data.mode === 'audit') {
    return generateAuditReportPDF(data);
  } else {
    return generateListingPackPDF(data);
  }
}

export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}

export function getPDFBlob(doc: jsPDF): Blob {
  return doc.output('blob');
}
