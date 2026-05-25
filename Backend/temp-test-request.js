import http from 'http';

const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser12345@example.com',
  password: 'Password1',
});

const options = {
  hostname: 'localhost',
  port: 4001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => process.stdout.write(chunk));
  res.on('end', () => process.stdout.write('\n'));
});

req.on('error', (err) => {
  console.error(err);
});

req.write(data);
req.end();
