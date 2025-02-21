const ANALYTICS_CONFIG = {
  goals: {
    form_start: { id: 'G-1', value: 10 },
    form_complete: { id: 'G-2', value: 50 },
    qualified_lead: { id: 'G-3', value: 100 }
  },
  
  eventTracking: {
    form_progression: true,
    qualification_status: true,
    source_tracking: true
  },

  conversionTracking: {
    google_ads: {
      conversion_id: 'AW-CONVERSION_ID',
      conversion_label: 'LABEL_ID'
    },
    facebook: {
      pixel_id: 'PIXEL_ID',
      event_name: 'Lead'
    }
  }
};

function trackFormProgress(step, data) {
  gtag('event', 'form_progress', {
    'step': step,
    'qualified': data.isQualified,
    'source': data.utm_source
  });
}

function trackQualifiedLead(leadData) {
  // Track across multiple platforms
  googleAdsConversion(leadData);
  facebookPixelEvent(leadData);
  customAnalyticsEvent(leadData);
}
