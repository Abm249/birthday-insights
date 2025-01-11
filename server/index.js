const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const GENIUS_API_URL = 'https://api.genius.com';
const GENIUS_AUTH_TOKEN = 'Bearer ZZbJ4QPSR-M01dtyYXE1uLeTO192SDD0nduJyBtSj-a_f677Op0HSnBzr0K46Q-D';

// Helper function to fetch the top song of the year
const fetchTopSong = async (year) => {
  try {
    const response = await axios.get(`${GENIUS_API_URL}/search`, {
      headers: {
        Authorization: GENIUS_AUTH_TOKEN,
      },
      params: {
        q: `${year} top song`,
      },
    });

    if (response.data.response.hits.length > 0) {
      const song = response.data.response.hits[0].result;
      return `${song.full_title} by ${song.primary_artist.name}`;
    }

    return 'Unknown';
  } catch (error) {
    console.error(`Error fetching top song for ${year}:`, error.message);
    return 'Unknown';
  }
};

// Endpoint for "On This Day" data
app.get('/on-this-day', async (req, res) => {
  const { date } = req.query; // Format: YYYY-MM-DD
  if (!date) {
    return res.status(400).json({ error: 'Date is required in YYYY-MM-DD format.' });
  }

  const [year, month, day] = date.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const pageTitle = `${monthNames[parseInt(month, 10) - 1]}_${parseInt(day, 10)}`;

  try {
    const conceptionDate = new Date(date);
    conceptionDate.setMonth(conceptionDate.getMonth() - 9);
    const conceptionString = conceptionDate.toISOString().split('T')[0];

    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        titles: pageTitle,
        explaintext: true,
      },
    });

    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];
    if (!page || !page.extract) {
      return res.json({
        conception: conceptionString,
        celebrities: [],
        events: [],
        numberOneSong: 'Unknown',
      });
    }

    const extract = page.extract;
    const birthsStart = extract.indexOf('Births');
    const eventsStart = extract.indexOf('Events');
    const deathsStart = extract.indexOf('Deaths');

    const birthsContent = extract.slice(
      birthsStart,
      deathsStart > 0 ? deathsStart : extract.length
    );
    const eventsContent = extract.slice(
      eventsStart,
      birthsStart > 0 ? birthsStart : extract.length
    );

    const birthLines = birthsContent.split('\n');
    const eventLines = eventsContent.split('\n');

    const celebrities = birthLines
      .filter(line => line.includes(' – '))
      .map(line => {
        const parts = line.split(' – ');
        return { year: parts[0].trim(), description: parts.slice(1).join(' – ').trim() };
      });

    const events = eventLines
      .filter(line => line.includes(' – '))
      .map(line => {
        const parts = line.split(' – ');
        return { year: parts[0].trim(), description: parts.slice(1).join(' – ').trim() };
      });

    const numberOneSong = await fetchTopSong(year);

    const daysSinceBirth = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    const dogYears = Math.floor(daysSinceBirth / 365 * 7);
    const babiesBorn = (Math.random() * 350000).toFixed(0);

    res.json({
      conception: conceptionString,
      babiesBorn,
      daysSinceBirth,
      dogYears,
      numberOneSong,
      celebrities,
      events,
    });
  } catch (error) {
    console.error('Error fetching "On This Day" data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data.', details: error.message });
  }
});

app.listen(5001, () => console.log('Server running on http://localhost:5001'));
