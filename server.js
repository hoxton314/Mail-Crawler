const express = require('express')
const path = require('path');
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express()
const port = 80
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.use(express.static('static'))

fs.closeSync(fs.openSync(path.join(process.cwd(), 'static', 'data.txt'), 'w'))
fs.closeSync(fs.openSync(path.join(process.cwd(), 'static', 'urls.txt'), 'w'))

const urlStart = 'https://tl.krakow.pl/'
var recursive = 0
var mailArray = []
var urlArray = []
var timestamp = (new Date()).getTime()
function extract(text, type) {
    const regexUrl = new RegExp("a .*?href=\"(https?:\/\/[^\#]*?)\"", 'gm')
    const regexMail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    if (type == 'mail') {
        let mails = []
        try {
            mails = text.match(regexMail)
            mails = mails.filter(a => a.slice(-4) != '.png')
            mails = mails.filter(a => a.split("@").length == 2)
            mails = mails.filter(a => a.split(".")[a.split(".").length - 1].match(/\d+/g) == null)
        } catch (error) { }
        return mails;
    } else if (type == 'url') {
        let urls = []
        try {
            urls = text.match(regexUrl).map(url => ('http' + url.split('http')[url.split('http').length - 1]))
            urls = urls.filter(url => url.split("/").map(a => a[0]).some(a => a == "?") == false)
            urls = urls.map(url => url.slice(0, -1))
        } catch (error) { }
        return urls;
    } else {
        return undefined
    }
}

function main(text) {
    // if (recursive >= 1001) {
    //     console.log("================finished=============")
    //     process.exit()
    // }
    try {
        let mails = extract(text, 'mail')
        let urls = extract(text, 'url')
        console.log(mails);
        console.log(urls);
        mailArray.push(mails)
        urlArray.push(urls)
        mails.push('\n')
        fs.appendFile(path.join(process.cwd(), 'static', 'data.txt'), mails.join("\n"), function (err) { if (err) { console.error(err); return; } })
        fs.appendFile(path.join(process.cwd(), 'static', 'urls.txt'), urls.join("\n"), function (err) { if (err) { console.error(err); return; } })
        let flag = true
        let i = 0
        let checker = 0
        while (flag) {
            if (urls[i] != undefined && checker < 10) {
                if (recursive >= 1001) {
                    console.log("================finished=============")
                    console.log(timestamp)
                    console.log((new Date()).getTime())
                    console.log((new Date()).getTime() - timestamp)
                    process.exit()
                } else {
                    rekurencja(urls[i])
                    i++
                    checker++
                }

            } else {
                flag = false
            }
        }
    } catch (error) { }
}

function rekurencja(url) {
    try {
        recursive++
        fetch(url)
            .then(function (response) {
                //console.log(response.headers.get("content-type"))
                return response.text();
            })
            .then(function (text) {
                main(text)
            })
            .catch((error) => {
                console.error('Error url');
            });
    } catch (error) { }
}

rekurencja(urlStart)