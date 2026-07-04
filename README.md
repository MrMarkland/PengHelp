# Clinical Day + After-4 Study Tracker

This website tracks:

- Daytime clinical work
- Patients seen
- Clinical skills practiced
- Blood draws
- IV insertions
- After-4 PM study time
- Study topics and methods
- Countdown to graduation on November 10, 2027
- Google Sheet storage
- Automatic Google Sheet dashboard charts

## Setup

### 1. Upload files to GitHub

Upload:

- index.html
- style.css
- app.js
- README.md

Then enable GitHub Pages.

### 2. Create Google Sheet

Create a new Google Sheet.

Go to:

Extensions > Apps Script

Paste the Google Apps Script code.

### 3. Deploy Apps Script

Click:

Deploy > New deployment > Web app

Use these settings:

- Execute as: Me
- Who has access: Anyone

Copy the Web App URL.

### 4. Connect website to Google Sheet

In `app.js`, replace:

```js
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
