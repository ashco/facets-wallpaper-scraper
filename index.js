const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'http://www.facets.la/wallpapers/';

  page.setDefaultTimeout(99999999);

  await page.goto(url);

  // Collect array of page links
  const hrefArray = await page.evaluate(() => {
    const aTagArray = Array.from(
      document.getElementById('thumbs').getElementsByTagName('a')
    );
    return aTagArray.map(a => a.href);
  });

  // Loop through page links
  for (let href of hrefArray) {
    await page.goto(href, { waitUntil: 'networkidle2' });
    const imageUrl = await page.evaluate(() => {
      return document
        .getElementById('facet-wallpaper')
        .getElementsByTagName('img')[0].src;
    });

    const split = imageUrl.split('/');
    const filename = split[split.length - 1];

    const viewSource = await page.goto(imageUrl, {
      waitUntil: 'networkidle2',
    });

    fs.writeFile(`./download/${filename}`, await viewSource.buffer(), function(
      err
    ) {
      if (err) {
        return console.log(err);
      }

      console.log(`The file was saved! - ${filename}`);
    });
  }

  browser.close();
})();
