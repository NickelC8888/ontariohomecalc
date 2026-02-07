import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Cache rates for 1 hour to avoid excessive API calls
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let cachedRates = null;
let cacheTimestamp = null;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedRates && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      return Response.json({ 
        rates: cachedRates,
        cached: true,
        lastUpdated: new Date(cacheTimestamp).toISOString()
      });
    }

    // Fetch fresh rates using AI with web search
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Search the web for the most current Canadian mortgage interest rates (as of February 2025) from major banks and lenders. 
      
      I need BOTH fixed and variable 5-year mortgage rates for these lenders:
      - RBC (Royal Bank)
      - TD Bank
      - Scotiabank
      - BMO (Bank of Montreal)
      - CIBC
      - National Bank
      - EQ Bank
      - Tangerine
      
      Return ONLY the rates, formatted as a JSON array with this exact structure:
      [
        {"name": "RBC", "rate": 4.84, "type": "fixed"},
        {"name": "RBC", "rate": 6.35, "type": "variable"},
        ...
      ]
      
      Make sure to include both fixed AND variable rates for each lender. Use the most current rates available.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          rates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                rate: { type: "number" },
                type: { type: "string" }
              },
              required: ["name", "rate", "type"]
            }
          }
        },
        required: ["rates"]
      }
    });

    const rates = response.rates || [];
    
    // Validate and cache the rates
    if (rates.length > 0) {
      cachedRates = rates;
      cacheTimestamp = now;
    }

    return Response.json({ 
      rates: rates,
      cached: false,
      lastUpdated: new Date(now).toISOString()
    });

  } catch (error) {
    console.error("Failed to fetch mortgage rates:", error);
    
    // Return fallback static rates if fetching fails
    const fallbackRates = [
      { name: "RBC", rate: 4.84, type: "fixed" },
      { name: "TD", rate: 4.99, type: "fixed" },
      { name: "Scotiabank", rate: 5.09, type: "fixed" },
      { name: "BMO", rate: 4.79, type: "fixed" },
      { name: "CIBC", rate: 4.89, type: "fixed" },
      { name: "National Bank", rate: 4.94, type: "fixed" },
      { name: "EQ Bank", rate: 4.69, type: "fixed" },
      { name: "Tangerine", rate: 4.74, type: "fixed" },
      { name: "RBC", rate: 6.35, type: "variable" },
      { name: "TD", rate: 6.45, type: "variable" },
      { name: "Scotiabank", rate: 6.50, type: "variable" },
      { name: "BMO", rate: 6.30, type: "variable" },
      { name: "CIBC", rate: 6.40, type: "variable" },
      { name: "National Bank", rate: 6.45, type: "variable" },
      { name: "EQ Bank", rate: 6.10, type: "variable" },
      { name: "Tangerine", rate: 6.15, type: "variable" }
    ];
    
    return Response.json({ 
      rates: fallbackRates,
      cached: false,
      fallback: true,
      error: error.message,
      lastUpdated: new Date().toISOString()
    });
  }
});