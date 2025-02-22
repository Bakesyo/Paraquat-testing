function runAllTests() {
  const tests = [
    testLeadScoring,
    testStatuteOfLimitations,
    testDataValidation,
    testEmailTemplates,
    testErrorTracking,
    testLeadProcessing
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      test();
      passed++;
      Logger.log(`✅ ${test.name} passed`);
    } catch (error) {
      failed++;
      Logger.log(`❌ ${test.name} failed: ${error.message}`);
    }
  });

  Logger.log(`Tests completed: ${passed} passed, ${failed} failed`);
}

function testLeadScoring() {
  const testData = {
    exposureType: 'Licensed Applicator',
    exposureDuration: 'More than 10 years',
    parkinsonsStatus: 'Yes',
    state: 'IL'
  };

  const result = scoreLead(testData);
  
  if (result.score < 80) throw new Error('High-quality lead scored too low');
  if (result.tier !== 'HOT') throw new Error('Expected HOT tier for high-scoring lead');
}

function testStatuteOfLimitations() {
  const state = 'IL';
  const withinLimit = isWithinStatuteOfLimitations(state, new Date());
  const outsideLimit = isWithinStatuteOfLimitations(state, new Date('2010-01-01'));
  
  if (!withinLimit) throw new Error('Current date should be within SOL');
  if (outsideLimit) throw new Error('2010 date should be outside SOL');
}

function testDataValidation() {
  const testData = {
    fullName: 'John Doe',
    phone: '1234567890',
    email: 'test@example.com'
  };

  const validatedData = validateAndSanitizeData(testData);
  
  if (!validatedData.fullName) throw new Error('Name validation failed');
  if (!validatedData.phone) throw new Error('Phone validation failed');
  if (!validatedData.email) throw new Error('Email validation failed');
}

function testEmailTemplates() {
  const template = getEmailTemplate('auto-response');
  if (!template.includes('{{name}}')) throw new Error('Template missing name placeholder');
  if (!template.includes('{{unsubscribeLink}}')) throw new Error('Template missing unsubscribe link');
}

function testErrorTracking() {
  const testError = new Error('Test error');
  const context = 'test_context';
  const userData = { test: 'data' };
  
  trackError(testError, context, userData);
  
  const errorSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Errors');
  const lastRow = errorSheet.getLastRow();
  const lastEntry = errorSheet.getRange(lastRow, 1, 1, 5).getValues()[0];
  
  if (!lastEntry[0]) throw new Error('Error timestamp not recorded');
  if (!lastEntry[1].includes('Test error')) throw new Error('Error message not recorded');
}

function testLeadProcessing() {
  const testLead = {
    fullName: 'Test User',
    phone: '1234567890',
    email: 'test@example.com',
    state: 'IL',
    exposureDate: '2020-01-01',
    parkinsonsDiagnosis: 'Yes',
    usResident: 'Yes'
  };
  
  const result = processNewLead(testLead);
  
  if (!result.success) throw new Error('Lead processing failed');
  if (!result.leadId) throw new Error('Lead ID not returned');
}
