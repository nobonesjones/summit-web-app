Once we have completed the form we must now put togehter an impactful and informative business plan for the user. 

We will use some of the research gathered fromt he form along with a high quality perplexity search using the perplexity API to gather some further information. 

Compile it in to a document in the back end and then use that as a knowledge soruce to generate parts of the business plan for the users. 


Step 2
Each business plan must to categorised into 3 section; 

"New Company" for those that answered, concept / Idea, prototype / MVP, or First Few Customers on question 5.
"Scale-Up" for those that answered Already In Business Scaling Up on question 5. 
"Established" for those that answered Established Business on question 5. 


We will need to use a different prompt for the perplexity research step depending on the category the plan is in. 

"New Company" peplexity prompt; 

# Comprehensive Business Plan Research for [COMPANY TYPE] in [LOCATION] a.

Please conduct thorough research to help create an actionable business plan for a newly launched company in [LOCATION]. Focus on practical, data-driven insights rather than generic business language.


## Market Analysis
- What is the current size and growth rate of the [INDUSTRY] in [LOCATION]?
- What are the most significant market trends affecting new entrants in this industry?
- Who are the top 3-5 direct competitors for a [COMPANY TYPE] in [LOCATION], and what are their strengths/weaknesses?
- What is the typical customer acquisition cost (CAC) and customer lifetime value (LTV) in this industry?
- What specific customer pain points remain unsolved or poorly addressed in this market?

## Customer & Product Validation
- What evidence exists that customers in [LOCATION] are actively seeking better solutions in this space?
- What pricing models are most successful for new entrants in this industry?
- What minimum viable product features are essential for initial customer traction?
- What expansion opportunities should be considered for years 2-3?
- What early validation metrics are most predictive of success in this industry?

## Marketing & Acquisition Strategy
- What digital marketing channels have proven most cost-effective for new [INDUSTRY] companies?
- What specific social media platforms and content types perform best in this industry?
- What are typical conversion rates from different marketing channels in this space?
- What strategic partnerships or distribution channels could provide early traction?
- What messaging and positioning differentiators are most effective against established competitors?

## Operations & Execution
- What key roles and skills are most critical for a new [COMPANY TYPE] in the first 12 months?
- What are the most common operational challenges facing new entrants in this industry?
- What technology infrastructure is essential versus optional for initial operations?
- What regulatory or compliance issues must be addressed before or shortly after launch?
- What are the typical burn rates and runway requirements for similar startups?

## Risk Assessment
- What are the top 3 reasons new companies in this industry typically fail?
- What early warning indicators should be monitored to avoid common pitfalls?
- What market risks or competitive threats are most likely to impact a new entrant?
- What contingency plans do successful companies in this space typically prepare?
- What specific financial or operational risks should be prioritized for mitigation?

## Financial Planning
- What are typical gross margins in this industry for new companies?
- What is a realistic timeline to break-even for a new [COMPANY TYPE]?
- What funding amounts have similar companies raised at launch and 12 months post-launch?
- What are the most critical financial metrics investors look for in this industry?
- What cost structure optimizations provide the biggest impact in the first year?

Please provide specific data, examples from successful companies, and actionable insights rather than general principles. Include relevant statistics, benchmarks, and industry-specific metrics whenever possible.

"Scale Up" peplexity prompt;
# Comprehensive Business Plan Research for [COMPANY TYPE] in [LOCATION] a.

Please conduct thorough research to help create an actionable business plan for a newly launched [stage of company] in [LOCATION]. Focus on practical, data-driven insights rather than generic business language.

Please conduct thorough research to help create an actionable business plan for a scale-up [COMPANY TYPE] in [LOCATION] that has achieved product-market fit and is now focused on growth. Focus on practical, data-driven insights rather than generic business language.
Market Expansion Analysis

What is the total addressable market size beyond our current customer segments for [INDUSTRY] in and beyond [LOCATION]?
What adjacent markets or customer segments represent the most viable expansion opportunities?
Which market trends are creating new growth opportunities in this industry over the next 2-3 years?
Which competitors are currently scaling successfully, and what growth strategies are they employing?
What international or new regional markets should be prioritized for expansion?

Growth Strategy & Revenue Optimization

What are the typical revenue growth rates for successful scale-ups in this industry?
What pricing optimization strategies have proven most effective for growing companies in this space?
How are successful companies in this industry expanding their product/service offerings?
What customer retention metrics and strategies correlate with successful scaling?
What upselling and cross-selling approaches are most effective in increasing customer lifetime value?

Marketing & Brand Development

What marketing budget as a percentage of revenue is typical for successful scale-ups in this industry?
Which digital marketing channels provide the best ROI for companies at our stage?
What social media strategies and content approaches drive engagement for growing brands in this space?
What strategic partnerships or ecosystem integrations accelerate growth in this industry?
What brand positioning elements help differentiate scale-ups from both startups and established players?

Operational Scalability

What operational bottlenecks typically emerge during rapid growth phases in this industry?
What technology infrastructure investments deliver the highest operational efficiency gains?
What supply chain or service delivery optimization strategies support 2-3x growth?
Which key functions should be prioritized for automation or standardization?
What metrics best indicate operational readiness for next-stage growth?

Organizational Development

What organizational structure changes typically occur at this growth stage?
Which key executive and management roles become critical during scaling?
What employee retention strategies work best during rapid growth phases?
What company culture elements are most important to preserve during scaling?
What decision-making frameworks help maintain agility while adding structure?

Risk Analysis & Management

What are the most common reasons scale-ups in this industry fail to reach the next stage?
What competitive threats typically emerge as companies gain market share?
What financial risks become more significant during rapid growth?
What regulatory or compliance issues become more complex at scale?
What reputation management challenges emerge during scaling?

Financial Strategy

What capital requirements are typical for companies at our stage to achieve 3x growth?
What funding options are most appropriate for scale-ups in this industry (Series A/B, debt, revenue financing)?
What unit economics improvements have the greatest impact on profitability at scale?
What financial metrics do investors prioritize for companies at this growth stage?
What cash flow management strategies are most effective during rapid growth phases?

Please provide specific data, examples from successful scale-up companies, and actionable insights rather than general principles. Include relevant statistics, benchmarks, and industry-specific metrics whenever possible. Focus on practical implementation strategies that have been validated by companies that have successfully scaled in this industry.


"Established" peplexity prompt;
# Comprehensive Business Plan Research for [COMPANY TYPE] in [LOCATION] a.
Please conduct thorough research to help create an actionable business plan for an established [COMPANY TYPE] in [LOCATION] that has a stable market position and is focused on optimization, innovation, and long-term growth. Focus on practical, data-driven insights rather than generic business language.
Market Position & Industry Dynamics

What is our potential market share growth opportunity in [LOCATION] and in which segments?
What industry consolidation trends might impact established players in this market?
What disruptive innovations or business models are emerging that could threaten established companies?
How are customer expectations evolving in this mature market?
What regulatory or policy changes on the horizon could impact established businesses in this industry?

Innovation & Adaptation Strategy

What digital transformation initiatives have generated the highest ROI for established companies in this industry?
What emerging technologies are being successfully integrated by market leaders in this space?
What R&D investment benchmarks (as percentage of revenue) are typical for innovation leaders in this industry?
What product/service evolution strategies are extending the lifecycle of core offerings in this market?
What acquisition targets or partnership opportunities would complement our existing business model?

Brand Leadership & Marketing Optimization

What brand metrics correlate most strongly with market share retention in mature markets?
What marketing efficiency improvements have generated the best results for established companies?
What social media strategies effectively maintain relevance for legacy brands with different audience segments?
What digital marketing channel mix optimizations maximize ROI for established players?
What content marketing approaches build thought leadership while driving business results?

Operational Excellence

What operational efficiency benchmarks define best-in-class performance in this industry?
What process optimization or automation initiatives yield the greatest margin improvements?
What supply chain or service delivery innovations are creating competitive advantages?
What sustainability initiatives drive both cost savings and market differentiation?
What quality management systems deliver measurable performance improvements?

Talent & Organizational Structure

What organizational structures best balance stability and innovation?
What leadership development programs most effectively build bench strength?
What talent acquisition strategies successfully attract top performers to established companies?
What succession planning frameworks minimize disruption during leadership transitions?
What employee engagement approaches prevent complacency in mature organizations?

Risk Management

What strategic risks most frequently impact established companies in this industry?
What risk management frameworks best protect established market positions?
What cybersecurity and data privacy approaches are considered best practices in this industry?
What business continuity plans have proven most effective during market disruptions?
What reputation management strategies best protect established brand equity?

Financial Performance & Investment

What capital allocation strategies maximize returns for mature businesses in this industry?
What performance metrics best indicate long-term health beyond quarterly earnings?
What cost structure optimizations yield sustainable competitive advantages?
What dividend or share repurchase policies balance shareholder returns and reinvestment?
What investment criteria should guide decisions between organic growth, M&A, and diversification?

Please provide specific data, examples from industry leaders, and actionable insights rather than general principles. Include relevant statistics, benchmarks, and industry-specific metrics whenever possible. Focus on strategies that balance optimization of current operations with innovation for future competitiveness.



Step 2;

Then we will promtp ai to generate the different sections within the business plan according to which category they fall into. 

For each heading do the following prompt and the answer will be added to the section within the completed business plan. 

prompt for all business plans

# Business Plan Section Generator for [COMPANY NAME] ([COMPANY STAGE])

Based on the research provided for [COMPANY TYPE] in [LOCATION], generate the following section for my business plan:

## [SECTION HEADING]

Create content for each subsection below that is:
- Direct and actionable (no business jargon or fluffy language)
- Data-driven with specific numbers/metrics where relevant
- Focused on practical implementation
- 50-80 words per subsection

Include the following subsections:
[LIST OF SUBSECTIONS]

For each subsection:
1. Start with the most impactful information first
2. Include at least one specific metric or data point where applicable
3. Focus on what makes this business unique in this market
4. End with an actionable insight or next step
5. Avoid generic statements that could apply to any business

Format each subsection with its heading in bold, followed by the concise content.

[all of the content we gathered from the form]
[all of the content we gathered from perplexity]

end prompt.


These are the sections for each business plan;

New Company; 
* Executive Summary
  * Vision & Mission
  * Core Problem & Solution
  * Target Market & Opportunity
  * Early Traction Metrics
  * Team Highlights
  * Financial Projections Snapshot

* Market Analysis
  * Industry Overview & Stage
  * Market Size & Addressable Segments
  * Market Trends & Growth Drivers
  * Competitor Analysis (direct & indirect)
  * Competitive Advantage & Differentiation

* Product-Market Fit Focus
  * Problem Statement & Evidence
  * Solution Validation (customer feedback, early metrics)
  * Target Customer Profile & Pain Points
  * Expansion Opportunities (future horizons)

* Revenue Engine
  * Core Offering & Value Proposition
  * Pricing Strategy & Unit Economics
  * Sales Process & Customer Acquisition Cost

* Marketing & Acquisition
  * Marketing Overview & Positioning
  * Digital Marketing Strategy (with specific channels)
  * Social Media Strategy & Content Plan
  * Customer Acquisition Metrics & Goals

* Execution Plan
  * 90-Day Action Plan (specific weekly goals)
  * Customer Acquisition Strategy
  * Critical Metrics Dashboard
  * Cash Runway & Burn Rate

* Team & Resources
  * Key Roles & Responsibilities
  * Critical Skills Gaps
  * Minimum Viable Resources
  * Mentor/Advisor Network

* Risk Analysis
  * Critical Market Risks
  * Operational Vulnerabilities
  * Financial Risks & Mitigation Plans
  * Competitive Threats

* Financial Roadmap
  * Monthly Cash Flow (12 months)
  * Break-even Timeline
  * Funding Requirements & Milestones

  Sclae Up 
  * Executive Summary
  * Growth Trajectory & Achievements
  * Market Opportunity & Expansion Strategy
  * Competitive Position
  * Team Evolution
  * Financial Performance & Projections

* Market Landscape
  * Industry Overview & Dynamics
  * Market Size & Growth Trajectory
  * Emerging Market Trends
  * Competitor Analysis & Market Share
  * Expansion Opportunities (geographic/demographic)

* Growth Acceleration Strategy
  * Market Expansion Opportunities
  * Customer Segment Analysis
  * Scaling Evidence & Metrics
  * Competitive Differentiation

* Revenue Optimization
  * Product Portfolio Strategy
  * Customer Lifetime Value Enhancement
  * Pricing Structure & Optimization
  * Recurring Revenue Streams

* Marketing & Brand Strategy
  * Marketing Overview & Budget Allocation
  * Brand Development Strategy
  * Social Media Strategy & Engagement Metrics
  * Digital Marketing Optimization (performance data)
  * Content Strategy & Thought Leadership

* Operational Scalability
  * Process Automation & Standardization
  * Technology Infrastructure Plan
  * Quality Control Systems
  * Supply Chain/Vendor Management

* Organizational Development
  * Org Structure & Key Hires (18-month plan)
  * Culture & Retention Strategy
  * Decision-making Framework
  * Performance Management System

* Risk Analysis
  * Scaling Risks & Contingencies
  * Market Positioning Risks
  * Financial & Funding Risks
  * Operational Bottlenecks
  * Regulatory Compliance

* Financial Strategy
  * Unit Economics Across Segments
  * Capital Allocation Framework
  * Funding Strategy & Options
  * Profitability Path & Timeline


  Established Business
  * Executive Summary
  * Long-term Position & Vision
  * Market Leadership Status
  * Innovation & Adaptation Strategy
  * Financial Performance Highlights
  * Strategic Priorities

* Industry & Market Analysis
  * Industry Overview & Maturity Assessment
  * Market Size & Segmentation Analysis
  * Market Trends & Disruptive Forces
  * Competitor Analysis & Positioning Map
  * Strategic Industry Alliances

* Market Position Enhancement
  * Brand Equity Assessment
  * Market Share Analysis & Goals
  * Customer Loyalty Metrics
  * Expansion Opportunities (new verticals/markets)

* Innovation & Adaptation Strategy
  * Product/Service Evolution Roadmap
  * Digital Transformation Initiatives
  * Emerging Technology Integration
  * R&D Investment Framework

* Marketing & Brand Leadership
  * Marketing Overview & Investment Strategy
  * Brand Portfolio Management
  * Social Media Strategy & Brand Advocacy
  * Digital Marketing Optimization & ROI Analysis
  * Integrated Marketing Campaigns

* Operational Excellence
  * Efficiency Optimization Plan
  * Cost Structure Analysis
  * Supply Chain Resilience
  * Environmental & Social Impact Goals

* Talent & Organization
  * Leadership Development Pipeline
  * Knowledge Management Systems
  * Strategic Hiring Framework
  * Succession Planning

* Risk Analysis
  * Market Disruption Risks
  * Industry Consolidation Impact
  * Regulatory & Compliance Landscape
  * Technological Obsolescence
  * Reputation Management

* Financial Performance
  * Shareholder Value Creation Model
  * Capital Structure Optimization
  * Risk Management Framework
  * Long-term Investment Strategy


  Step  3 ; 

  Save the business plan in the users dashboard. 