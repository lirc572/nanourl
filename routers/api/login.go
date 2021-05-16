package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/httputil"
	"github.com/lirc572/nanourl/models"
	"github.com/lirc572/nanourl/util"
	"gorm.io/gorm"
)

const (
	LOGIN_CHECK_SUCCESS       = 200
	LOGIN_CHECK_UNKNOWN_ERROR = 500
	TOKEN_GENERATION_FAIL     = 9999
	LOGIN_CHECK_FAIL          = 10000
	LOGIN_CHECK_NOT_FOUND     = 10001
)

type loginReq struct {
	Username string `form:"username" json:"username" xml:"username" binding:"required,min=6,max=16"`
	Password string `form:"password" json:"password" xml:"password" binding:"required,min=8,max=18"`
}

type loginRes struct {
	Token string `json:"token" format:"JWT"`
}

func verifyLogin(login loginReq) int {
	authed, err := models.CheckAuth(login.Username, login.Password)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return LOGIN_CHECK_NOT_FOUND
		}
		return LOGIN_CHECK_FAIL
	}
	if authed {
		return LOGIN_CHECK_SUCCESS
	}
	return LOGIN_CHECK_UNKNOWN_ERROR
}

func LoginRouter(c *gin.Context) {
	var login loginReq
	var token string
	err := c.ShouldBind(&login)
	if err != nil {
		c.JSON(http.StatusBadRequest, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	code := verifyLogin(login)
	if code != LOGIN_CHECK_SUCCESS {
		switch code {
		case LOGIN_CHECK_FAIL:
			c.JSON(http.StatusUnauthorized, httputil.HttpError{
				Error: strconv.Itoa(code),
			})
			return
		case LOGIN_CHECK_NOT_FOUND:
			c.JSON(http.StatusUnauthorized, httputil.HttpError{
				Error: strconv.Itoa(code),
			})
			return
		case LOGIN_CHECK_UNKNOWN_ERROR:
			c.JSON(http.StatusInternalServerError, httputil.HttpError{
				Error: strconv.Itoa(code),
			})
			return
		default:
			c.JSON(http.StatusInternalServerError, httputil.HttpError{
				Error: strconv.Itoa(code),
			})
			return
		}
	}

	token, err = util.GenerateToken(login.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: strconv.Itoa(TOKEN_GENERATION_FAIL),
		})
		return
	}

	c.JSON(http.StatusOK, loginRes{
		Token: token,
	})
}
