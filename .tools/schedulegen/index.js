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
            let currentWeek = null;
            let semesterStart = null;
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
                        const isExam = id.includes("midterm") || id.includes("final")
                        const isBreak = id.includes("break")
                        const isLecture = !isLab && !isExam && !isBreak

                        const entryType = isLab ? "is-lab" : isExam ? "is-midterm" : isBreak ? "is-break" : "is-lecture"

                        // Week separator
                        const dateObj = new Date(date)
                        if (!isNaN(dateObj)) {
                            if (!semesterStart) semesterStart = dateObj
                            const weekNum = Math.floor((dateObj - semesterStart) / (7 * 24 * 60 * 60 * 1000)) + 1
                            if (weekNum !== currentWeek) {
                                currentWeek = weekNum
                                if (weekNum > 1) console.log(`\n<div class="mt-6"></div>`)
                            }
                        }

                        // Topic with link
                        let topicHtml = topicRaw
                        if (isLab) {
                            const labFile = findLabLink(id)
                            if (labFile) topicHtml = `<a href="https://github.com/mlip-cmu/${semesterRepo}/blob/main/labs/${labFile}">${topicRaw}</a>`
                        } else if (slidesLink) {
                            topicHtml = `<a href="${slidesLink}">${topicRaw}</a>`
                        }

                        // Tag for entry type
                        let typeTag = ""
                        if (isLab) typeTag = `<span class="tag is-warning is-medium mr-2">Lab</span>`
                        else if (isExam) typeTag = `<span class="tag is-info is-medium mr-2">${id.charAt(0).toUpperCase() + id.slice(1)}</span>`
                        else if (isBreak) typeTag = `<span class="tag is-light is-medium mr-2">Break</span>`
                        else typeTag = `<span class="tag is-success is-medium mr-2">Lecture</span>`

                        // Due date line (appears before the type tag)
                        let dueLine = ""
                        if (assignmentText) {
                            const dueContent = assignmentLink
                                ? `<a href="${assignmentLink}">${assignmentText}</a>`
                                : assignmentText
                            dueLine = `\n  <p class="title is-5 mb-2"><span class="tag is-danger is-medium mr-2">Due</span> ${dueContent}</p>`
                        }

                        // Book chapters
                        const chapterLinksHtml = chapters ? chapters.split(',').map(c => c.trim()).filter(c => c).map(c =>
                            `<a href="https://mlip-cmu.github.io/book/${c.padStart(2, '0')}/">${c}</a>`
                        ).join(', ') : ''
                        const chapterCount = chapters ? chapters.split(',').map(c => c.trim()).filter(c => c).length : 0
                        const chapterLabel = chapterCount === 1 ? 'Corresponding book chapter' : 'Corresponding book chapters'
                        const chaptersLine = chapterLinksHtml ? `\n    <p class="is-size-6 has-text-grey mb-1"><strong>${chapterLabel}:</strong> ${chapterLinksHtml}</p>` : ''

                        // Reading
                        const readingsLine = readings ? `\n    <p class="is-size-6 has-text-grey mb-1"><strong>Required reading:</strong> ${readings.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}</p>` : ''

                        // Metadata div (book + reading)
                        const metadataDiv = (chaptersLine || readingsLine) ? `\n  <div class="mt-2">${chaptersLine}${readingsLine}\n  </div>` : ''

                        // Video
                        const youtubeHtml = youtubeVideoId ? `\n  <div class="columns mt-2">\n    <div class="column is-half-desktop">\n      <div class="video-wrapper"><iframe src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}" title="YouTube: Lecture Recording" allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>\n    </div>\n  </div>` : ''

                        console.log(`
<!-- ${date.replace(/^[A-Za-z]+, /, '')} -->
<div class="box schedule-entry ${entryType} mb-4 p-4">
  <p class="is-size-6 has-text-grey-dark mb-1">${date}</p>${dueLine}
  <p class="title is-5 mb-0">${typeTag} ${topicHtml}</p>${metadataDiv}${youtubeHtml}
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
