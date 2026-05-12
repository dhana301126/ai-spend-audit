# Metrics

## North Star Metric
**Number of audits completed per week**

This is the right metric because every completed audit is a potential lead for Credex. 
A user who completes an audit has seen value — they're the warmest possible lead.
DAU would be wrong because this is a tool people use once a quarter, not daily.

## 3 Input Metrics

1. **Landing page → audit started conversion rate**
   - Measures if the hero and form are compelling enough
   - Target: >60% of visitors start filling the form

2. **Audit started → audit completed conversion rate**
   - Measures if the form is too long or confusing
   - Target: >80% of started audits get submitted

3. **Audit completed → email captured rate**
   - Measures if the results page shows enough value to earn the email
   - Target: >40% of completed audits result in email capture

## What to Instrument First
- Pageview on homepage
- Form start event (first field interaction)
- Audit submitted event
- Results page loaded event
- Email captured event
- Shareable link copied event
- Credex CTA clicked event (for high savings audits)

## Pivot Trigger
If after 500 audits the email capture rate is below 20%, the results page is not 
showing enough value. That triggers a redesign of the results page before any 
further distribution spend.

If after 1000 audits the Credex CTA click rate is below 5% for high-savings users,
the connection between savings and Credex needs to be made clearer or the 
savings threshold needs adjustment.