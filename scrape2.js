const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'http://justinmaller.com/wallpapers/';

  page.setDefaultTimeout(99999999);

  await page.goto(url);

  // Collect array of page links
  const hrefArray = await page.evaluate(() => {
    const aTagArray = Array.from(
      document.querySelectorAll('.image')
      // .getElementById('main-container')
      // .getElementsByClassName('image')
      // .getElementsByTagName('a')
    );
    return aTagArray.map(a => a.href);
  });

  const filteredArr = hrefArray.splice(84);
  console.log(filteredArr);
  // console.log(hrefArray);

  // Loop through page links
  for (let href of filteredArr) {
    // for (let href of hrefArray) {
    await page.goto(href, { waitUntil: 'networkidle2' });
    const imageUrl = await page.evaluate(() => {
      return document
        .getElementById('wallwindow')
        .getElementsByTagName('img')[0].src;
    });

    const split = imageUrl.split('/');
    const filename = split[split.length - 1];

    const viewSource = await page.goto(imageUrl, {
      waitUntil: 'networkidle2',
    });

    fs.writeFile(
      `./wallpapers-2/${filename}`,
      await viewSource.buffer(),
      function(err) {
        if (err) {
          return console.log(err);
        }

        console.log(`The file was saved! - ${filename}`);
      }
    );
  }

  browser.close();
})();
