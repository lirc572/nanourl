package models

import (
	"log"

	"github.com/lirc572/nanourl/settings"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func Setup() {
	var err error
	db, err = gorm.Open(postgres.Open(settings.PostgresUrl), &gorm.Config{})
	if err != nil {
		log.Fatalf("models.Setup error:  %v", err)
	}
	db.AutoMigrate(&Auth{}, &ShortUrl{})
}
