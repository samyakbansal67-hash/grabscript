require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

/* ── middleware ── */
app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname)));

/* ── simple rate limiter (no extra deps) ── */
const hits = new Map();
app.use('/api/', (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const window = 60_000; // 1 minute
  const limit = 10;      // 10 requests per minute per IP

  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > window) { entry.count = 0; entry.start = now; }
  entry.count++;
  hits.set(ip, entry);

  if (entry.count > limit) {
    return res.status(429).json({ error: 'Too many requests — please wait a minute.' });
  }
  next();
});

/* ── helpers ── */
function extractVideoId(input) {
  try {
    const url = new URL(input.includes('://') ? input : 'https://' + input);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).split('?')[0];
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2];
      return url.searchParams.get('v') || null;
    }
  } catch {}
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return null;
}

function formatTime(seconds) {
  const s = Math.floor(Number(seconds) || 0);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function formatCount(n) {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ── health check (Hostinger / uptime monitors use this) ── */
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

/* ── main API route ── */
const ACTOR_ID = 'karamelo~youtube-transcripts';

app.post('/api/transcript', async (req, res) => {
  const { url, timestamps = true } = req.body;

  if (!url?.trim()) {
    return res.status(400).json({ error: 'Please provide a YouTube URL.' });
  }

  const token = process.env.APIFY_TOKEN;
  if (!token || token === 'your_apify_token_here') {
    return res.status(500).json({ error: 'APIFY_TOKEN is not configured on the server.' });
  }

  const videoId = extractVideoId(url.trim());
  if (!videoId) {
    return res.status(400).json({ error: 'Could not parse a valid YouTube video ID from that URL.' });
  }

  const input = {
    urls: [`https://www.youtube.com/watch?v=${videoId}`],
    outputFormat: timestamps ? 'captions_with_timestamps' : 'text_only',
    maxRetries: 3,
  };

  try {
    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}&timeout=120`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
    );

    if (!apifyRes.ok) {
      const body = await apifyRes.text().catch(() => '');
      if (!isProd) console.error('Apify error:', apifyRes.status, body);
      return res.status(502).json({ error: `Apify returned an error (${apifyRes.status}). Check your token.` });
    }

    const items = await apifyRes.json();

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(404).json({ error: 'No transcript found. The video may have captions disabled.' });
    }

    const item = items[0];
    const rawCaptions = item.captions || item.transcript || [];

    if (!rawCaptions.length) {
      return res.status(404).json({ error: 'Transcript is empty. Captions may not be available for this video.' });
    }

    const transcript = rawCaptions.map((cap) => {
      if (typeof cap === 'string') return { t: '00:00', text: cap };
      return {
        t: formatTime(cap.start ?? cap.offset ?? 0),
        text: (cap.text || cap.content || '').trim(),
      };
    }).filter(c => c.text);

    const totalSecs = rawCaptions.reduce((acc, c) => {
      const end = typeof c === 'object' ? (c.end ?? c.start ?? 0) : 0;
      return Math.max(acc, end);
    }, 0);

    return res.json({
      transcript,
      meta: {
        title: item.title || item.videoTitle || 'YouTube Video',
        channel: item.channelName || item.channel || '',
        views: item.viewCount ? `${formatCount(item.viewCount)} views` : '',
        duration: totalSecs > 0 ? formatTime(totalSecs) : '',
        videoId,
        detectedLanguage: item.language || item.captionLanguage || item.lang || null,
      },
    });

  } catch (err) {
    if (!isProd) console.error('Server error:', err);
    return res.status(500).json({ error: 'Unexpected server error. Please try again.' });
  }
});

/* ── 404 fallback → serve index.html (SPA) ── */
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Scribely → http://localhost:${PORT}  [${isProd ? 'production' : 'development'}]\n`);
});
