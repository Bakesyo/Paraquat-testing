const SHEET_ID = 'AKfycbyZ3XCq7ohMgJ4xqu7DnVrA1Bsaevq8Ke9_X80FLFnrzu5afAv41FJ6wIrM6hy9clRz'; // Use your actual Sheet ID
const SHEET_NAME = 'Paraquat Leads'; // Or the name of the sheet you want to write to

function addLeadToSheet(sheet, leadData) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = [];

  // Ensure all headers have a corresponding value, even if it's empty
  headers.forEach(header => {
    newRow.push(leadData[header] || '');
  });

  sheet.appendRow(newRow);
  return sheet.getLastRow(); // Return the row ID
}

function validateAndSanitizeData(formResponse) {
  const data = {};
  // Sanitize and validate each field
  data.fullName = formResponse.fullName; // Example: basic sanitization
  data.phone = formResponse.phone;
  data.email = formResponse.email;
  data.exposureDate = formResponse.exposureDate;
  data.state = formResponse.state;
  data.parkinsonsDiagnosis = formResponse.parkinsonsDiagnosis;

  return data;
}

function getEmailTemplate(templateName) {
  const templates = {
    'auto-response': `Dear {{name}},\n\nThank you for your inquiry!\n\n<a href="{{unsubscribeLink}}">Unsubscribe</a>`
  };
  return templates[templateName] || 'Default Template';
}

function generateUnsubscribeLink(email) {
  return `https://example.com/unsubscribe?email=${email}`; // Replace with your actual unsubscribe link
}

function logLeadActivity(rowId, activity) {
  const now = new Date();
  const timestamp = now.toISOString();
  Logger.log(`[${timestamp}] Row ${rowId}: ${activity}`); // Example logging with timestamp
}

function trackConversion(leadData) {
  // Email and Analytics conversion tracking removed.
  Logger.log(`Conversion tracking removed for ${leadData.email}`);
}

function isQualifiedLead(leadData) {
  // Qualification logic here
  return leadData.score >= 70; // Example qualification
}

function postToAnalytics(analyticsData) {
  // Analytics posting removed.
  Logger.log(`postToAnalytics removed: ${JSON.stringify(analyticsData)}`);
}

function getActiveTestVariant() {
  // Example: Retrieve variant from PropertiesService (can be set elsewhere)
  const variant = PropertiesService.getScriptProperties().getProperty('ab_variant') || 'A';
  return variant;
}

function getExposureDate(exposureYears) {
  try {
    // Example: Calculate exposure date based on years ago
    const currentYear = new Date().getFullYear();
    const exposureYear = currentYear - parseInt(exposureYears, 10);
    return new Date(exposureYear, 0, 1); // January 1st of that year
  } catch (error) {
    trackError(error, 'getExposureDate', exposureYears);
    return new Date(2010, 0, 1); // Default date on error
  }
}

function processNewLead(formData) {
  try {
    // Removed disqualifying checks (US residency, SOL, etc.)
    // Instead, proceed with processing every lead

    // Optionally sanitize or transform formData as needed.
    const leadData = {
      ...formData,
      tcpaConsent: {
        timestamp: new Date().toISOString(),
        ip: 'N/A',
        userAgent: 'N/A'
      }
    };

    // Proceed to record the lead in the sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rowId = addLeadToSheet(sheet, leadData);
    logLeadActivity(rowId, 'Lead created');

    trackConversion(leadData);
    
    // Always send notifications now that all leads are treated as qualifying.
    sendPriorityNotification(leadData);
    logLeadActivity(rowId, 'Priority notification removed');

    sendAutoResponse(leadData);
    return { success: true, leadId: rowId };
  } catch (error) {
    trackError(error, 'processNewLead', formData);
    console.error("Error in processNewLead:", error);
    return { success: false, error: 'An unexpected error occurred. Our team has been notified.' };
  }
}

function sendPriorityNotification(leadData) {
  // Priority notification removed.
  Logger.log(`Priority notification removed for ${leadData.email}`);
}

function sendAutoResponse(leadData) {
  // Auto-response removed.
  Logger.log(`Auto-response removed for ${leadData.email}`);
}

function isWithinStatuteOfLimitations(state, diagnosisDate) {
  const stateLimits = {
    'AL': 2,
    'AK': 2,
    'AZ': 2,
    'AR': 3,
    'CA': 2,
    'CO': 2,
    'CT': 3,
    'DE': 2,
    'FL': 4,
    'GA': 2,
    'HI': 2,
    'ID': 2,
    'IL': 2,
    'IN': 2,
    'IA': 2,
    'KS': 2,
    'KY': 1,
    'LA': 1,
    'ME': 6,
    'MD': 3,
    'MA': 3,
    'MI': 3,
    'MN': 2,
    'MS': 3,
    'MO': 5,
    'MT': 3,
    'NE': 4,
    'NV': 2,
    'NH': 3,
    'NJ': 2,
    'NM': 3,
    'NY': 3,
    'NC': 3,
    'ND': 6,
    'OH': 2,
    'OK': 2,
    'OR': 2,
    'PA': 2,
    'RI': 3,
    'SC': 3,
    'SD': 3,
    'TN': 1,
    'TX': 2,
    'UT': 4,
    'VT': 3,
    'VA': 2,
    'WA': 3,
    'WV': 2,
    'WI': 3,
    'WY': 4
  };
  const limit = stateLimits[state] || 2; // Default to 2 years if state not found
  const now = new Date();
  const years = (now - diagnosisDate) / (1000 * 60 * 60 * 24 * 365);
  return years <= limit;
}

function scoreLead(leadData) {
  let score = 0;
  
  // Calculate base score
  score += SCORING_CRITERIA.exposureType[leadData.exposureType] || 0;
  score += SCORING_CRITERIA.exposureDuration[leadData.exposureDuration] || 0;
  
  // Add diagnosis scoring
  if (leadData.parkinsonsStatus === 'Yes') {
    score += SCORING_CRITERIA.diagnosisStatus.confirmed;
    
    // Check diagnosis timeline
    const diagnosisDate = new Date(leadData.diagnosisDate);
    const exposureDate = getExposureDate(leadData.exposureYears);
    if (diagnosisDate > exposureDate) {
      score += SCORING_CRITERIA.diagnosisTimeline.after_exposure;
    }
  }
  
  // Apply state multiplier
  const stateMultiplier = SCORING_CRITERIA.stateMultipliers[leadData.state] || 
                         SCORING_CRITERIA.stateMultipliers.default;
  score *= stateMultiplier;

  return {
    score: Math.round(score),
    tier: getTier(score),
    nextActions: getRecommendedActions(score, leadData)
  };
}

function setupErrorTracking() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (!ss.getSheetByName('Errors')) {
    const errorSheet = ss.insertSheet('Errors');
    errorSheet.appendRow([
      'Timestamp',
      'Error Message',
      'Stack Trace',
      'Context',
      'User Data',
      'IP Address',
      'Browser'
    ]);
  }
}

function trackError(error, functionName, context) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const errorSheet = ss.getSheetByName('Errors');
    
    let userData = 'N/A';
    try {
      userData = Session.getActiveUser().getEmail();
    } catch (e) {
      userData = 'User email not available';
    }
    
    // Attempt to get IP address and browser info (more complex in GAS)
    const ipAddress = 'N/A';
    const browser = 'N/A';
    
    errorSheet.appendRow([
      new Date().toISOString(),
      error.message,
      error.stack || 'No stack trace',
      functionName,
      JSON.stringify(context),
      ipAddress,
      browser,
      userData // Include user data in error log
    ]);
  } catch (e) {
    Logger.log('Error logging failed: ' + e);
  }
}

setupErrorTracking();
