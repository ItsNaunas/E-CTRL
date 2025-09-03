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

  // Add header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('E-CTRL', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('Amazon Audit Report', 105, 35, { align: 'center' });
  
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
  
  // Score section
  if (data.score !== undefined) {
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Audit Score', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(24);
    const scoreColor = data.score >= 80 ? [34, 197, 94] : data.score >= 60 ? [245, 158, 11] : [239, 68, 68];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${data.score}/100`, 20, yPosition);
    yPosition += 15;
    
    // Score interpretation
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    let interpretation = '';
    if (data.score >= 80) interpretation = 'Excellent - Your listing is well-optimized!';
    else if (data.score >= 60) interpretation = 'Good - Room for improvement with our recommendations.';
    else interpretation = 'Needs Work - Significant optimization opportunities identified.';
    doc.text(interpretation, 20, yPosition);
    yPosition += 15;
  }
  
  // Highlights section
  if (data.highlights && data.highlights.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Key Highlights', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    data.highlights.forEach((highlight, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${highlight}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }
  
  // Recommendations section
  if (data.recommendations && data.recommendations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Actionable Recommendations', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    data.recommendations.forEach((rec, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${rec}`, 25, yPosition);
      yPosition += 6;
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

  // Add header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('E-CTRL', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('Amazon Listing Pack', 105, 35, { align: 'center' });
  
  // Add report details
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99); // Medium gray
  
  let yPosition = 55;
  
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
  
  // Keywords section
  if (data.keywords && data.keywords.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Recommended Keywords', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    data.keywords.forEach((keyword, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${keyword}`, 25, yPosition);
      yPosition += 6;
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
