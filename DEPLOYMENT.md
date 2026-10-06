# Portfolio Website Deployment & Production Guide

This guide details how to publish and deploy the **Bharath C V — Developer Portfolio** to production across multiple free, high-performance static hosting platforms including **GitHub Pages**, **Vercel**, and **Netlify**. It also explains how to hook up live third-party APIs (OpenAI for the AI Twin and Resend for the Contact Form).

---

## 🚀 Option 1: Deploy to GitHub Pages (Recommended)

GitHub Pages provides free hosting with HTTPS and automatic Git-based continuous deployment.

### Step 1: Initialize Git Repository
In your terminal, navigate to the portfolio directory and initialize git:
```bash
git init
git add .
git commit -m "feat: complete portfolio with skills, timeline, projects modal, video, testimonials, and AI twin"
```

### Step 2: Create a GitHub Repository
1. Log into your GitHub account at [github.com](https://github.com).
2. Click **New Repository** (or **+** in the top right).
3. Name your repository (e.g. `bharath-portfolio` or `bharathcv.github.io`).
4. Set visibility to **Public**.
5. Do **not** initialize with a README, .gitignore, or License (since your project already has files).
6. Click **Create repository**.

### Step 3: Link Local Repo and Push
Run the commands shown on GitHub:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub and click **Settings**.
2. In the left navigation, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Wait 1–2 minutes. GitHub will provide your live URL:
   `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`

---

## ⚡ Option 2: Deploy to Vercel (Fastest with Custom Domain)

1. Sign up or log into [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Under **Framework Preset**, select **Other** (Pure HTML/CSS/JS).
5. Leave Root Directory as `./`.
6. Click **Deploy**.
7. Vercel will deploy your site in ~15 seconds with global edge CDN caching and free SSL.

---

## 🌐 Option 3: Deploy to Netlify (Drag & Drop or Git)

### Method A: Git Integration
1. Log into [netlify.com](https://netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Connect your GitHub repository.
4. Publish directory: leave as empty (or `./`).
5. Click **Deploy site**.

### Method B: Instant Manual Drag & Drop
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `Bharath c v` folder directly into the browser window.
3. Your site is live instantly with an active URL.

---

## 🔌 API Integrations (Optional Production Enhancements)

### 1. Connecting a Live LLM to the AI Chat Twin (`#ai-chat`)
Currently, `script.js` includes an intelligent keyword-based simulator. To connect to **OpenAI** or **Google Gemini**:

1. Open `script.js` and locate the `handleAISimulation(query)` function (around line 430).
2. Replace the `setTimeout` block with a fetch call to your secure serverless function or backend:
```javascript
// Secure backend proxy call (e.g., Vercel /api/chat or Cloudflare Worker)
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: query })
});
const data = await response.json();
appendChatMessage('ai', data.reply);
```

> **Security Note**: Never expose private API keys in client-side JavaScript. Use an environment variable inside a serverless function (`/api/chat.js`).

---

### 2. Delivering Contact Form Submissions via Resend API (`#contact`)
Currently, `script.js` displays an in-page confirmation banner (`#contact-confirmation`). To send real emails to `bharathcv440@gmail.com`:

1. Sign up for a free account at [resend.com](https://resend.com).
2. Generate an API Key.
3. In `script.js`, locate the `contactForm.addEventListener('submit', ...)` handler (around line 520).
4. Connect the submit event to your serverless email endpoint:
```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim()
  })
});
```

Alternatively, you can use **EmailJS** or **Formspree** with zero backend code by changing the form action:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## 📱 Cross-Browser & Device Checklist

| Component | Tested Features | Supported Viewports |
| :--- | :--- | :--- |
| **Floating Nav** | Blur background, dark toggle, responsive menu sheet | 320px – 4K Ultra Wide |
| **Skills Matrix** | Stepped pixel progress bars, category tabs, hover glow | Mobile, Tablet, Desktop |
| **Interactive Timeline** | Filter buttons, rounded cards, smooth hover transitions | Mobile, Tablet, Desktop |
| **Projects Gallery** | Clickable thumbnails, zoom hover, interactive spec modal | Responsive Grid & Lightbox |
| **Video Embed** | 16:9 aspect ratio, retro monitor chassis, caption | Fluid 100% width |
| **Testimonials** | Subtle drop shadows, 5-star ratings, avatars | 1 Column (Mobile) / 3 Col (Desktop) |
| **AI Chat Twin** | Quick chips, typing indicator, auto-scroll, reset | Scrollable card feed |
| **Contact Form** | High-contrast button, validation, success banner | Accessible & High-Contrast |
| **Footer** | Pixel art social buttons with retro hover bounce & tooltips | Evenly spaced |

---

## 🛠️ Verification Commands

You can verify and preview your portfolio locally by opening `index.html` in any browser:
- Double click `index.html` in File Explorer, or
- Run `Start-Process "c:\Bharath c v\index.html"` in Windows PowerShell.
