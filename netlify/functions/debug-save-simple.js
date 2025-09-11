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
    console.log('🚀 DEBUG-SAVE-SIMPLE: Function started');
    console.log('📦 DEBUG-SAVE-SIMPLE: HTTP Method:', event.httpMethod);
    console.log('📦 DEBUG-SAVE-SIMPLE: Event body length:', event.body ? event.body.length : 'null');
    
    // Перевіряємо ENV змінні
    const pocketbaseUrl = process.env.VITE_POCKETBASE_URL || 'https://api.pocketbasemax.cc';
    console.log('🔧 DEBUG-SAVE-SIMPLE: PocketBase URL:', pocketbaseUrl);
    
    if (!event.body) {
      console.log('❌ DEBUG-SAVE-SIMPLE: No body provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No body provided',
          success: false
        })
      };
    }

    // Парсимо JSON
    let parsedData;
    try {
      parsedData = JSON.parse(event.body);
      console.log('✅ DEBUG-SAVE-SIMPLE: JSON parsed successfully');
      console.log('📊 DEBUG-SAVE-SIMPLE: Parsed keys:', Object.keys(parsedData));
    } catch (parseError) {
      console.error('❌ DEBUG-SAVE-SIMPLE: JSON parse error:', parseError.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON',
          details: parseError.message,
          success: false
        })
      };
    }

    const { settingsType, data, siteId } = parsedData;
    console.log('📊 DEBUG-SAVE-SIMPLE: Request data:', {
      settingsType,
      siteId,
      hasData: !!data,
      dataSize: data ? JSON.stringify(data).length : 0
    });

    // Тестуємо підключення до PocketBase
    console.log('🔍 DEBUG-SAVE-SIMPLE: Testing PocketBase connection...');
    
    try {
      const testResponse = await fetch(`${pocketbaseUrl}/api/health`);
      console.log('✅ DEBUG-SAVE-SIMPLE: PocketBase health check status:', testResponse.status);
    } catch (healthError) {
      console.error('❌ DEBUG-SAVE-SIMPLE: PocketBase health check failed:', healthError.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'PocketBase connection failed',
          details: healthError.message,
          success: false
        })
      };
    }

    // Простий POST запит до PocketBase
    console.log('📤 DEBUG-SAVE-SIMPLE: Attempting simple POST to PocketBase...');
    
    const postData = {
      site_id: siteId,
      settings_type: settingsType,
      data: data
    };

    const saveResponse = await fetch(`${pocketbaseUrl}/api/collections/site_settings/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    console.log('📊 DEBUG-SAVE-SIMPLE: PocketBase response status:', saveResponse.status);
    
    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('❌ DEBUG-SAVE-SIMPLE: PocketBase error response:', errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'PocketBase save failed',
          status: saveResponse.status,
          details: errorText,
          success: false
        })
      };
    }

    const result = await saveResponse.json();
    console.log('✅ DEBUG-SAVE-SIMPLE: Success! PocketBase response:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Data saved successfully',
        recordId: result.id
      })
    };

  } catch (error) {
    console.error('❌ DEBUG-SAVE-SIMPLE: Unexpected error:', error);
    console.error('❌ DEBUG-SAVE-SIMPLE: Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack,
        success: false
      })
    };
  }
};
