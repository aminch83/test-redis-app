const express = require('express');
const { createClient } = require('redis');

const app = express();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

const client = createClient({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.once('error', (err) => {
  console.error(`Cannot connect to ${redisHost}:${redisPort}.\n${err}`);
});

app.get('/', async (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/redis', async (req, res) => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    await client.set('testKey', 'testValue');
    const value = await client.get('testKey');
    res.json({ value, redisHost, redisPort });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ message: 'Internal Server Error', error: err, redisHost, redisPort });
  } finally {
    client.quit();
  }
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
