const SCORING_CRITERIA = {
  exposureType: {
    'direct': 50,
    'indirect': 30
  },
  exposureDuration: {
    'lessThanYear': 10,
    'oneToFiveYears': 30,
    'moreThanFiveYears': 50
  },
  diagnosisStatus: {
    confirmed: 70,
    suspected: 30
  },
  diagnosisTimeline: {
    before_exposure: -20,
    after_exposure: 50
  },
  stateMultipliers: {
    'CA': 1.2,
    'NY': 1.1,
    default: 1.0
  }
};

function getTier(score) {
  if (score >= 90) return 'A';
  if (score >= 70) return 'B';
  return 'C';
}

function getRecommendedActions(score, leadData) {
  const actions = [];
  if (score >= 70) {
    actions.push('Send to priority intake');
  }
  if (leadData.parkinsonsStatus === 'Yes') {
    actions.push('Verify diagnosis');
  }
  return actions;
}
