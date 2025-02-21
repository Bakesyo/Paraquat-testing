const SCORING_CRITERIA = {
  exposureType: {
    'Licensed Applicator': 40,
    'Farmer/Agricultural Worker': 35,
    'Mixed/Loaded Chemical': 30,
    'Worked/Lived Near Sprayed Areas': 20,
    'Other': 10,
    'Not Sure': 5
  },
  exposureDuration: {
    'More than 10 years': 40,
    '5-10 years': 30,
    '1-5 years': 20,
    'Less than 1 year': 10
  },
  diagnosisStatus: {
    'confirmed': 50,
    'symptoms': 20,
    'none': 0
  },
  diagnosisTimeline: {
    'after_exposure': 30,
    'before_exposure': -50,
    'uncertain': 0
  },
  // State multipliers based on jurisdiction favorability
  stateMultipliers: {
    'IL': 1.2, // MDL location
    'CA': 1.15,
    'FL': 1.1,
    'TX': 1.1,
    'default': 1.0
  }
};

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

function getTier(score) {
  if (score >= 80) return 'HOT';
  if (score >= 60) return 'WARM';
  return 'COLD';
}
