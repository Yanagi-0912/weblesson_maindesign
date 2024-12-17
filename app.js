const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/weblessonDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const AccountData = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const Account = mongoose.model('Account', AccountData);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 新增登入路由
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 尋找資料庫中對應的帳號資料
    const user = await Account.findOne({ username: username });

    if (!user) {
        // 沒找到該用戶
        return res.json({ success: false, message: '帳號不存在' });
    }

    // 比對密碼（此處為示範，實務上應該加鹽雜湊驗證）
    if (user.password === password) {
        // 登入成功
        return res.json({ success: true, message: '登入成功！' });
    } else {
        // 密碼錯誤
        return res.json({ success: false, message: '帳號或密碼錯誤' });
    }
});

app.listen(3000, () => {
    console.log(`Server listening on http://localhost:3000/homepage.html`);
});
