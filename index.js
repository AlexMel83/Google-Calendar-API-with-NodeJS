require('dotenv').config();
const express = require('express');
const {google} = require('googleapis');
const {PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT} = process.env;

const app = express();
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);

app.get('/',(req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    res.redirect(url);
});

app.get('/redirect',(req,res)=>{
    const code=req.query.code;
    oauth2Client.getToken(code,(err,tokens)=>{
        if (err) {
            console.error('Couldn\'t get token', err);
            res.send('Error');
            return;
        }
        oauth2Client.setCredentials(tokens);
        res.send('Succesfully logged in');
    })
});

app.get('/calendars',(req,res)=>{
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.calendarList.list({},(err,response)=>{
        if(err){
            console.error('error fetching calendars', err);
            res.send('Error');
            return;
        }
        const calendars = response.data.items;
        res.json(calendars);
    })
})

app.get('/events',(req,res)=>{
    const calendarId = req.query.calendar??'primary';
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.list({
        calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        signleEvents: true,
        orderBy: 'satrTime',

    },(err,response)=>{
        if(err){
            console.error('Can\'t fetch events');
            res.send('Error');
            return;
        }
        const events = response.data.items;
        res.json(events);
    })
})

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))