package settings

import (
	"log"
	"os"
	"strconv"
	"time"
)

var HttpPort string
var PostgresUrl string
var ReadTimeout time.Duration
var WriteTimeout time.Duration
var MaxHeaderBytes int
var JwtSecret []byte
var TodoistApiToken string
var JwtExpireTime time.Duration
var JwtRefreshTime time.Duration
var AppPath string

func Setup() {
	var err error
	var readTimeoutString string
	var readTimeoutInt int
	var writeTimeoutString string
	var writeTimeoutInt int
	var jwtExpireTimeString string
	var jwtExpireTimeInt int
	var jwtRefreshTimeString string
	var jwtRefreshTimeInt int

	HttpPort = os.Getenv("PORT")
	if len(HttpPort) == 0 {
		HttpPort = "8848"
	}

	PostgresUrl = os.Getenv("DATABASE_URL")

	readTimeoutString = os.Getenv("READ_TIMEOUT")
	if len(readTimeoutString) == 0 {
		readTimeoutString = "60"
	}
	readTimeoutInt, err = strconv.Atoi(readTimeoutString)
	if err != nil {
		log.Fatalf("settings.Setup error when parsing READ_TIMEOUT: %v", err)
	}
	ReadTimeout = time.Duration(readTimeoutInt) * time.Second

	writeTimeoutString = os.Getenv("WRITE_TIMEOUT")
	if len(writeTimeoutString) == 0 {
		writeTimeoutString = "60"
	}
	writeTimeoutInt, err = strconv.Atoi(writeTimeoutString)
	if err != nil {
		log.Fatalf("settings.Setup error when parsing WRITE_TIMEOUT: %v", err)
	}
	WriteTimeout = time.Duration(writeTimeoutInt) * time.Second

	MaxHeaderBytes = 1 << 20

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))

	TodoistApiToken = os.Getenv("TODOIST_API_TOKEN")

	jwtExpireTimeString = os.Getenv("JWT_EXPIRE_TIME")
	if len(jwtExpireTimeString) == 0 {
		jwtExpireTimeString = "3600"
	}
	jwtExpireTimeInt, err = strconv.Atoi(jwtExpireTimeString)
	if err != nil {
		log.Fatalf("settings.Setup error when parsing JWT_EXPIRE_TIME: %v", err)
	}
	JwtExpireTime = time.Duration(jwtExpireTimeInt) * time.Second

	jwtRefreshTimeString = os.Getenv("JWT_REFRESH_TIME")
	if len(jwtRefreshTimeString) == 0 {
		jwtRefreshTimeString = "600"
	}
	jwtRefreshTimeInt, err = strconv.Atoi(jwtRefreshTimeString)
	if err != nil {
		log.Fatalf("settings.Setup error when parsing JWT_REFRESH_TIME: %v", err)
	}
	JwtRefreshTime = time.Duration(jwtRefreshTimeInt) * time.Second

	AppPath = os.Getenv("APP_PATH")
}
