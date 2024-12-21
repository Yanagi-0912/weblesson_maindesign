const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

mongoose.connect('mongodb://localhost:27017/weblessonDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const AccountData = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatarFilename: { type: String, default: '' }
});
const Account = mongoose.model('Account', AccountData);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let currentUser = null;

/******************************************************
 * 登入
 ******************************************************/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Account.findOne({ username });
    if (!user) {
        return res.json({ success: false, message: '帳號不存在' });
    }
    if (user.password === password) {
        // 記錄 currentUser
        currentUser = { 
            username: user.username,
            avatarFilename: user.avatarFilename
        };
        // 組出頭像 URL
        const avatarUrl = user.avatarFilename 
            ? `/uploads/${user.username}/${user.avatarFilename}` 
            : '';
        return res.json({ 
            success: true, 
            message: '登入成功！', 
            username: user.username, 
            avatarUrl 
        });
    } else {
        return res.json({ success: false, message: '帳號或密碼錯誤' });
    }
});

/******************************************************
 * 註冊
 * 1) 建立資料庫記錄
 * 2) 建立使用者資料夾
 * 3) 複製預設頭像到使用者資料夾
 ******************************************************/
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: '請輸入帳號和密碼' });
    }
    // 檢查帳號是否存在
    const existingUser = await Account.findOne({ username });
    if (existingUser) {
        return res.json({ success: false, message: '帳號已存在' });
    }
    // 建立使用者
    const newUser = new Account({ username, password, avatarFilename: '' });
    await newUser.save();

    // 為新用戶建立對應的資料夾
    const userDir = path.join(__dirname, 'public', 'uploads', username);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    // 複製預設頭像檔案 (public/default/default-avatar.png)
    const defaultAvatarPath = path.join(__dirname, 'public', 'default', 'default-avatar.png');
    const userAvatarFilename = `${username}_avatar.png`;
    const userAvatarPath = path.join(userDir, userAvatarFilename);

    fs.copyFile(defaultAvatarPath, userAvatarPath, async (err) => {
        if (err) {
            console.error('無法複製預設頭像：', err);
            return res.json({ success: false, message: '建立使用者資料夾及預設頭像時出錯' });
        }
        // 更新使用者的 avatarFilename
        await Account.updateOne({ username }, { avatarFilename: userAvatarFilename });
        return res.json({ success: true, message: '註冊成功並已建立預設頭像！' });
    });
});

/******************************************************
 * 登出
 ******************************************************/
app.get('/logout', (req, res) => {
    currentUser = null; // 清除
    res.json({ success: true, message: '已登出' });
});

/******************************************************
 * 取得使用者資訊 (給前端顯示登入狀態, 頭像等)
 ******************************************************/
app.get('/user-info', (req, res) => {
    if (!currentUser) {
        return res.json({ loggedIn: false });
    }
    const avatarUrl = currentUser.avatarFilename 
        ? `/uploads/${currentUser.username}/${currentUser.avatarFilename}` 
        : '';
    res.json({
        loggedIn: true,
        username: currentUser.username,
        avatarUrl
    });
});

/******************************************************
 * Multer 設定：上傳頭像
 ******************************************************/
const uploadAvatar = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!currentUser) return cb(new Error('尚未登入'), '');
            const userDir = path.join(__dirname, 'public', 'uploads', currentUser.username);
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }
            cb(null, userDir);
        },
        filename: (req, file, cb) => {
            if (!currentUser) return cb(new Error('尚未登入'), '');
            const ext = path.extname(file.originalname);
            // 檔名: <username>_avatar.png
            const filename = `${currentUser.username}_avatar${ext}`;
            cb(null, filename);
        }
    })
});

/******************************************************
 * Multer 設定：上傳 HTML
 ******************************************************/
const uploadHtml = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!currentUser) return cb(new Error('尚未登入'), '');
            const userDir = path.join(__dirname, 'public', 'uploads', currentUser.username);
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }
            cb(null, userDir);
        },
        filename: (req, file, cb) => {
            if (!currentUser) return cb(new Error('尚未登入'), '');
            const ext = path.extname(file.originalname).toLowerCase();
            if (ext !== '.html') {
                return cb(new Error('只允許上傳HTML檔案'), '');
            }
            // 檔名: <username>_page_<timestamp>.html
            const filename = `${currentUser.username}_page_${Date.now()}${ext}`;
            cb(null, filename);
        }
    })
});

/******************************************************
 * 上傳頭像 API
 ******************************************************/
app.post('/upload-avatar', uploadAvatar.single('avatar'), async (req, res) => {
    if (!currentUser) {
        return res.json({ success: false, message: '尚未登入' });
    }
    if (!req.file) {
        return res.json({ success: false, message: '未選擇圖片檔案' });
    }
    // 更新DB中的 avatarFilename
    await Account.updateOne(
        { username: currentUser.username }, 
        { avatarFilename: req.file.filename }
    );
    currentUser.avatarFilename = req.file.filename;

    res.json({ 
        success: true, 
        message: '頭像已上傳成功', 
        avatarUrl: `/uploads/${currentUser.username}/${req.file.filename}` 
    });
});

/******************************************************
 * 上傳 HTML API
 ******************************************************/
app.post('/upload-html', (req, res) => {
    if (!currentUser) {
        return res.json({ success: false, message: '尚未登入' });
    }
    uploadHtml.single('htmlFile')(req, res, function(err){
        if (err) {
            return res.json({ success: false, message: err.message || '上傳失敗' });
        }
        if (!req.file) {
            return res.json({ success: false, message: '未選擇HTML檔案' });
        }
        // 回傳可線上瀏覽的網址
        const fileUrl = `/uploads/${currentUser.username}/${req.file.filename}`;
        res.json({ success: true, message: 'HTML檔案已上傳成功', fileUrl });
    });
});

/******************************************************
 * 啟動伺服器
 ******************************************************/
app.listen(3000, () => {
    console.log(`Server listening on http://localhost:3000`);
});
