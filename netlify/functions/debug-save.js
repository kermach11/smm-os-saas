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
    console.log('🚀 DEBUG-SAVE: Function started');
    console.log('🚀 DEBUG-SAVE: HTTP Method:', event.httpMethod);
    console.log('🚀 DEBUG-SAVE: Headers:', JSON.stringify(event.headers, null, 2));
    console.log('🚀 DEBUG-SAVE: Body raw:', event.body);
    
    // Перевіряємо ENV змінні
    console.log('🔧 DEBUG-SAVE: ENV VITE_POCKETBASE_URL:', process.env.VITE_POCKETBASE_URL);
    
    if (!event.body) {
      console.log('❌ DEBUG-SAVE: No body provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No body provided',
          debug: 'Body is required for save operation'
        })
      };
    }
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
      console.log('✅ DEBUG-SAVE: Body parsed successfully:', JSON.stringify(parsedBody, null, 2));
    } catch (parseError) {
      console.log('❌ DEBUG-SAVE: JSON parse error:', parseError.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON',
          details: parseError.message,
          rawBody: event.body
        })
      };
    }
    
    const { settingsType, data, siteId } = parsedBody;
    console.log('📊 DEBUG-SAVE: Extracted data:', {
      settingsType,
      siteId,
      hasData: !!data,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : 'none'
    });
    
    if (!settingsType || !siteId) {
      console.log('❌ DEBUG-SAVE: Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['settingsType', 'siteId'],
          received: { settingsType, siteId }
        })
      };
    }
    
    const pocketbaseUrl = process.env.VITE_POCKETBASE_URL || 'https://api.pocketbasemax.cc';
    console.log('🚀 DEBUG-SAVE: Using PocketBase URL:', pocketbaseUrl);
    
    // Тестуємо підключення до PocketBase
    console.log('🔍 DEBUG-SAVE: Testing PocketBase connection...');
    const healthResponse = await fetch(`${pocketbaseUrl}/api/health`);
    console.log('🔍 DEBUG-SAVE: PocketBase health status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      console.log('❌ DEBUG-SAVE: PocketBase health check failed');
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          error: 'PocketBase unavailable',
          healthStatus: healthResponse.status
        })
      };
    }
    
    console.log('✅ DEBUG-SAVE: PocketBase is healthy');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        debug: 'All checks passed - ready for real save operation',
        receivedData: {
          settingsType,
          siteId,
          dataSize: JSON.stringify(data).length
        },
        pocketbaseUrl,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ DEBUG-SAVE: Unexpected error:', error);
    console.error('❌ DEBUG-SAVE: Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    };
  }
};
