// Besties newsletter signups -> Google Sheet (free).
// Paste this into the sheet's Extensions > Apps Script, then Deploy > New deployment > Web app
// (Execute as: Me, Who has access: Anyone). The web app URL goes in index.html (data-endpoint).

const SHEET_NAME = 'Subscribers';
const NOTIFY_EMAIL = 'hello@bestiesgh.com'; // gets an email per new signup; set to '' to turn off

function doPost(e) {
  const email = String((e.parameter && e.parameter.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return reply({ success: false, message: 'Please enter a valid email address.' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(['Date', 'Email']);

    const last = sheet.getLastRow();
    const existing = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues().map(function (r) { return r[0]; }) : [];
    if (existing.indexOf(email) === -1) {
      sheet.appendRow([new Date(), email]);
      if (NOTIFY_EMAIL) {
        MailApp.sendEmail(NOTIFY_EMAIL, 'New Besties newsletter signup', email + ' just joined the newsletter list.');
      }
    }
    return reply({ success: true });
  } finally {
    lock.releaseLock();
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
