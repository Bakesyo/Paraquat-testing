const SHEET_ID = 'your-sheet-id';
const SHEET_NAME = 'Leads';

function processNewLead(formResponse) {
  try {
    // Verify US residency
    if (!formResponse.getResponseForQuestion('usResident') === 'Yes') {
      return {
        success: false,
        error: 'Only US residents are eligible at this time'
      };
    }

    const leadData = validateAndSanitizeData(formResponse);
    
    // Check statute of limitations
    const state = leadData.state;
    const diagnosisDate = new Date(leadData.diagnosisDate);
    if (!isWithinStatuteOfLimitations(state, diagnosisDate)) {
      logLeadActivity(rowId, 'SOL Issue');
      return {
        success: false,
        error: 'Claim may be outside statute of limitations'
      };
    }

    // Add TCPA compliance timestamp
    leadData.tcpaConsent = {
      timestamp: new Date().toISOString(),
      ip: formResponse.ip,
      userAgent: formResponse.userAgent
    };

    if (!leadData) return;

    // Add lead scoring
    const scoringResult = scoreLead(leadData);
    leadData.score = scoringResult.score;
    leadData.tier = scoringResult.tier;

    // Add UTM tracking
    leadData.utm = {
      source: formResponse.getResponseForQuestion('utm_source'),
      medium: formResponse.getResponseForQuestion('utm_medium'),
      campaign: formResponse.getResponseForQuestion('utm_campaign')
    };

    // Add A/B test variant
    leadData.variant = getActiveTestVariant();

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rowId = addLeadToSheet(sheet, leadData);
    
    logLeadActivity(rowId, 'Lead created');
    
    // Track conversion in Analytics
    trackConversion(leadData);

    if (isQualifiedLead(leadData)) {
      sendPriorityNotification(leadData);
      logLeadActivity(rowId, 'Priority notification sent');
    }

    sendAutoResponse(leadData);
    return { success: true, leadId: rowId };
  } catch (error) {
    Logger.log(`Error processing lead: ${error.message}`);
    return { success: false, error: error.message };
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

function validateAndSanitizeData(formResponse) {
  // Add input validation
  const data = {};
  // Validation logic here
  return data;
}

function logLeadActivity(rowId, activity) {
  // Logging logic here
}

function trackConversion(leadData) {
  const analyticsData = {
    client_id: leadData.gaClientId,
    event_name: 'lead_submission',
    value: leadData.score,
    properties: {
      lead_tier: leadData.tier,
      form_variant: leadData.variant
    }
  };
  
  postToAnalytics(analyticsData);
}

function isWithinStatuteOfLimitations(state, diagnosisDate) {
  const stateLimits = {
    'IL': 2, // years
    'CA': 2,
    // Add other states
  };
  const limit = stateLimits[state] || 2; // Default to 2 years
  const now = new Date();
  const years = (now - diagnosisDate) / (1000 * 60 * 60 * 24 * 365);
  return years <= limit;
}
