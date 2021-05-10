package jwt

import (
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/settings"
	"github.com/lirc572/nanourl/util"
)

const (
	JWT_SUCCESS           = 200
	JWT_TOKEN_NONEXISTENT = 10000
	JWT_CHECK_FAIL        = 10001
	JWT_CHECK_TIMEOUT     = 10002
)

func JwtVerify() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		code := JWT_SUCCESS
		if token == "" {
			code = JWT_TOKEN_NONEXISTENT
		} else {
			claims, err := util.VerifyToken(token)
			if err != nil {
				switch err.(*jwt.ValidationError).Errors {
				case jwt.ValidationErrorExpired:
					code = JWT_CHECK_TIMEOUT
				default:
					code = JWT_CHECK_FAIL
				}
			} else {
				c.Set("jwt-verified-username", claims.Username)

				if time.Until(time.Unix(claims.ExpiresAt, 0)) < settings.JwtRefreshTime {
					newToken, err := util.GenerateToken(claims.Username)
					if err == nil {
						c.Header("Updated-Token", newToken)
					}
				}
			}
		}
		c.Set("jwt-verification-status", code)
		c.Next()
	}
}
