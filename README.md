tippecanoe -o gravelmap.mbtiles -l gravel -z 12 -P -aw -s EPSG:4326 gravelmap.geojson


mb-util --image_format=pbf --scheme=xyz gravelmap.mbtiles tiles


aws s3 cp tiles s3:// --recursive --content-encoding="gzip" --content-type="application/x-protobuf" --acl public-read