const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Supabase Edge Function'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content type received');
    }

    const data = await response.json();

    // Validate the response has the required fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Map the country code to a currency code
    const countryCurrencyMap: Record<string, string> = {
      'US': 'USD',
      'GB': 'GBP',
      'IN': 'INR',
      // Add more country-to-currency mappings as needed
    };

    const currency = data.country_code ? countryCurrencyMap[data.country_code] || 'USD' : 'USD';

    return new Response(
      JSON.stringify({
        country: data.country_code || 'US',
        currency: currency,
        region: data.region || 'Unknown'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Region detection error:', error.message);
    
    // Always return a valid JSON response, even in case of errors
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch region data',
        currency: 'USD',
        country: 'US',
        region: 'Unknown'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 // Still return 200 to ensure the client gets valid JSON
      },
    );
  }
});
