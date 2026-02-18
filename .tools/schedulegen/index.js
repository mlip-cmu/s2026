const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');

(async function () {

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly'
    });


    const client = await auth.getClient();
    google.options({ auth: client });



    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId)
        throw new Error("SPREADSHEET_ID not set");
    const labDir = process.env.LAB_DIR || "labs"
    const semesterRepo = process.env.SEMESTER || "s2026"

    const TABULAR = process.env.TABULAR || false

    if (TABULAR) {
        const prefix = "| Date  | Topic | [Book Chapter](https://mlip-cmu.github.io/book/) | Assignment due |\n| -     | -     | -     | -     |"
        console.log(prefix)
    }


 
    function findLabLink(id) {
        if (id === undefined || id == "")
            return undefined

        if (!fs.existsSync(labDir)) {
            return undefined;
        }

        const files = fs.readdirSync(labDir);
        if (id.startsWith("lab")) {
            id = id.substring(3);
        }
        return files.find(file => file === "lab" + id + ".md");
    }


    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'A:Z',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            const columnIds = { date: null, topic: null, assignmentDue: null, slidesLink: null, bookChapters: null, reading: null, assignmentLink: null, id: null, video: null };
            rows[0].forEach((header, index) => {
                if (header === "Date") columnIds.date = index;
                else if (header === "Topic") columnIds.topic = index;
                else if (header === "Assignment due") columnIds.assignmentDue = index;
                else if (header === "Book chapters") columnIds.bookChapters = index;
                else if (header === "Reading") columnIds.reading = index;
                else if (header === "Assignment link") columnIds.assignmentLink = index;
                else if (header === "Id") columnIds.id = index;
                else if (header === "Slides") columnIds.slidesLink = index;
                else if (header === "Video") columnIds.video = index;
            });

            let index = 0;
            rows.map((row) => {
                if (row[0] !== 'Date' && row[0] != '' && row[0] != undefined) {
                    const date = row[columnIds.date] || "";
                    const id = row[columnIds.id] || "";
                    let topic = row[columnIds.topic] || "";
                    const topicRaw = topic;
                    let assignment = row[columnIds.assignmentDue] || "";
                    const assignmentText = assignment;
                    const chapters = row[columnIds.bookChapters] || "";
                    const readings = row[columnIds.reading] || "";
                    const assignmentLink = row[columnIds.assignmentLink] || "";
                    const slidesLink = row[columnIds.slidesLink] || "";
                    const youtubeLink = row[columnIds.video] || ""; // format: https://www.youtube.com/watch?v=sJb780Na9Ks
                    const youtubeVideoId = youtubeLink.split("v=")[1]?.split("&")[0] || "";
                    let youtube = ""
                    let badges = ""
                    let readingsOut = ""
                    if (id.includes("lab"))
                        badges += "![Lab](https://img.shields.io/badge/-lab-yellow.svg) "
                    if (id.includes("midterm"))
                        badges += "![Midterm](https://img.shields.io/badge/-midterm-blue.svg) "
                    if (id.includes("break"))
                        badges += "![Break](https://img.shields.io/badge/-break-red.svg) "

                    const chapterLinks = chapters?.split(',').map(chapter => {
                        return `[${chapter.trim()}](https://mlip-cmu.github.io/book/${chapter.trim().padStart(2, '0')}/)`;
                    }).join(', ');

                    if (assignmentLink != undefined && assignmentLink != "")
                        assignment = `[${assignment}](${assignmentLink})`

                    if (id.startsWith("lab")) {
                        const labLink = findLabLink(id)
                        if (labLink != undefined && labLink != "")
                            topic = `[${topic}](https://github.com/mlip-cmu/${semesterRepo}/blob/main/labs/${labLink})`
                    }
                    else if (id.includes("guest")) {
                    }
                    else {
                        if (badges == "") {
                            if (slidesLink && slidesLink != "") {
                                topic = `[${topic}](${slidesLink})`
                            }
                            else {
                                topic = `${topic}`
                            }
                            index++;
                        }
                    }
                    if (youtubeVideoId && youtubeVideoId != "") {
                        youtube = ` <br /><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}" title="YouTube: Lecture Recording" frameborder="0" allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> `
                    }
                    if (readings)
                        readingsOut = ` <br />Readings: ${readings} `

                    if (TABULAR)
                        console.log(`| ${date} | ${badges}${topic}${youtube}${readingsOut} | ${chapterLinks} | ${assignment} |`)
                    else {
                        const isLab = id.includes("lab")
                        const isMidterm = id.includes("midterm")
                        const isBreak = id.includes("break")
                        const borderColor = isLab ? "#ffe08a" : isMidterm ? "#3e8ed0" : isBreak ? "#f14668" : "#e0e0e0"

                        let badgesHtml = ""
                        if (isLab) badgesHtml += `<span class="tag is-warning">Lab</span>`
                        if (isMidterm) badgesHtml += `<span class="tag is-info">Midterm</span>`
                        if (isBreak) badgesHtml += `<span class="tag is-danger">Break</span>`

                        let topicHtml = topicRaw
                        if (isLab) {
                            const labFile = findLabLink(id)
                            if (labFile) topicHtml = `<a href="https://github.com/mlip-cmu/${semesterRepo}/blob/main/labs/${labFile}">${topicRaw}</a>`
                        } else if (slidesLink) {
                            topicHtml = `<a href="${slidesLink}">${topicRaw}</a>`
                        }

                        const chapterLinksHtml = chapters ? "Book chapters: " + chapters.split(',').map(c => c.trim()).filter(c => c).map(c =>
                            `<a href="https://mlip-cmu.github.io/book/${c.padStart(2, '0')}/">${c}</a>`
                        ).join(', ') : ''

                        const assignmentHtml = assignmentText ? "Assignment due: "+
                            (assignmentLink ? `<a href="${assignmentLink}" class="tag is-warning is-light">${assignmentText}</a>` :
                                             `<span class="tag is-warning is-light">${assignmentText}</span>`) : ''

                        const chaptersDiv = chapterLinksHtml ? `<div class="is-size-6 has-text-grey-dark mt-1">${chapterLinksHtml}</div>` : ''
                        const assignmentDiv = assignmentHtml ? `<div class="is-size-6 has-text-grey-dark mt-1">${assignmentHtml}</div>` : ''
                        const readingsDiv = readings ? `<div class="is-size-6 has-text-grey mt-1">Readings: ${readings.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}</div>` : ''

                        const youtubeHtml = youtubeVideoId ? `<iframe style="width:100%;aspect-ratio:16/9;border:none;margin-top:0.5rem;display:block" src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}" title="YouTube: Lecture Recording" frameborder="0" allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` : ''

                        console.log(`
<div class="block"  style="border-left:4px solid ${borderColor};padding-left:0.75rem;margin-bottom:1.25rem">
    <h3 class="title is-3">${date}</h3>
    <p>${badgesHtml ? ` ${badgesHtml}` : ''} ${topicHtml}</p>
    <p>${chaptersDiv}${assignmentDiv}${readingsDiv}${youtubeHtml}</p>
</div>`)
                    }

                }
            });
        } else {
            console.log('No data found.');
        }
        console.log("\n\n")
    });


})();
