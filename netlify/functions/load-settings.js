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
    console.log('🚀 load-settings: Function started');
    
    const pocketbaseUrl = process.env.VITE_POCKETBASE_URL || 'https://api.pocketbasemax.cc';
    console.log('🚀 load-settings: Using PocketBase URL:', pocketbaseUrl);
    
    const { siteId, settingsType } = event.queryStringParameters || {};
    console.log('📊 load-settings: Request params:', { siteId, settingsType });
    
    // Правильний синтаксис PocketBase фільтрів
    const filterQuery = `site_id='${siteId}' && settings_type='${settingsType}'`;
    console.log('🔍 load-settings: Filter query:', filterQuery);
    
    const response = await fetch(`${pocketbaseUrl}/api/collections/site_settings/records?filter=${encodeURIComponent(filterQuery)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ load-settings: PocketBase response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ load-settings: PocketBase API error:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    console.log('📦 load-settings: Data from PocketBase:', data);

    // Повертаємо дані у форматі, сумісному з фронтендом
    const result = data.items && data.items.length > 0 ? data.items[0].data : null;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    console.error('❌ load-settings: Error:', error);
    console.error('❌ load-settings: Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};