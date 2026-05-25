import http from 'http';

// First register a user and get the cookie
const registerData = JSON.stringify({
  name: 'Test User',
  email: 'testuser' + Date.now() + '@example.com',
  password: 'Password1',
});

const registerOptions = {
  hostname: 'localhost',
  port: 4001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData),
  },
};

const registerReq = http.request(registerOptions, (res) => {
  console.log('Register status:', res.statusCode);
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Register response:', body);
    
    // Extract cookie from Set-Cookie header
    const setCookie = res.headers['set-cookie'];
    console.log('Set-Cookie headers:', setCookie);
    
    // Now make the homeremedy request
    const remedyData = JSON.stringify({
      symptoms: 'cough, fever, headache'
    });
    
    const remedyOptions = {
      hostname: 'localhost',
      port: 4001,
      path: '/api/ai/homeremedies',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(remedyData),
        'Cookie': setCookie ? setCookie[0] : ''
      },
    };
    
    const remedyReq = http.request(remedyOptions, (remedyRes) => {
      console.log('Remedy status:', remedyRes.statusCode);
      let remedyBody = '';
      
      remedyRes.on('data', (chunk) => {
        remedyBody += chunk;
      });
      
      remedyRes.on('end', () => {
        console.log('Remedy response:', remedyBody);
      });
    });
    
    remedyReq.on('error', (err) => {
      console.error('Remedy request error:', err);
    });
    
    remedyReq.write(remedyData);
    remedyReq.end();
  });
});

registerReq.on('error', (err) => {
  console.error('Register request error:', err);
});

registerReq.write(registerData);
registerReq.end();
