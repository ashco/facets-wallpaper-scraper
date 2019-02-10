const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'http://www.facets.la/wallpapers/';
  const urlImage = 'http://www.facets.la/wallpaper/W_2014_360_TOTEM.jpg';

  // TODO
  await page.goto(url);
  // Collect array of wallpaper pages
  const hrefArray = await page.evaluate(() => {
    const aTagArray = Array.from(
      document.getElementById('thumbs').getElementsByTagName('a')
    );
    const hrefArray = aTagArray.map(a => {
      return a.href;
    });
    return hrefArray;
  });

  // forEach link in #thumbs
  for (href in hrefArray) {
    await page.goto(href, { waitUntil: 'networkidle2' });
    const imageLink = await page.evaluate(() => {
      return document.getElementsByTagName('img')[0].src;
    });
    await page.goto(imageLink, { waitUntil: 'networkidle2' });

    const url = await page.url();
    const urlSplit = url.split('/');
    const filename = urlSplit[urlSplit.length - 1];

    fs.writeFile(`./images/${filename}`, await viewSource.buffer(), function(
      err
    ) {
      if (err) {
        return console.log(err);
      }

      console.log(`The file was saved! - ${filename}`);
    });
  }
  // 1.2 click on link
  // 1.3 wait for page to load
  // 1.4 click on image link
  // 1.5 wait for page to load
  // 1.6 write file
  // 1.7 repeat

  // const viewSource = await page.goto(urlImage, {
  //   waitUntil: 'networkidle2',
  // });

  // fs.writeFile('./images/test-image.jpg', await viewSource.buffer(), function(err) {
  //   if (err) {
  //     return console.log(err);
  //   }

  //   console.log('The file was saved!');
  // });

  // await browser.close();
})();
