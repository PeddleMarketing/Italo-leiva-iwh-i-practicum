require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const CUSTOM_OBJECT_TYPE = 'p_rpg_classes';

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,role,level,specialization`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.render('homepage', {
      title: 'RPG Classes | Integrating With HubSpot I Practicum',
      objects: response.data.results
    });
  } catch (error) {
    console.error('Error fetching custom objects:', error.message);
    res.render('homepage', {
      title: 'RPG Classes | Integrating With HubSpot I Practicum',
      objects: [],
      error: 'Failed to load custom objects'
    });
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update RPG Class | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  try {
    const properties = {
      name: req.body.name,
      role: req.body.role,
      level: req.body.level,
      specialization: req.body.specialization
    };

    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      { properties },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    res.render('updates', {
      title: 'Update RPG Class | Integrating With HubSpot I Practicum',
      error: 'Failed to create custom object',
      formData: req.body 
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});