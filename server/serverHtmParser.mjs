import http from 'http';
import { promises as fs } from 'fs';
import { watch } from 'fs';

const PORT = 8000;
let htmlContent = '';
let headerContent = '';
let headerColumn = '';
let rows = '';
let col = '';
const dataToUpload = {
    wkpc: "MZAM3, MZAM3",
    names: []
};

function updateHeader(content, column) {
    let tmp = content;
    const headerRows = [
        {
            numberOfDataCols: 2,
            headerColumnName: 'Test1',
            headerColumnDate: '30.5. 6:00 - 18:00',
            column: column
        },
        {
            numberOfDataCols: 2,
            headerColumnName: 'Test2',
            headerColumnDate: '30.5. 6:00 - 18:00',
            column: column
        },
        {
            numberOfDataCols: 2,
            headerColumnName: 'Test3',
            headerColumnDate: '30.5. 6:00 - 18:00',
            column: column
        }
    ];
    let cols = '';

    tmp = tmp.replaceAll('$headerWorkplace', 'Stroj');
    tmp = tmp.replaceAll('$numberOfHeaderDetailCols', '1');
    tmp = tmp.replaceAll('$headerDetail', 'Jméno');

    headerRows.forEach((cl) => {
        let col = cl.column;
        col = col.replaceAll('$numberOfDataCols', cl.numberOfDataCols);
        col = col.replaceAll('$headerColumnName', cl.headerColumnName);
        col = col.replaceAll('$headerColumnDate', cl.headerColumnDate);
        cols += col;
    });

    tmp = tmp.replaceAll('$headerColumns', cols);
    return tmp;
}

function updateBody(row, col) {
    let rows = '';
    const testData = [
        {
            columns: [
                {
                    columnColor: 'green',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'green',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'green',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'green',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                }
            ],
            rw: row
        },
        {
            columns: [
                {
                    columnColor: 'orange',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'orange',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'orange',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'orange',
                    applyBold: 'disableBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                }
            ],
            rw: row
        },
        {
            columns: [
                {
                    columnColor: 'red',
                    applyBold: 'applyBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'red',
                    applyBold: 'applyBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'red',
                    applyBold: 'applyBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                },
                {
                    columnColor: 'red',
                    applyBold: 'applyBold',
                    numberOfCols: '2',
                    data: 'Test',
                    cl: col
                }
            ],
            rw: row
        }
    ];

    testData.forEach((r) => {
        let rowTmp = r.rw;
        let colTmp = '';

        r.columns.forEach((col) => {
            let colContent = col.cl;
            colContent = colContent.replaceAll('$columnColor', col.columnColor);
            colContent = colContent.replaceAll('$applyBold', col.applyBold);
            colContent = colContent.replaceAll('$numberOfCols', col.numberOfCols);
            colContent = colContent.replaceAll('$data', col.data);
            colTmp += colContent;
        });

        rowTmp = rowTmp.replaceAll('$rowCollumns', colTmp);
        rows += rowTmp;
        console.log(rows)
    });
    return rows;
}

async function loadHtml() {
    try {
        htmlContent = await fs.readFile('./index.htm', 'utf-8');
        headerContent = await fs.readFile('./html/Header.htm', 'utf-8');
        headerColumn = await fs.readFile('./html/HeaderColumn.htm', 'utf-8');
        rows = await fs.readFile('./html/Row.htm', 'utf-8');
        col = await fs.readFile('./html/Column.htm', 'utf-8');

        headerContent = updateHeader(headerContent, headerColumn);
        rows = updateBody(rows, col);
        htmlContent = htmlContent.replaceAll('$CWOC', 'XDXDXD');
        htmlContent = htmlContent.replaceAll('$header', headerContent);
        htmlContent = htmlContent.replaceAll('$rows', rows);
        // console.log(htmlContent);
    } catch (err) {
        console.error('Error reading index.htm:', err);
    }
}

async function startServer() {
    await loadHtml();

    http.createServer((request, response) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(htmlContent);
        response.end();
    }).listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });

    // Watch for changes in the HTML file
    watch('./index.htm', async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('File changed, reloading HTML content');
            await loadHtml();
        }
    });

    watch('./html/Header.htm', async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('Header file changed, reloading header content');
            await loadHtml();
        }
    });

    watch('./html/HeaderColumn.htm', async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('Header column file changed, reloading header column content');
            await loadHtml();
        }
    });

    watch('./html/Row.htm', async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('Row file changed, reloading row content');
            await loadHtml();
        }
    });

    watch('./html/Column.htm', async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('Column file changed, reloading column content');
            await loadHtml();
        }
    });
}

startServer();