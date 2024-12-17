const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();

// 連接 MongoDB (假設同樣的 weblessonDB)
mongoose.connect('mongodb://127.0.0.1:27017/weblessonDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// 定義帳號資料結構 (如之前範例)
const AccountData = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
const Account = mongoose.model('Account', AccountData);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供 public 資料夾靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// Multer 設定
const storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // 確保目錄存在
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar_' + Date.now() + path.extname(file.originalname));
    }
});

const storageHtml = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // 儲存HTML檔案至相同資料夾
    },
    filename: (req, file, cb) => {
        cb(null, 'page_' + Date.now() + path.extname(file.originalname));
    }
});

const uploadAvatar = multer({ storage: storageAvatar });
const uploadHtml = multer({ 
    storage: storageHtml,
    fileFilter: (req, file, cb) => {
        // 僅接受 .html 副檔名的檔案
        if (path.extname(file.originalname).toLowerCase() === '.html') {
            cb(null, true);
        } else {
            cb(new Error('只允許上傳HTML檔案'));
        }
    }
});

// 模擬登入路由 (如之前範例)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Account.findOne({ username });
    if (!user) {
        return res.json({ success: false, message: '帳號不存在' });
    }
    if (user.password === password) {
        return res.json({ success: true, message: '登入成功！' });
    } else {
        return res.json({ success: false, message: '帳號或密碼錯誤' });
    }
});

// 模擬註冊路由 (如之前範例)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: '請輸入帳號和密碼' });
    }
    const existingUser = await Account.findOne({ username });
    if (existingUser) {
        return res.json({ success: false, message: '帳號已存在' });
    }
    const newUser = new Account({ username, password });
    await newUser.save();
    res.json({ success: true, message: '註冊成功！' });
});

// 上傳頭像路由
app.post('/upload-avatar', uploadAvatar.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: '未選擇圖片檔案' });
    }
    res.json({ success: true, message: '頭像已上傳成功' });
});

// 上傳HTML路由
app.post('/upload-html', (req, res, next) => {
    uploadHtml.single('htmlFile')(req, res, function(err){
        if (err) {
            return res.json({ success: false, message: err.message || '上傳失敗' });
        }
        if (!req.file) {
            return res.json({ success: false, message: '未選擇HTML檔案' });
        }
        res.json({ success: true, message: 'HTML檔案已上傳成功' });
    });
});

app.listen(3000, () => {
    console.log(`Server listening on http://localhost:3000`);
});
