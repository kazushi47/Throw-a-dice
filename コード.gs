const ACCESS_TOKEN = '<your token>';
const URL = 'https://api.line.me/v2/bot/message/reply';
const FOLDER = DriveApp.getFolderById('<your folder>');
const DRIVE_URL = 'https://drive.google.com/uc?id=';

function doPost(e) {
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  
  const num = Math.round(Math.random() * 5) + 1;

  const files = FOLDER.getFiles();
  var file = null;
  while (files.hasNext()) {
    file = files.next();
    if (file.getName() == 'dice-' + num + '.png') {
      break;
    }
  }
  
  UrlFetchApp.fetch(URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [
        {
          'type': 'text',
          'text': 'OK！サイコロを振るよ！何が出るかな・・・',
        },
        {
          'type': 'image',
          'originalContentUrl': DRIVE_URL + file.getId(),
          'previewImageUrl': DRIVE_URL + file.getId(),
        },
        {
          'type': 'text',
          'text': '出目は…' + num + 'だね！',
        }
      ],
    }),
  });
  
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}