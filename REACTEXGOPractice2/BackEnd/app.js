const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const keys = require('./keys.json');

const app = express();
const port = 3300;
app.use(cors());
app.use(express.json());

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Connected to Google Sheets API!');
  }
});

app.get('/data', (req, res) => {
    console.log(`Received data: ${JSON.stringify(req.body)}`);  
  const gsapi = google.sheets({ version: 'v4', auth: client });

  const opt = {
    spreadsheetId: '1W09G3Fd3WL-Dy6r58Skl6lk-kvU_OACx5cmqIyUTPy4',
    range: 'Sheet1!A:B'
  };

  gsapi.spreadsheets.values.get(opt, (err, data) => {
    if (err) {
      res.send('Error fetching data');
    } else {
      res.json(data.data.values);
    }
  });
});

app.post('/data', (req, res) => {
    console.log(`Received data 1: ${JSON.stringify(req.body)}`);
    const gsapi = google.sheets({ version: 'v4', auth: client });
  
    const opt = {
      spreadsheetId: '1W09G3Fd3WL-Dy6r58Skl6lk-kvU_OACx5cmqIyUTPy4',
      range: 'Sheet1!A:B',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          [req.body.firstName, req.body.lastName]
        ]
      }
    };
  
    gsapi.spreadsheets.values.append(opt, (err, data) => {
      if (err) {
        console.log('Error updating data:', err);
        res.send('Error updating data');
      } else {
        console.log('Data updated successfully');
        res.send('Data updated successfully');
      }
    });
  });

  let data=[];

  app.put('/data/api/rows/:index', (req, res) => {
    const index = req.params.index;
    console.log(`index is ${index}`);
    const newData = req.body;
    console.log(`newData is ${newData}`);
  
    if (index < 0 || index >= data.length) {
      res.status(404).send('Not found');
      return;
    }
  
    data[index] = newData;
  
    res.status(200).send('Updated successfully');
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});