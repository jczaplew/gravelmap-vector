const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// if (process.argv.length < 3) {
//   console.log('Error! Missing TILES filename.\nUsage: node server.js TILES [PORT]');
//   process.exit(1);
// }

const port = 3000;
if (process.argv.length === 4) {
  port = parseInt(process.argv[3]);
}

app.use(function(req, res, next) {
    res.set({
        'Content-Type': 'application/x-protobuf',
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*',
    });
    next();
});

const mbtilesLocation = String(process.argv[2]).replace(/\.mbtiles/,'') + '.mbtiles';

const db = new sqlite3.Database('./gravelmap.mbtiles');

app.get('/:z/:x/:y.mvt', (req, res) => {
    db.serialize(() => {
        const row = Math.pow(2, req.params.z) - 1 - req.params.y
        db.get('SELECT tile_data FROM tiles WHERE zoom_level = ? and tile_column = ? and tile_row = ?', [
            req.params.z, req.params.x, row
        ], (error, row) => {
            if (error || !row) {
                console.log(req.params.z, req.params.x, req.params.y)
                return res.status(404).send('Could not find tile')
            }
            res.send(row.tile_data);
        });
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
