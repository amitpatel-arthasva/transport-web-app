const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// Browser instance pool for reuse
let browserInstance = null;
let browserUseCount = 0;
const MAX_BROWSER_USES = 50; // Restart browser after 50 uses to prevent memory leaks

/**
 * Get or create a shared browser instance
 * @returns {Promise<Browser>} - Puppeteer browser instance
 */
const getBrowserInstance = async () => {
  if (!browserInstance || !browserInstance.isConnected() || browserUseCount >= MAX_BROWSER_USES) {
    if (browserInstance) {
      try {
        await browserInstance.close();
      } catch (error) {
        console.warn('Error closing browser instance:', error);
      }
    }
    
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Overcome limited resource problems
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    };
    
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
    browserInstance = await puppeteer.launch(launchOptions);
    browserUseCount = 0;
  }
  
  browserUseCount++;
  return browserInstance;
};

/**
 * Clean up browser instance
 */
const closeBrowserInstance = async () => {
  if (browserInstance) {
    try {
      await browserInstance.close();
      browserInstance = null;
      browserUseCount = 0;
    } catch (error) {
      console.warn('Error closing browser instance:', error);
    }
  }
};

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
  let page = null;
  
  try {
    // Use shared browser instance
    browser = await getBrowserInstance();

    // Create a new page
    page = await browser.newPage();
    
    // Optimize page settings for PDF generation
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    
    // Set content to the page with optimized wait options
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded' // Changed from networkidle0 for better performance
    });

    // Generate PDF with optimized settings
    const defaultPdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      preferCSSPageSize: false // Improve performance
    };

    const pdf = await page.pdf({
      ...defaultPdfOptions,
      ...pdfOptions
    });

    // If outputPath is provided, save the PDF to the filesystem
    if (outputPath) {
      const pdfPath = path.posix.join(outputPath, `${filename}.pdf`);
      await writeFileAsync(pdfPath, pdf);
      console.log(`PDF saved to ${pdfPath}`);
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Only close the page, not the browser
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.warn('Error closing page:', error);
      }
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
  let page = null;
  
  try {
    // Use shared browser instance
    browser = await getBrowserInstance();

    // Create a new page
    page = await browser.newPage();
    
    // Optimize page settings
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    
    // Navigate to the URL with optimized wait options
    await page.goto(url, {
      waitUntil: 'domcontentloaded' // Changed from networkidle0 for better performance
    });

    // Generate PDF with the same options as generatePdfFromHtml
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      preferCSSPageSize: false,
      ...options.pdfOptions
    });
  } catch (error) {
    console.error('Error generating PDF from URL:', error);
    throw error;
  } finally {
    // Only close the page, not the browser
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.warn('Error closing page:', error);
      }
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
  generatePdfFromTemplate,
  closeBrowserInstance // Export for cleanup
};