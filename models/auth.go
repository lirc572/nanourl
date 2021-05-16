package models

import (
	"github.com/lirc572/nanourl/util"
)

type Auth struct {
	Username  string     `gorm:"primary_key" json:"username"`
	Password  string     `json:"password"`
	ShortUrls []ShortUrl `gorm:"foreignKey:UserReferer"`
}

func CheckAuth(username, password string) (bool, error) {
	var auth Auth
	err := db.Where("username = ?", username).First(&auth).Error
	if err != nil {
		return false, err
	}
	if util.CheckPasswordHash(password, auth.Password) {
		return true, nil
	}
	return false, nil
}

func RegisterUser(username, password string) (bool, error) {
	hashedPassword, hashErr := util.HashPassword(password)
	if hashErr != nil {
		return false, hashErr
	}
	auth := Auth{
		Username: username,
		Password: hashedPassword,
	}
	result := db.Create(&auth)

	if result.Error != nil {
		return false, result.Error
	}
	return true, nil
}
