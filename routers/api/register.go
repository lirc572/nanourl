package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/httputil"
	"github.com/lirc572/nanourl/models"
)

const (
	REGISTER_SUCCESS        = 200
	REGISTER_UNKNOWN_ERROR  = 500
	REGISTER_INVALID_FORMAT = 10000
)

type registerReq struct {
	Username string `form:"username" json:"username" xml:"username" binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func registerAccount(register registerReq) int {
	registered, registerErr := models.RegisterUser(register.Username, register.Password)
	if registerErr != nil {
		return REGISTER_UNKNOWN_ERROR
	}
	if registered {
		return REGISTER_SUCCESS
	}
	return REGISTER_UNKNOWN_ERROR
}

func RegisterRouter(c *gin.Context) {
	var register registerReq
	err := c.ShouldBind(&register)
	if err != nil {
		c.JSON(http.StatusBadRequest, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	code := registerAccount(register)
	if code != REGISTER_SUCCESS {
		switch code {
		case REGISTER_INVALID_FORMAT:
			c.JSON(http.StatusBadRequest, httputil.HttpError{
				Error: strconv.Itoa(code),
			})
			return
		case REGISTER_UNKNOWN_ERROR:
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

	c.Status(http.StatusNoContent)
}
