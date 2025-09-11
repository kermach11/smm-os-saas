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
    console.log('🚀 save-settings: Function started');
    console.log('📦 save-settings: Event body:', event.body);
    
    const pocketbaseUrl = process.env.VITE_POCKETBASE_URL || 'https://api.pocketbasemax.cc';
    console.log('🚀 save-settings: Using PocketBase URL:', pocketbaseUrl);

    const { settingsType, data, siteId } = JSON.parse(event.body);
    
    console.log('📊 save-settings: Request data:', {
      settingsType,
      siteId,
      dataSize: JSON.stringify(data).length
    });
    
    // Перевіряємо чи існує запис (правильний синтаксис PocketBase фільтрів)
    const filterQuery = `site_id='${siteId}' && settings_type='${settingsType}'`;
    console.log('🔍 save-settings: Filter query:', filterQuery);
    
    const checkResponse = await fetch(`${pocketbaseUrl}/api/collections/site_settings/records?filter=${encodeURIComponent(filterQuery)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const existingRecords = await checkResponse.json();
    
    let saveResponse;
    
    if (existingRecords.items && existingRecords.items.length > 0) {
      // Оновлюємо існуючий запис
      const recordId = existingRecords.items[0].id;
      console.log('🔄 save-settings: Updating existing record:', recordId);
      
      saveResponse = await fetch(`${pocketbaseUrl}/api/collections/site_settings/records/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data
        })
      });
    } else {
      // Створюємо новий запис
      console.log('➕ save-settings: Creating new record');
      
      saveResponse = await fetch(`${pocketbaseUrl}/api/collections/site_settings/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_id: siteId,
          settings_type: settingsType,
          data: data
        })
      });
    }

    console.log('✅ save-settings: PocketBase save response status:', saveResponse.status);

    if (!saveResponse.ok) {
      const errorBody = await saveResponse.text();
      console.error('❌ save-settings: PocketBase save error:', errorBody);
      throw new Error(`HTTP error! status: ${saveResponse.status}, body: ${errorBody}`);
    }

    const result = await saveResponse.json();
    console.log('📦 save-settings: Save result:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('❌ save-settings: Error:', error);
    console.error('❌ save-settings: Error stack:', error.stack);
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