# Gravelmap vector tiles

Scrape and convert all data from [gravelmap.com](https://gravelmap.com/) to vector tiles, usable in applications such as [Gaia GPS](https://gaiagps.com)

## Running

Scrape the data

````
node index.js
````

Convert it to vector tiles with `tippecanoe`

````
tippecanoe -o gravelmap.mbtiles -l gravel -z 12 -P -aw -s EPSG:4326 gravelmap.geojson
````

Unpack the vector tiles to a folder structure

````
mb-util --image_format=pbf --scheme=xyz gravelmap.mbtiles tiles
````

Upload the tiles to S3

````
aws s3 cp tiles s3://org.czaplewski.gravelmap --recursive --content-encoding="gzip" --content-type="application/x-protobuf" --acl public-read
````

Upload the style and TileJSON

````
aws s3 cp style.json s3://org.czaplewski.gravelmap
aws s3 cp tilejson.json s3://org.czaplewski.gravelmap
````

## Using in Gaia GPS
Go to [https://www.gaiagps.com/upload/mapsource/](https://www.gaiagps.com/upload/mapsource/) and
select `tilejson.json` from either this repo or download it first from [https://s3.amazonaws.com/org.czaplewski.gravelmap/tilejson.json](https://s3.amazonaws.com/org.czaplewski.gravelmap/tilejson.json). This will create a
new custom map source that you can use across all platforms and download for offline use.