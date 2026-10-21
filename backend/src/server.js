import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import path from 'node:path';
import { config } from './config.js';
import { redis } from './redis.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin/index.js';
import seoRoutes from './routes/seo.js';

const app = express();

app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new RedisStore({ client: redis, prefix: `${config.session.prefix}:sess:` }),
    name: config.session.prefix,
    secret: config.app.key || 'hasanov-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.lifetimeMinutes * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: config.app.env === 'production' ? 'auto' : false,
    },
  })
);

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', seoRoutes);

const spaDir = path.join(config.rootPath, 'spa');
app.use(express.static(spaDir));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(spaDir, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(config.app.port, () => {
  console.log(`hasanov.uz backend listening on :${config.app.port}`);
});
