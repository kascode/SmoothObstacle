# SmoothObstacle

Node.js server for store and serve obstacle data in [Smooth](https://github.com/korifey/Smooth) project.
By default it listens to `http://localhost:3030`.

Database login/password and db name has to be entered in `config/db.js`.

In Smooth frontend all data for tish server is sent to `[hostname]/obstacles/add` and requested from `[hostname]/obstacles`. So you need to setup something like nginx proxy_pass
```
location /obstacles/ {
    add_header Access-Control-Allow-Origin [yourHostName];
    proxy_pass http://127.0.0.1:3030/obstacle/;
}
```

## Actions

### Create obstacle
```
POST
/obstacle/add
```
To create an obstacle send the data in POST request to `/obstacle/add`.
Server waits data in `multipart/form-data` format.

### Get all obstacles
```
GET
/obstacle
```
There is no need to get one obstacle at the time so we send all of them.
Server responds with JSON array of objects with coordinates, img name and dimensions of image.

## TODO
* Delete obstacle