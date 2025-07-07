const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('🔄 save-settings: Function started');
    console.log('📦 save-settings: Event body:', event.body);
    
    // Перевіряємо environment variables
    console.log('🔍 save-settings: SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
    console.log('🔍 save-settings: SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    // Ініціалізація Supabase
    console.log('🚀 save-settings: Initializing Supabase client');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    console.log('📝 save-settings: Parsing request body');
    const { settingsType, data, siteId } = JSON.parse(event.body);
    
    console.log('📊 save-settings: Request data:', {
      settingsType,
      siteId,
      dataSize: JSON.stringify(data).length
    });
    
    // Зберігаємо налаштування для конкретного сайту
    console.log('💾 save-settings: Upserting to site_settings table');
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        site_id: siteId,
        settings_type: settingsType,
        data: data
      }, {
        onConflict: 'site_id,settings_type'
      });

    if (error) {
      console.error('❌ save-settings: Supabase error:', error);
      throw error;
    }

    console.log('✅ save-settings: Successfully saved settings');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('❌ save-settings: Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        details: error.toString()
      })
    };
  }
}; 