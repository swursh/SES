// background.js
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message.action === "getPageSource") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fetchPageSourceAndRedirect,
        args: []
      }, (injectionResults) => {
        for (let frameResult of injectionResults) {
          callback(frameResult.result);
        }
      });
    });
    return true;
  }
});

function fetchPageSourceAndRedirect() {
  let source = document.documentElement.outerHTML;

  // 제외할 URL 목록
  let excludedURLs = [
    'https://support.google.com/mail/bin/answer.py?ctx=gmail&answer=6557&hl=ko&authuser=0',
    'https://support.google.com/mail/bin/answer.py?ctx=gmail&amp;answer=6557&amp;hl=ko&amp;authuser=0',
    'https://support.google.com/mail?p=fix-gmail-loading&amp;authuser=0',
    'https://accounts.google.com/SignOutOptions?hl=ko&amp;continue=https://mail.google.com/mail/data&amp;service=mail&amp;ec=GBRAFw',
    'https://support.google.com/mail?p=fix-gmail-loading&authuser=0',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl&amp;sw=2',
    'https://support.google.com/mail/answer/8767?src=sl&amp;hl=ko',
    'https://support.google.com/mail/answer/90559?hl=ko',
    'https://support.google.com/mail?hl=ko&amp;p=tls',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#inbox',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#starred',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#snoozed',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#sent',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#drafts',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#imp',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#chats',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#scheduled',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#all',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#spam',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#trash',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#category/social',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#category/updates',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#category/forums',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#category/promotions',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#settings/labels',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#label/%E2%9C%94',
    'https://mail.google.com/mail/u/0/?tab=rm&amp;ogbl#label/%E2%9C%94%E2%9C%94',
    'https://support.google.com/mail/answer/8253?hl=ko',
    'https://support.google.com/mail/answer/25760?hl=ko',
    'https://support.google.com/mail/answer/1366858?hl=ko',
    'https://support.google.com/mail/answer/1311182?hl=ko',
    'https://www.google.com/intl/ko/policies/terms/',
    'https://www.google.com/intl/ko/policies/privacy/',
    'https://www.google.com/gmail/about/policy/',
    'https://www.google.co.kr/intl/ko/about/products?tab=mh',
    'https://drive.google.com/u/0/settings/storage?hl=ko&amp;utm_medium=web&amp;utm_source=gmail&amp;utm_campaign=storage_meter&amp;utm_content=storage_normal',
    'https://www.naver.com/',
    'https://mail.naver.com/',
    'https://nid.naver.com/nidlogin.login',
    'https://nid.naver.com/user2/api/naverProfile?m=checkIdType',
    'https://nid.naver.com/user2/api/naverProfile?m=checkIdType',
    'https://nid.naver.com/nidlogin.logout?returl=https://www.naver.com',
    'https://mail.naver.com/',
    'https://nid.naver.com/user2/help/myInfo?menu=home',
    'https://nid.naver.com/user2/help/myInfo?m=viewSecurity&amp;menu=security',
    'https://nid.naver.com/user2/eSign/v1/home/land',
    'https://nid.naver.com/membership/my',
    'https://pay.naver.com/',
    'https://blog.naver.com/MyBlog.naver',
    'https://section.cafe.naver.com/',
    'https://pay.naver.com/',
    'https://nid.naver.com/membership/join',
    'https://talks.naver.com/?frm=pcgnb',
    'https://m.notify.naver.com/',
    'https://m.notify.naver.com/',
    'https://mail.naver.com/',
    'https://cafe.naver.com/',
    'https://news.naver.com/',
    'https://map.naver.com/',
    'https://sports.news.naver.com/',
    'https://game.naver.com/',
    'https://section.blog.naver.com/',
    'https://post.naver.com/main.nhn',
    'https://dict.naver.com/',
    'https://kin.naver.com/',
    'https://weather.naver.com/',
    'https://mail.naver.com/',
    'https://stock.naver.com/',
    'https://land.naver.com/',
    'https://vibe.naver.com/today/',
    'https://book.naver.com/',
    'https://shopping.naver.com/',
    'https://comic.naver.com/',
    'https://movie.naver.com/',
    'https://mybox.naver.com/',
    'https://novel.naver.com/webnovel/weekday',
    'https://campaign.naver.com/npay/rediret/index.nhn',
    'https://www.naver.com/more.html',
    'https://www.naver.com/more.html',
    'https://dict.naver.com/',
    'https://mail.naver.com/',
    'https://calendar.naver.com/',
    'https://memo.naver.com/',
    'https://contact.naver.com/',
    'https://mybox.naver.com/',
    'https://office.naver.com/',
    'https://moneybook.naver.com/',
    'https://keep.naver.com/',
    'http://www.swu.ac.kr/'
    // 필요한 경우 다른 URL을 추가하세요
  ];

  let matches = [];
  let match;

  // 특정 패턴과 일치하는 링크를 찾기 위한 정규 표현식
  let linkPattern = /<a[^>]*?href=["'](http[^"']+)["'][^>]*?>/gi;

  // 정규 표현식에 맞는 모든 링크 찾기
  while ((match = linkPattern.exec(source)) !== null) {
    let url = match[1]; // 일치하는 부분에서 URL 추출

    // 제외할 URL 목록에 포함되지 않는 경우에만 링크 목록에 추가
    if (!excludedURLs.includes(url)) {
      let parsedURL = new URL(url);
      let displayedURL = parsedURL.origin + parsedURL.pathname + parsedURL.search;
      matches.push(displayedURL); // 수정된 URL을 목록에 추가
    }
  }

  let resultText = matches.join('\n');

  // 팝업의 텍스트 영역 업데이트
  chrome.runtime.sendMessage({ action: "updatePopup", resultText: resultText });

  return resultText;
}
