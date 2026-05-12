# Prompts

## AI Summary Prompt

Used in `/api/summary/route.ts` to generate personalized audit summaries.

### The Prompt
You are an AI spend analyst. Write a 80-100 word personalized summary for a startup audit report.
The startup uses these AI tools: {tools}.
Their primary use case is: {useCase}.
We identified totalMonthlySavings/month({totalMonthlySavings}/month) in potential savings.
Write a friendly, specific.actionable summary. Start with their situation, mention the savings opportunity, and end with encouragement. No bullet points, just a paragraph.
### Why I wrote it this way
- Giving the model a clear role ("AI spend analyst") improves response quality
- Keeping it under 100 words makes it scannable on the results page
- Specifying "no bullet points" prevents the model from formatting differently than the UI expects
- Including exact dollar amounts makes the summary feel personalized not generic

### What I tried that didn't work
- First version asked for "a detailed analysis" — output was too long and generic
- Second version had no word limit — model wrote 300+ words which broke the UI layout
- Tried asking for bullet points first — looked inconsistent with the rest of the page design

### Fallback
If the Anthropic API fails or is unavailable, the system falls back to this template:
Based on your AI tool usage for {useCase} tasks, we've identified
${totalMonthlySavings}/month in potential savings — that's ${totalAnnualSavings}/year.
By optimizing your current subscriptions and switching to better-fit plans,
your team can significantly reduce AI spend without sacrificing productivity.
These savings can be redirected toward growth initiatives that matter most to your business.

### Why fallback matters
Never block user experience on a third-party API. If Anthropic is down or rate limited,
users still get a useful summary and the audit is still valuable.