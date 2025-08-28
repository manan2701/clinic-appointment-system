/*
  Downloads placeholder images for blog articles into frontend/public/images/blog
  so that seed imageUrl paths like /images/blog/telemedicine-future.jpg resolve locally.
*/
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outputDir = path.resolve(__dirname, '../../frontend/public/images/blog');
const filenames = [
  'telemedicine-future.jpg',
  'mental-wellness-guide.jpg',
  'healthy-heart-foods.jpg',
  'benefits-of-exercise.jpg',
  'importance-of-sleep.jpg',
  'chronic-pain-management.jpg',
  'pediatric-vaccinations.jpg',
  'skin-health-101.jpg',
  'decoding-food-labels.jpg',
  'preventive-screenings.jpg',
  'hydration-myths.jpg',
  'healthy-aging.jpg',
  'understanding-antibiotics.jpg',
  'mindful-eating.jpg',
  'digital-eye-strain.jpg',
  'gut-brain-connection.jpg',
  'first-aid-kit.jpg',
  'health-insurance-guide.jpg',
  'power-of-walking.jpg',
];

function download(url, dest, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (response) => {
        // Handle redirects
        if (
          [301, 302, 303, 307, 308].includes(response.statusCode) &&
          response.headers.location &&
          redirectsLeft > 0
        ) {
          const nextUrl = response.headers.location.startsWith('http')
            ? response.headers.location
            : new URL(response.headers.location, url).toString();
          response.resume();
          return resolve(download(nextUrl, dest, redirectsLeft - 1));
        }

        if (response.statusCode !== 200) {
          response.resume();
          return reject(new Error(`Failed ${url} -> ${response.statusCode}`));
        }

        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => {
          file.close();
          fs.unlink(dest, () => {});
          reject(err);
        });
      })
      .on('error', (err) => reject(err));
  });
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const name of filenames) {
    const seed = name.replace(/\.jpg$/i, '');
    const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/675.jpg`;
    const dest = path.join(outputDir, name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`Exists: ${name}`);
      continue;
    }
    try {
      console.log(`Downloading: ${name} <- ${url}`);
      await download(url, dest);
    } catch (e) {
      // Fallback to placehold.co which is very reliable
      const fallbackUrl = `https://placehold.co/1200x675/e2e8f0/4a5568?text=${encodeURIComponent(seed.replace(/-/g, ' '))}`;
      try {
        console.warn(`Primary failed, trying fallback: ${fallbackUrl}`);
        await download(fallbackUrl, dest);
      } catch (e2) {
        console.error(`Failed to download ${name} (fallback failed):`, e2.message);
      }
    }
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


