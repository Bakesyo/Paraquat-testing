const ERROR_SHEET_NAME = 'Errors';

function trackError(error, context, userData = {}) {
  const errorSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ERROR_SHEET_NAME);
  
  const errorData = [
    new Date(),
    error.message,
    error.stack,
    context,
    JSON.stringify(userData)
  ];
  
  errorSheet.appendRow(errorData);
  
  // Send alert if critical error
  if (isCriticalError(error)) {
    sendErrorAlert(error, context);
  }
}

function isCriticalError(error) {
  const criticalPatterns = [
    'Sheet not found',
    'Access denied',
    'Invalid credentials',
    'Rate limit exceeded'
  ];
  
  return criticalPatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern.toLowerCase())
  );
}

function sendErrorAlert(error, context) {
  MailApp.sendEmail({
    to: 'admin@example.com',
    subject: 'Critical Error in Paraquat Lead Form',
    body: `
Error: ${error.message}
Context: ${context}
Stack: ${error.stack}
Time: ${new Date().toISOString()}
    `
  });
}
