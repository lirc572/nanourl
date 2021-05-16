package models

type ShortUrl struct {
	Alias       string `gorm:"primary_key" json:"alias"`
	Url         string `json:"url"`
	UserReferer string `json:"createdby"`
}

func ReadShortUrlsOfUser(username string) ([]*ShortUrl, error) {
	var shortUrls []*ShortUrl
	err := db.Where("user_referer = ?", username).Find(&shortUrls).Error
	if err != nil {
		return nil, err
	}
	return shortUrls, nil
}

func CreateShortUrl(username, url, alias string) error {
	shortUrl := ShortUrl{
		Alias:       alias,
		Url:         url,
		UserReferer: username,
	}
	result := db.Create(&shortUrl)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func ReadShortUrl(username, alias string) (ShortUrl, error) {
	var shortUrl ShortUrl
	err := db.Where("alias = ? AND user_referer = ?", alias, username).First(&shortUrl).Error
	if err != nil {
		return shortUrl, err
	}
	return shortUrl, nil
}

func UpdateShortUrl(username, alias, url string) error {
	err := db.Model(&ShortUrl{}).Where("alias = ? AND user_referer = ?", alias, username).Update("url", url).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteShortUrl(username, alias string) error {
	var shortUrl ShortUrl
	err := db.Where("alias = ? AND user_referer = ?", alias, username).First(&shortUrl).Error
	if err != nil {
		return err
	}
	err = db.Delete(&shortUrl).Error
	if err != nil {
		return err
	}
	return nil
}

func GetUrlOfAlias(alias string) (string, error) {
	var shortUrl ShortUrl
	err := db.Where("alias = ?", alias).First(&shortUrl).Error
	if err != nil {
		return "", err
	}
	return shortUrl.Url, nil
}
