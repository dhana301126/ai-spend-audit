# Reflection

## 1. Hardest Bug

The hardest bug I hit was a build error on the results page caused by the arrow 
symbol → in JSX. The error message said "Expression expected" at a specific line 
number but didn't clearly explain why. 

My first hypothesis was that the JSX was malformed — a missing closing tag somewhere. 
I checked all the div tags and they looked correct. My second hypothesis was that 
the component structure was wrong. I tried moving sections around but the error persisted.

Eventually I realized the → symbol itself was being interpreted as JSX syntax rather 
than a text character. In JSX, certain characters need to be escaped or avoided. 
I tried replacing it with &rarr; HTML entity but that caused a different parsing error. 
Finally I replaced the anchor tag with a button element using onClick and 
window.open() which completely avoided the problem.

The lesson: when JSX throws "Expression expected", check for special characters 
in text content first before assuming the component structure is wrong.

## 2. A Decision I Reversed

I initially planned to use in-memory storage for audit results — just a JavaScript 
object on the server. This was fast to implement and worked locally.

I reversed this decision when I realized that Vercel serverless functions don't 
share memory between invocations. Every API call spins up a fresh function instance. 
This meant if a user created an audit and then tried to view it, the data would 
be gone — the second request hit a different function instance with an empty store.

Switching to Supabase fixed this completely. Every audit is now persisted in 
Postgres and retrievable by ID regardless of which function instance handles the request.

## 3. What I Would Build in Week 2

- PDF export of the full audit report so users can share it with their CFO
- Benchmark mode showing "your AI spend per developer is $X, companies your size average $Y"
- Embeddable widget so bloggers and newsletters can drop the audit form into their content
- Referral system where sharing your audit URL gives both parties a discount on Credex credits
- Email sequence — not just one confirmation email but a 3-email drip with optimization tips

## 4. How I Used AI Tools

I used Claude extensively throughout this project. Specifically:
- Generating boilerplate code for API routes and TypeScript types
- Debugging error messages by pasting the error and asking for hypotheses
- Writing the markdown documentation files
- Suggesting the Supabase schema structure

What I did NOT trust AI with:
- The audit engine logic — I reviewed every pricing rule manually against vendor websites
- The final commit messages — I wrote these myself to accurately describe what changed
- The user interview questions — these had to come from real conversations

One specific time the AI was wrong: Claude suggested using the → arrow character 
directly in JSX text content. This caused a build error. I had to debug this myself 
and find the workaround of using a button with window.open() instead of an anchor tag.

## 5. Self Rating

- **Discipline: 7/10** — I committed every day but some days were shorter than ideal due to time constraints from upcoming semester exams.
- **Code quality: 7/10** — The code is readable and typed but I would add more error handling and loading states with more time.
- **Design sense: 8/10** — The dark theme with green accents looks professional and the layout is clean and scannable.
- **Problem solving: 8/10** — Debugged the JSX arrow bug and the serverless memory issue independently without giving up.
- **Entrepreneurial thinking: 7/10** — I understood the user and the lead gen model but would do more user research with more time.