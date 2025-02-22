const SHEET_ID = '1UUbJylU2f84to7tYUzdAAephWcfYjrIJLiTbknUz7iY'; // Use your actual Sheet ID
const SHEET_NAME = 'Sheet1'; // Or the name of the sheet you want to write to

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
  // Tracking logic here
  Logger.log(`Tracking conversion for ${leadData.email}`); // Example logging
}

function isQualifiedLead(leadData) {
  // Qualification logic here
  return leadData.score >= 70; // Example qualification
}

function postToAnalytics(analyticsData) {
  // Analytics posting logic here
  Logger.log(`Posting to analytics: ${JSON.stringify(analyticsData)}`); // Example logging
}

function getActiveTestVariant() {
  // A/B test variant retrieval logic here
  return 'A'; // Example default variant
}

function getExposureDate(exposureYears) {
  // Exposure date calculation logic here
  return new Date(2010, 0, 1); // Example date
}

function processNewLead(formData) {
  try {
    // Verify US residency - Assuming this is captured in the form
    if (formData.usResident !== 'Yes') {
      return {
        success: false,
        error: 'Only US residents are eligible at this time'
      };
    }

    // Add TCPA compliance timestamp
    const leadData = {
      ...formData,
      tcpaConsent: {
        timestamp: new Date().toISOString(),
        // You'll need to find a way to capture IP and userAgent.  This is trickier in a web app.
        // Consider using a 3rd party service or server-side code to get this info.
        ip: 'N/A',
        userAgent: 'N/A'
      }
    };

    // Check statute of limitations
    const state = leadData.state;
    const diagnosisDate = new Date(leadData.exposureDate); // Assuming exposure date is relevant
    if (!isWithinStatuteOfLimitations(state, diagnosisDate)) {
      //logLeadActivity(rowId, 'SOL Issue'); // Need to create row first
      return {
        success: false,
        error: 'Claim may be outside statute of limitations'
      };
    }

    // Add lead scoring
    const scoringResult = scoreLead(leadData);
    leadData.score = scoringResult.score;
    leadData.tier = scoringResult.tier;

    // Add UTM tracking - Assuming these are passed in the form
    leadData.utm = {
      source: formData.utm_source || 'N/A',
      medium: formData.utm_medium || 'N/A',
      campaign: formData.utm_campaign || 'N/A'
    };

    // Add A/B test variant - Assuming this is tracked client-side and passed
    leadData.variant = formData.ab_variant || 'N/A';

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rowId = addLeadToSheet(sheet, leadData);
    
    logLeadActivity(rowId, 'Lead created');
    
    trackConversion(leadData);

    if (isQualifiedLead(leadData)) {
      sendPriorityNotification(leadData);
      logLeadActivity(rowId, 'Priority notification sent');
    }

    sendAutoResponse(leadData);
    return { success: true, leadId: rowId };
  } catch (error) {
    trackError(error, 'processNewLead', formData);
    console.error("Error in processNewLead:", error); // Add this line
    return { success: false, error: 'An unexpected error occurred. Our team has been notified.' };
  }
}

function sendPriorityNotification(leadData) {
  MailApp.sendEmail({
    to: 'intake@lawfirm.com',
    subject: 'High-Priority Paraquat Lead',
    body: `New qualified lead:\nName: ${leadData.name}\nPhone: ${leadData.phone}\nEmail: ${leadData.email}`
  });
}

function sendAutoResponse(leadData) {
  const template = getEmailTemplate('auto-response');
  const body = template
    .replace('{{name}}', leadData.name)
    .replace('{{unsubscribeLink}}', generateUnsubscribeLink(leadData.email));
    
  MailApp.sendEmail({
    to: leadData.email,
    subject: 'Your Paraquat Case Evaluation Request',
    body: body,
    noReply: true
  });
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

setupErrorTracking();
