const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

/**
 * Generate a PDF from HTML content
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {Object} options - PDF generation options
 * @param {string} options.filename - The name of the PDF file (without extension)
 * @param {string} options.outputPath - The directory to save the PDF (optional)
 * @param {Object} options.pdfOptions - Puppeteer PDF options (optional)
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generatePdfFromHtml = async (htmlContent, options = {}) => {
  const {
    filename = 'document',
    outputPath = null,
    pdfOptions = {}
  } = options;

  let browser = null;
  try {
    // Launch a new browser instance
    browser = await puppeteer.launch({
      headless: 'new', // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create a new page
    const page = await browser.newPage();
    
    // Set content to the page
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0' // Wait until network is idle (no more than 0 network connections for 500ms)
    });

    // Generate PDF
    const defaultPdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    };

    const pdf = await page.pdf({
      ...defaultPdfOptions,
      ...pdfOptions
    });

    // If outputPath is provided, save the PDF to the filesystem
    if (outputPath) {
      const pdfPath = path.join(outputPath, `${filename}.pdf`);
      await writeFileAsync(pdfPath, pdf);
      console.log(`PDF saved to ${pdfPath}`);
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Generate a PDF from a URL
 * @param {string} url - The URL to convert to PDF
 * @param {Object} options - PDF generation options
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generatePdfFromUrl = async (url, options = {}) => {
  let browser = null;
  try {
    // Launch a new browser instance
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create a new page
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with the same options as generatePdfFromHtml
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      ...options.pdfOptions
    });
  } catch (error) {
    console.error('Error generating PDF from URL:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Generate a PDF from a template with data
 * @param {Function} templateFn - Function that takes data and returns HTML
 * @param {Object} data - Data to be passed to the template
 * @param {Object} options - PDF generation options
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generatePdfFromTemplate = async (templateFn, data, options = {}) => {
  try {
    // Validate that data exists and is an object
    if (!data || typeof data !== 'object') {
      throw new Error('Template data is missing or invalid');
    }
    
    // Generate HTML content with error handling
    let htmlContent;
    try {
      htmlContent = templateFn(data);
    } catch (templateError) {
      console.error('Error generating HTML from template:', templateError);
      throw new Error(`Template processing failed: ${templateError.message}`);
    }
    
    // Ensure htmlContent is valid
    if (!htmlContent || typeof htmlContent !== 'string') {
      throw new Error('Template function did not return valid HTML');
    }
    
    return generatePdfFromHtml(htmlContent, options);
  } catch (error) {
    console.error('PDF template generation error:', error);
    throw error;
  }
};

module.exports = {
  generatePdfFromHtml,
  generatePdfFromUrl,
  generatePdfFromTemplate
};