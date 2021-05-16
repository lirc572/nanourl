# nanonurl

## Install or Update

```bash
go get -u github.com/lirc572/nanourl
```

## Run

```bash
export TODOIST_API_TOKEN=<your_todoist_api_token>
export DATABASE_URL=<your_postgresql_connection_string>
export APP_PATH=<your_static_site_path>

GOPATH=${GOPATH:="$HOME/go"} && $GOPATH/bin/nanourl
```

## Use Nginx as a Reverse Proxy

Add the following configuration, modify it accordingly:

```
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=20r/s;

server {
        listen 80;
        listen [::]:80;

        server_name nanourl.ml;

        location / {
                limit_req zone=mylimit burst=50 nodelay;
                proxy_pass http://localhost:8848;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection upgrade;
                proxy_set_header Accept-Encoding gzip;
        }
}
```

For the lines on request rate limiting, refer to <https://nanourl.ml/nginx>.

## Run at Startup with Systemd

There is a [systemd service template file](https://github.com/lirc572/nanourl/blob/master/scripts/systemd/nanourl.service) in the GitHub repository.

Update `<your_todoist_api_token>`, `<your_user_name>`, and `<your_go_path>` in the template file and save it at `/etc/systemd/system/nanourl.service`, enable it with `sudo systemctl enable nanourl`, and start it with `sudo systemctl start nanourl`.

Check the status of the service with `sudo systemctl status nanourl`.

## Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
