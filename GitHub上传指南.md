# GitHub 上传指南

本指南将帮助你把项目上传到GitHub，然后部署到Railway和Vercel。

## 第一步：创建GitHub仓库

### 1.1 登录GitHub
访问 https://github.com 并登录你的账号

### 1.2 创建新仓库
1. 点击右上角的 **"+"** 按钮
2. 选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `bead-timer`（或你喜欢的名字）
   - **Description**: 拼豆DIY会员系统
   - **Public/Private**: 选择 Public（免费部署）
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要选择** .gitignore（我们已创建）
4. 点击 **"Create repository"**

### 1.3 上传代码
在仓库创建页面，你会看到几个选项。选择 **"push an existing repository from the command line"**，然后执行以下命令：

```bash
# 添加远程仓库（把 YOUR_USERNAME 换成你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/bead-timer.git

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 拼豆DIY会员系统"

# 推送到GitHub
git push -u origin master
```

或者，如果你想用主分支名称 `main`：

```bash
# 重命名分支为main
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/bead-timer.git

# 推送代码
git push -u origin main
```

---

## 第二步：部署后端到Railway

### 2.1 访问Railway
打开浏览器访问 https://railway.app

### 2.2 登录
1. 点击 **"Login"**
2. 选择 **"Login with GitHub"**
3. 授权GitHub访问

### 2.3 创建项目
1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 在列表中找到你的 `bead-timer` 仓库
4. 点击 **"Deploy"**

Railway会自动检测到Node.js项目并开始部署！

### 2.4 添加MySQL数据库
1. 部署完成后，点击项目
2. 点击 **"Add Plugin"**
3. 选择 **"MySQL"**
4. 数据库会自动创建并提供连接信息

### 2.5 配置环境变量
1. 在项目页面，点击 **"Settings"**
2. 找到 **"Environment Variables"**
3. 添加以下变量（Railway会自动填充数据库信息）：
   ```
   DB_HOST=your-mysql-host (Railway会自动填)
   DB_USER=your-mysql-user (Railway会自动填)
   DB_PASSWORD=your-mysql-password (Railway会自动填)
   DB_NAME=bead_timer
   PORT=3000
   ```

### 2.6 获取后端URL
1. 点击左侧 **"Deployments"**
2. 找到最新的部署
3. 复制 **"Domains"** 中的URL，类似：`https://bead-timer.up.railway.app`

---

## 第三步：初始化数据库

Railway提供了MySQL，但你需要手动创建表结构。

### 3.1 连接数据库
1. 在Railway项目页面，点击 **"MySQL"** 插件
2. 点击 **"Connect"**
3. 复制连接信息（主机、端口、用户名、密码、数据库名）

### 3.2 创建表结构
Railway提供了内置的数据库连接工具，或者你可以用任意MySQL客户端连接后执行：

```sql
CREATE DATABASE IF NOT EXISTS bead_timer DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bead_timer;

CREATE TABLE IF NOT EXISTS member (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(11) NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  remark VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_phone (phone),
  KEY idx_status (status),
  KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS member_recharge (
  id INT(11) NOT NULL AUTO_INCREMENT,
  member_id INT(11) NOT NULL,
  phone VARCHAR(11) NOT NULL,
  recharge_money DECIMAL(10,2) NOT NULL,
  after_balance DECIMAL(10,2) NOT NULL,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_member_id (member_id),
  KEY idx_phone (phone),
  KEY idx_create_time (create_time),
  CONSTRAINT fk_recharge_member FOREIGN KEY (member_id) REFERENCES member (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_id INT(11) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration INT(11) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  package_name VARCHAR(100) DEFAULT NULL,
  remark VARCHAR(255) DEFAULT NULL,
  member_phone VARCHAR(11) DEFAULT NULL,
  pay_type VARCHAR(20) NOT NULL DEFAULT '现金',
  member_pay_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_table_id (table_id),
  KEY idx_start_time (start_time),
  KEY idx_end_time (end_time),
  KEY idx_member_phone (member_phone),
  KEY idx_pay_type (pay_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 第四步：部署前端到Vercel

### 4.1 访问Vercel
打开浏览器访问 https://vercel.com

### 4.2 登录
1. 点击 **"Sign Up"** 或 **"Log In"**
2. 选择 **"Continue with GitHub"**
3. 授权GitHub访问

### 4.3 导入项目
1. 点击 **"Add New..."** → **"Project"**
2. 在列表中找到你的 `bead-timer` 仓库
3. 点击 **"Import"**

### 4.4 配置构建
1. **Framework Preset**: 选择 `Vite`
2. **Root Directory**: `./`（保持默认）
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### 4.5 设置环境变量
1. 点击 **"Environment Variables"**
2. 添加：
   - **Name**: `VITE_API_BASE`
   - **Value**: 你的Railway后端URL + `/api`
   
   例如：`https://bead-timer.up.railway.app/api`

### 4.6 部署
1. 点击 **"Deploy"**
2. 等待构建完成（约1-2分钟）
3. 获得一个类似 `https://bead-timer.vercel.app` 的URL

---

## 第五步：测试上线

恭喜！现在你应该有一个完整的线上系统了！

### 访问地址
- **前端**: `https://bead-timer.vercel.app`（Vercel提供的URL）
- **后端API**: `https://bead-timer.up.railway.app/api/health`（Railway提供的URL）

### 自定义域名（可选）

如果你有自己的域名，可以：
- **Vercel**: 在项目设置中添加自定义域名
- **Railway**: 在Domains设置中添加自定义域名

---

## 常见问题

### Q: Railway部署失败
**A**: 检查GitHub仓库是否包含正确的package.json，Railway需要能执行`npm install && npm start`

### Q: 前端无法连接后端
**A**: 确认Vercel的环境变量`VITE_API_BASE`设置正确，指向Railway的URL

### Q: 数据库连接失败
**A**: 检查Railway的MySQL环境变量是否正确配置

### Q: 如何更新代码？
**A**: 
1. 修改本地代码
2. `git add .`
3. `git commit -m "Update"`
4. `git push`
5. Railway和Vercel会自动重新部署

---

## 下一步

部署成功后，你就可以：
1. 通过网址访问系统
2. 邀请他人使用
3. 绑定自己的域名

祝你部署顺利！🎉
