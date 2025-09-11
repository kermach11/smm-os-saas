exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('🔍 TEST-SAVE-DATA: Full event object:');
    console.log('📊 Method:', event.httpMethod);
    console.log('📊 Headers:', JSON.stringify(event.headers, null, 2));
    console.log('📊 Query params:', JSON.stringify(event.queryStringParameters, null, 2));
    console.log('📊 Body raw:', event.body);
    console.log('📊 Body length:', event.body ? event.body.length : 'null');
    console.log('📊 Body type:', typeof event.body);
    
    if (event.body) {
      try {
        const parsed = JSON.parse(event.body);
        console.log('📊 Parsed JSON keys:', Object.keys(parsed));
        console.log('📊 Parsed JSON values (first 200 chars):', JSON.stringify(parsed).substring(0, 200) + '...');
      } catch (e) {
        console.error('❌ JSON parse failed:', e.message);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Test data received and logged',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ TEST-SAVE-DATA: Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        success: false
      })
    };
  }
};
