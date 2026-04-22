import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address } = await req.json();

    if (!address || !address.trim()) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    // Use AI with web search to fetch property information
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Find current real estate listing information for this Ontario property address: "${address}". 

Search for:
1. Current listing price or recent sale price
2. Property type (house, condo, townhouse, etc.)
3. Whether it's in the City of Toronto or just Ontario
4. Annual property tax amount if available
5. Listing details or recent sales data

Return ONLY a JSON object with this exact structure (no additional text):
{
  "found": true/false,
  "price": number or null,
  "propertyType": "string or null",
  "isToronto": boolean,
  "annualPropertyTax": number or null,
  "address": "formatted address string",
  "details": "brief summary of what was found",
  "confidence": "high/medium/low"
}

If you cannot find reliable information, set found to false.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          found: { type: "boolean" },
          price: { type: ["number", "null"] },
          propertyType: { type: ["string", "null"] },
          isToronto: { type: "boolean" },
          annualPropertyTax: { type: ["number", "null"] },
          address: { type: "string" },
          details: { type: "string" },
          confidence: { type: "string" }
        },
        required: ["found", "address"]
      }
    });

    return Response.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching property details:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});