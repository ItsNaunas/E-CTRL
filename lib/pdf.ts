import jsPDF from 'jspdf';

export interface PDFData {
  name: string;
  email: string;
  mode: 'audit' | 'create';
  accessType?: 'guest' | 'account';
  score?: number;
  highlights?: string[];
  recommendations?: string[];
  detailedAnalysis?: any;
  // New seller specific data
  idqAnalysis?: {
    title?: { current?: string; issues?: string[]; optimised?: string };
    bullets?: { current?: string[]; issues?: string[]; optimised?: string[] };
    description?: { current?: string; issues?: string[]; optimised?: string };
    keywords?: { current?: string[]; issues?: string[]; optimised?: { primary?: string[]; secondary?: string[]; longTail?: string[] } };
    images?: { current?: string[]; issues?: string[]; required?: { mainImage?: string; lifestyleImage?: string; benefitsInfographic?: string; howToUse?: string; measurements?: string; comparison?: string } };
    compliance?: { current?: string; issues?: string[]; requirements?: string[] };
  };
  summary?: {
    overallReadiness?: string;
    keyImprovements?: string[];
    nextSteps?: string[];
  };
  // Existing seller specific data
  productData?: {
    currentTitle?: string;
    currentBullets?: string[];
    currentImages?: number;
    currentDescription?: string;
    missingElements?: string[];
  };
  contentQuality?: {
    titleScore?: number;
    bulletsScore?: number;
    imagesScore?: number;
    descriptionScore?: number;
    informationScore?: number;
  };
  binaryIdqResult?: any;
  asin?: string;
  productUrl?: string;
  keywords?: string[];
  fulfilment?: string;
  category?: string;
  productDesc?: string;
}

export function generateAuditReportPDF(data: PDFData): jsPDF {
  const doc = new jsPDF();
  const isGuest = data.accessType === 'guest';
  
  // Set document properties
  doc.setProperties({
    title: isGuest ? 'Amazon Audit Preview - E-CTRL' : 'Amazon Audit Report - E-CTRL',
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
  doc.text(isGuest ? 'Amazon Audit Preview' : 'Amazon Audit Report', 105, 35, { align: 'center' });
  
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
  yPosition += 8;
  
  // Add guest access notice
  if (isGuest) {
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22); // Orange color
    doc.text('GUEST ACCESS - LIMITED PREVIEW', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('This is a preview of your audit results. Create a free account to unlock:', 20, yPosition);
    yPosition += 5;
    doc.text('• Complete detailed analysis and recommendations', 25, yPosition);
    yPosition += 4;
    doc.text('• Advanced competitive insights and benchmarking', 25, yPosition);
    yPosition += 4;
    doc.text('• ROI projections and impact estimates', 25, yPosition);
    yPosition += 4;
    doc.text('• Seasonal trends and timing recommendations', 25, yPosition);
    yPosition += 4;
    doc.text('• Advanced A/B testing strategies', 25, yPosition);
    yPosition += 4;
    doc.text('• Priority support and follow-up assistance', 25, yPosition);
    yPosition += 10;
    
    // Add upgrade CTA
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('Create your free account now to unlock the full report!', 20, yPosition);
    yPosition += 15;
  } else {
    yPosition += 7;
  }
  
  // Score section with improved design
  if (data.score !== undefined) {
    // Add a subtle background for the score section
    doc.setFillColor(249, 115, 22, 0.1); // Light orange background
    doc.rect(15, yPosition - 5, 180, 35, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22); // Orange for visibility
    doc.text('Audit Score', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(28);
    // Use orange for all scores for better visibility
    doc.setTextColor(249, 115, 22); // Orange color for better visibility
    doc.text(`${data.score}/100`, 20, yPosition);
    yPosition += 12;
    
    // Score interpretation with better styling
    doc.setFontSize(11);
    doc.setTextColor(249, 115, 22); // Orange for visibility
    let interpretation = '';
    if (data.score >= 80) interpretation = 'Excellent - Your listing is well-optimised!';
    else if (data.score >= 60) interpretation = 'Good - Room for improvement with our recommendations.';
    else interpretation = 'Needs Work - Significant optimisation opportunities identified.';
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
    doc.text('Listing Quality Analysis', 20, yPosition);
    yPosition += 8;
    
    // Listing Quality Score and Grade
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(`Binary Score: ${binaryResult.score}/${binaryResult.maxPossible} (${binaryResult.qualityPercent}%)`, 20, yPosition);
    yPosition += 6;
    doc.text(`Grade: ${binaryResult.grade}`, 20, yPosition);
    yPosition += 10;
    
    // Sales opportunities
    if (binaryResult.notes && binaryResult.notes.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175); // Dark blue for opportunities - better contrast
      doc.text('Conversion Opportunities:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39); // Darker text for better readability
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
    doc.setTextColor(15, 23, 42); // Dark navy for section headers - better contrast
    doc.text('Biggest Conversion Opportunities', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // Darker text for better readability
    
    // Limit highlights for guest users
    const highlightsToShow = isGuest ? data.highlights.slice(0, 3) : data.highlights;
    
    highlightsToShow.forEach((highlight, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      // Use dark blue bullet points for better contrast
      doc.setTextColor(30, 64, 175);
      doc.text('•', 20, yPosition);
      doc.setTextColor(17, 24, 39); // Darker text for better readability
      doc.text(highlight, 25, yPosition);
      yPosition += 7;
    });
    
    // Show limited notice for guest users
    if (isGuest && data.highlights.length > 3) {
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175); // Dark blue for consistency
      doc.text(`+ ${data.highlights.length - 3} more opportunities in full report`, 25, yPosition);
      yPosition += 5;
    }
    
    yPosition += 10;
  }
  
  // Recommendations section with improved styling
  if (data.recommendations && data.recommendations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Dark navy for section headers - better contrast
    doc.text('How to Increase Your Conversion', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // Darker text for better readability
    
    // Limit recommendations for guest users
    const recommendationsToShow = isGuest ? data.recommendations.slice(0, 3) : data.recommendations;
    
    recommendationsToShow.forEach((rec, index) => {
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
    
    // Show limited notice for guest users
    if (isGuest && data.recommendations.length > 3) {
      doc.setFontSize(10);
      doc.setTextColor(249, 115, 22);
      doc.text(`+ ${data.recommendations.length - 3} more strategies in full report`, 30, yPosition);
      yPosition += 5;
    }
    
    yPosition += 10;
  }
  
  // Detailed analysis section - use actual AI analysis data (only for account users)
  if (!isGuest && (data.detailedAnalysis || data.productData || data.contentQuality)) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Detailed Analysis', 20, yPosition);
    yPosition += 8;
    
    // Title Quality Analysis
    if (data.detailedAnalysis?.titleQuality) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Title Quality:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const titleText = String(data.detailedAnalysis.titleQuality);
      if (titleText.length > 80) {
        const words = titleText.split(' ');
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
        doc.text(titleText, 25, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    // Bullet Points Analysis
    if (data.detailedAnalysis?.bulletPoints) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Bullet Points Analysis:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const bulletText = String(data.detailedAnalysis.bulletPoints);
      if (bulletText.length > 80) {
        const words = bulletText.split(' ');
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
        doc.text(bulletText, 25, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    // Product Images Analysis
    if (data.detailedAnalysis?.productImages) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Product Images Analysis:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const imageText = String(data.detailedAnalysis.productImages);
      if (imageText.length > 80) {
        const words = imageText.split(' ');
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
        doc.text(imageText, 25, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    // Product Description Analysis
    if (data.detailedAnalysis?.productDescription) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Product Description Analysis:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const descText = String(data.detailedAnalysis.productDescription);
      if (descText.length > 80) {
        const words = descText.split(' ');
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
        doc.text(descText, 25, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    // Product Information Analysis
    if (data.detailedAnalysis?.productInformation) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Product Information Analysis:', 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const infoText = String(data.detailedAnalysis.productInformation);
      if (infoText.length > 80) {
        const words = infoText.split(' ');
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
        doc.text(infoText, 25, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    // Current Product Data (if available)
    if (data.productData) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Current Listing Data', 20, yPosition);
      yPosition += 8;
      
      if (data.productData.currentTitle) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Current Title: ${data.productData.currentTitle}`, 20, yPosition);
        yPosition += 6;
      }
      
      if (data.productData.currentBullets && data.productData.currentBullets.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text('Current Bullet Points:', 20, yPosition);
        yPosition += 5;
        data.productData.currentBullets.forEach((bullet, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${index + 1}. ${bullet}`, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 3;
      }
      
      if (data.productData.currentImages) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Current Images: ${data.productData.currentImages}`, 20, yPosition);
        yPosition += 6;
      }
      
      if (data.productData.currentDescription) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Current Description: ${data.productData.currentDescription}`, 20, yPosition);
        yPosition += 6;
      }
    }
    
    // Content Quality Scores (if available)
    if (data.contentQuality) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Content Quality Scores', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      
      if (data.contentQuality.titleScore !== undefined) {
        doc.text(`Title Quality: ${data.contentQuality.titleScore}/100`, 20, yPosition);
        yPosition += 6;
      }
      if (data.contentQuality.bulletsScore !== undefined) {
        doc.text(`Bullet Points: ${data.contentQuality.bulletsScore}/100`, 20, yPosition);
        yPosition += 6;
      }
      if (data.contentQuality.imagesScore !== undefined) {
        doc.text(`Images: ${data.contentQuality.imagesScore}/100`, 20, yPosition);
        yPosition += 6;
      }
      if (data.contentQuality.descriptionScore !== undefined) {
        doc.text(`Description: ${data.contentQuality.descriptionScore}/100`, 20, yPosition);
        yPosition += 6;
      }
      if (data.contentQuality.informationScore !== undefined) {
        doc.text(`Information: ${data.contentQuality.informationScore}/100`, 20, yPosition);
        yPosition += 6;
      }
    }
  }
  
  // Add upgrade notice for guest users
  if (isGuest) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add upgrade section
    doc.setFillColor(37, 99, 235, 0.1); // Light blue background
    doc.rect(15, yPosition - 5, 180, 40, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text('Unlock Your Full Amazon Audit Report', 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('Create your free account to access:', 105, yPosition, { align: 'center' });
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('• Complete detailed analysis and recommendations', 105, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('• Advanced competitive insights and ROI projections', 105, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('• Priority support and follow-up assistance', 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('Create Account Now - It\'s Free!', 105, yPosition, { align: 'center' });
    yPosition += 15;
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
  const isGuest = data.accessType === 'guest';
  
  // Set document properties
  doc.setProperties({
    title: isGuest ? 'Amazon Listing Pack Preview - E-CTRL' : 'Amazon Listing Pack - E-CTRL',
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
  doc.text(isGuest ? 'Amazon Listing Pack Preview' : 'Amazon Listing Pack', 105, 35, { align: 'center' });
  
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
  yPosition += 8;
  
  // Add guest access notice for new sellers
  if (isGuest) {
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22); // Orange color
    doc.text('GUEST ACCESS - LIMITED PREVIEW', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('This is a preview of your listing pack. Create a free account to unlock:', 20, yPosition);
    yPosition += 5;
    doc.text('• Complete optimised title and bullet points', 25, yPosition);
    yPosition += 4;
    doc.text('• Detailed keyword research and optimisation', 25, yPosition);
    yPosition += 4;
    doc.text('• Professional product description templates', 25, yPosition);
    yPosition += 4;
    doc.text('• Image requirements and optimisation guide', 25, yPosition);
    yPosition += 4;
    doc.text('• Compliance checklist and best practices', 25, yPosition);
    yPosition += 4;
    doc.text('• Priority support and launch assistance', 25, yPosition);
    yPosition += 10;
    
    // Add upgrade CTA
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('Create your free account now to unlock the complete listing pack!', 20, yPosition);
    yPosition += 15;
  } else {
    yPosition += 7;
  }
  
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
  
  // AI-Generated Amazon Listing Content
  if (data.idqAnalysis) {
    // Optimized Title Section
    if (data.idqAnalysis.title?.optimised) {
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // Dark navy for better contrast
      doc.text('✓ Optimized Amazon Title', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39); // Darker text for better readability
      const titleWords = data.idqAnalysis.title.optimised.split(' ');
      let titleLine = '';
      titleWords.forEach(word => {
        if ((titleLine + word).length > 80) {
          doc.text(titleLine, 20, yPosition);
          yPosition += 5;
          titleLine = word + ' ';
        } else {
          titleLine += word + ' ';
        }
      });
      if (titleLine) {
        doc.text(titleLine, 20, yPosition);
        yPosition += 5;
      }
      yPosition += 10;
    }
    
    // Optimized Bullet Points Section
    if (data.idqAnalysis.bullets?.optimised && data.idqAnalysis.bullets.optimised.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // Dark navy for better contrast
      doc.text('✓ Optimized Bullet Points', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39); // Darker text for better readability
      
      const bulletsToShow = isGuest ? data.idqAnalysis.bullets.optimised.slice(0, 3) : data.idqAnalysis.bullets.optimised;
      
      bulletsToShow.forEach((bullet, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Add bullet number and content
        doc.setTextColor(249, 115, 22); // Orange
        doc.text(`${index + 1}.`, 20, yPosition);
        doc.setTextColor(17, 24, 39); // Darker text for better readability
        
        const bulletWords = bullet.split(' ');
        let bulletLine = '';
        bulletWords.forEach(word => {
          if ((bulletLine + word).length > 70) { // Reduced for indent
            doc.text(bulletLine, 30, yPosition);
            yPosition += 5;
            bulletLine = word + ' ';
          } else {
            bulletLine += word + ' ';
          }
        });
        if (bulletLine) {
          doc.text(bulletLine, 30, yPosition);
        }
        yPosition += 8;
      });
      
      // Show limited notice for guest users
      if (isGuest && data.idqAnalysis.bullets.optimised.length > 3) {
        doc.setFontSize(10);
        doc.setTextColor(249, 115, 22);
        doc.text(`+ ${data.idqAnalysis.bullets.optimised.length - 3} more bullet points in full listing pack`, 30, yPosition);
        yPosition += 8;
      }
      
      yPosition += 5;
    }
    
    // Optimized Description Section
    if (data.idqAnalysis.description?.optimised) {
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // Dark navy for better contrast
      doc.text('✓ Optimized Product Description', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39); // Darker text for better readability
      
      const descWords = data.idqAnalysis.description.optimised.split(' ');
      let descLine = '';
      descWords.forEach(word => {
        if ((descLine + word).length > 80) {
          doc.text(descLine, 20, yPosition);
          yPosition += 5;
          descLine = word + ' ';
        } else {
          descLine += word + ' ';
        }
      });
      if (descLine) {
        doc.text(descLine, 20, yPosition);
        yPosition += 5;
      }
      yPosition += 10;
    }
  }
  
  // Product description (fallback)
  if (!data.idqAnalysis && data.productDesc) {
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
    doc.setTextColor(17, 24, 39); // Darker text for better readability
    
    // Limit keywords for guest users
    const keywordsToShow = isGuest ? data.keywords.slice(0, 5) : data.keywords;
    
    keywordsToShow.forEach((keyword, index) => {
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
    
    // Show limited notice for guest users
    if (isGuest && data.keywords.length > 5) {
      doc.setFontSize(10);
      doc.setTextColor(249, 115, 22);
      doc.text(`+ ${data.keywords.length - 5} more keywords in full listing pack`, 25, yPosition);
      yPosition += 5;
    }
    
    yPosition += 10;
  }
  
  // Detailed analysis section (only for account users)
  if (!isGuest && data.detailedAnalysis) {
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
        // Skip idqAnalysis and summary as they're handled separately above
        if (key === 'idqAnalysis' || key === 'summary') {
          return;
        }
        
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
  
  // Add upgrade notice for guest users
  if (isGuest) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add upgrade section
    doc.setFillColor(37, 99, 235, 0.1); // Light blue background
    doc.rect(15, yPosition - 5, 180, 40, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text('Unlock Your Complete Amazon Listing Pack', 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('Create your free account to access:', 105, yPosition, { align: 'center' });
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('• Complete optimised title and bullet points', 105, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('• Detailed keyword research and optimisation', 105, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('• Professional product description templates', 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('Create Account Now - It\'s Free!', 105, yPosition, { align: 'center' });
    yPosition += 15;
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
