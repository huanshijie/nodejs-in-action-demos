const fs = require('fs');
const http = require('http');

function getEntries() {
  const entries = [];
  let entriesRaw = fs.readFileSync('./entries.txt', 'utf8');
  entriesRaw = entriesRaw.split('---');
  entriesRaw.map(entryRaw => {
    const entry = {};
    const lines = entryRaw.split('\r\n');
    lines.map(line => {
      if (line.indexOf('title: ') === 0) {
        entry.title = line.replace('title: ', '');
      } else if (line.indexOf('date: ') === 0) {
        entry.date = line.replace('date: ', '');
      } else {
        entry.body = entry.body || '';
        entry.body += line;
      }
    });
    entries.push(entry);
  });
  return entries;
}

/**
 * without template
 */
// function blogPage(entries) {
//   let output = `
//     <html>
//       <head>
//         <style type="text/css">
//           .entry_title { font-weight: bold; }
//           .entry_date { font-style: italic; }
//           .entry_body { margin-bottom: 1em; }
//         </style>
//       </head>
//     <body>
//   `;
//   entries.map(entry => {
//     output += `
//       <div class="entry_title">${entry.title}</div>
//       <div class="entry_date">${entry.date}</div>
//       <div class="entry_body">${entry.body}</div>
//     `;
//   });
//   output += '</body></html>';
//   return output;
// }

/**
 * using ejs template
 */
const ejs = require('ejs');
const template = fs.readFileSync('./templates/blog_page.ejs', 'utf8');
function blogPage(entries) {
  const values = { entries };
  return ejs.render(template, values);
}

const entries = getEntries();

const server = http.createServer((req, res) => {
  const output = blogPage(entries);
  res.writeHead(200, { ContentType: 'text/html' });
  res.end(output);
});
server.listen(3000);
