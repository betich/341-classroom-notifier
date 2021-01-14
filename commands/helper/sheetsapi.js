const https = require('https');
const config = require('../../config.json');

module.exports.callAPI = (sheet_number, range='A1:A1', cb=Function) => {
    const url = `https://spreadsheets.google.com/feeds/cells/${config.sheets_id}/${sheet_number}/public/values?alt=json`
    const req = https.request(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        })
        
        res.on('end', () => {
            data = JSON.parse(data);

            // start format data
            [start, end] = range.split(':');

            [colstart, rowstart] = cellsplit(start);
            [colend, rowend] = cellsplit(end);

            colstart = toIndex(colstart);
            colend = toIndex(colend);

            rowend = Number(rowend);
            rowstart = Number(rowstart);

            let output = new Array(rowend-rowstart+1);
            for (let i = 0 ; i < output.length ; i++) {
                output[i] = new Array(colend-colstart+1);
            }
            data.feed.entry.forEach(element => {
                row = Number(element['gs$cell']['row']);
                col = Number(element['gs$cell']['col']);
                if (row >= rowstart && row <= rowend && col >= colstart && col <= colend) {
                    output[row-rowstart][col-colstart] = element['gs$cell']['$t'];
                }
            });
            // end format data
            
            let ret = {};
            ret.title = data.feed.title['$t'];
            ret.data = filterNewLine(output);
            ret.removeBreakTime = removeBreakTime;
            ret.arrayToObject = arrayToObject;
            cb(ret);
        })

        req.on('error', e => {
            throw e;
        })

    })
    req.end();
}

const cellsplit = (a) => {
    const pat = /[A-Z,a-z]+/g;
    const n = pat.exec(a);
    return [ n[0], a.slice(n[0].length, a.length ) ];
}

const filterNewLine = (rows=Array) => {
    return rows.map(row => row.map(column => {
        return column.replace('\n', ' ')
    }));
}

const toIndex = (a) => {
    let x = 0;
    const array = a.split('');
    array.forEach(element => {
        x *= 26;
        x += (element.charCodeAt(0) - 64);
    });
    return x;
}

removeBreakTime = function () {
	this.data.splice(0,1);
	this.data = this.data.map((row) => {
		row.splice(3,1);
		row.splice(5,1);
		row.splice(7,1);
		row.splice(0,1);
		return row
	})
}

arrayToObject = function () {
    this.data = this.data.map((info) => {
        return {
            "subject": info[0],
            "teacher": info[1],
            "method": info[2],
            "username": info[3],
            "password": info[4],
            "link": info[5],
            "note": info[6],
            "id": info[7]
        }
    })
}