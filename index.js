const fs = require('fs');
const request = require('request');

const toScrape = JSON.parse(fs.readFileSync(__dirname + '/scrape.geojson')).features;
const output = fs.createWriteStream(__dirname + '/gravelmap.geojson');

(async function () {
    let processed = 1;
    for await (const cell of toScrape) {
        console.log(`${processed} of ${toScrape.length}`);
        await getData(cell);
        processed++;
    }
})();

async function getData(cell) {
    return new Promise(resolve => {
        const lngs = cell.geometry.coordinates[0].map(coord => coord[0]);
        const lats = cell.geometry.coordinates[0].map(coord => coord[1]);

        request.post('https://gravelmap.com/path', {form: {
            lat1: Math.min(...lats),
            lng1: Math.max(...lngs),
            lat2: Math.max(...lats),
            lng2: Math.min(...lngs),
        }}, (error, httpResponse, body) => {
            if (error) {
                resolve();
                return;
            }
            const response = JSON.parse(body);

            Object.keys(response.vispaths).forEach(key => {
                const {raw_points} = response.vispaths[key];
                if (!raw_points) return;

                output.write(JSON.stringify({
                    type: 'Feature',
                    properties: {id: key},
                    geometry: rawPointsToGeoJSON(raw_points),
                }) + '\n');
            });

            // be kind
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    });
}

function rawPointsToGeoJSON(coords) {
    return {
        type: 'LineString',
        coordinates: coords
                .split('|')
                .map(coord => coord.split(','))
                .map(coord => coord.map(parseFloat).reverse())

    }
}
