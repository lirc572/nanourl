package main

import (
	"log"
	"net/http"

	"github.com/lirc572/nanourl/models"
	"github.com/lirc572/nanourl/routers"
	"github.com/lirc572/nanourl/settings"
)

func init() {
	settings.Setup()
	models.Setup()
}

func main() {
	server := &http.Server{
		Addr:           ":" + settings.HttpPort,
		Handler:        routers.InitRouters(),
		ReadTimeout:    settings.ReadTimeout,
		WriteTimeout:   settings.WriteTimeout,
		MaxHeaderBytes: settings.MaxHeaderBytes,
	}
	log.Printf("[info] Starting http server on port %s", settings.HttpPort)
	server.ListenAndServe()
}
