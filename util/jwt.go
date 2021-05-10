package util

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lirc572/nanourl/settings"
)

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func VerifyToken(token string) (*Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return settings.JwtSecret, nil
	})

	if tokenClaims != nil {
		claims, ok := tokenClaims.Claims.(*Claims)
		if ok && tokenClaims.Valid {
			return claims, nil
		}
	}
	return nil, err
}

func GenerateToken(username string) (string, error) {
	currentTime := time.Now()
	expireTime := currentTime.Add(settings.JwtExpireTime)

	claims := Claims{
		username,
		jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    "nanourl",
		},
	}

	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString(settings.JwtSecret)

	return token, err
}
