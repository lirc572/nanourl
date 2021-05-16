package api

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/httputil"
	"github.com/lirc572/nanourl/models"
	"gorm.io/gorm"
)

func RedirectByAlias(c *gin.Context) {
	alias := c.Param("alias")
	url, err := models.GetUrlOfAlias(alias)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, httputil.HttpError{
				Error: err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.Redirect(http.StatusMovedPermanently, url)
}
