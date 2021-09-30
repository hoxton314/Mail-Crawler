const express = require('express')
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// /(<h4><strong>).*(<\/strong><\/h4><table class=").*("><tbody>).*(<\/tbody><\/table>)*/gm;

//htmlFile = fs.readFileSync(path.join(process.cwd(), 'static', 'index.html'));
//htmlFile = htmlFile.match(/(<h4><strong>)(.*?)(<\/strong><\/h4><table class="table table-striped prices-table funerals"><tbody>)(.*?)(<\/tbody><\/table>)/gm)
//htmlFile = htmlFile[0]


const url = 'https://www.mailpoet.com/blog/email-testing-tools/'
const app = express()
const port = 80
var recursive = 0

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.use(express.static('static'))

function extract(text, type) {
    //const regexUrl = new RegExp("(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?", 'gm')
    const regexUrl = new RegExp("a .*?href=\"(https?:\/\/[^\#]*?)\"", 'gm')
    const regexMail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    //const regexMail = new RegExp()
    if (type == 'mail') {
        return text.match(regexMail);
    } else if (type == 'url') {
        return text.match(regexUrl);
    } else {
        return undefined
    }
}

function main(text) {
    console.log(extract(text, 'mail'));
    console.log(extract(text, 'url'));
}

fetch(url)
    .then(function (response) {
        //console.log(response.headers.get("content-type"))
        return response.text();
    })
    .then(function (text) {
        main(text)
    });
