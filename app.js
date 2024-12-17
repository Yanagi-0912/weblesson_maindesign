const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/weblessonDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


const AccountData = new mongoose.Schema({
    account: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const Account = mongoose.model('Account', AccountData);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log(`Server listening on http://localhost:3000`);
});
