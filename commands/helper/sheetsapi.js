const fetch = require('node-fetch');

async function callAPI (sheet_number, range) {
    const raw_data = await fetch(`https://spreadsheets.google.com/feeds/cells/1dr00FcWgeZVLsFP_959YtQ6GGNgoPaRUNbaIu7ujY50/${sheet_number}/public/values?alt=json`);
    body = await raw_data.text();
    body = JSON.parse(body);
    
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
    body.feed.entry.forEach(element => {
        row = Number(element['gs$cell']['row']);
        col = Number(element['gs$cell']['col']);
        if (row >= rowstart && row <= rowend && col >= colstart && col <= colend) {
            output[row-rowstart][col-colstart] = element['gs$cell']['$t'];
        }
    });
    // end format data
    
    let ret = {};
    ret.title = body.feed.title['$t'];
    ret.body = filterNewLine(output);
    ret.removeBreakTime = removeBreakTime;
    ret.arrayToObject = arrayToObject;
    return ret;
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
    this.body.splice(0,1);
	this.body = this.body.map((row) => {
        row.splice(3,1);
		row.splice(5,1);
		row.splice(7,1);
		row.splice(0,1);
		return row
	})
}

arrayToObject = function () {
    this.body = this.body.map((info) => {
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

module.exports.callAPI = callAPI;