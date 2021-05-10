package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/httputil"
	"github.com/lirc572/nanourl/models"
)

func RedirectByAlias(c *gin.Context) {
	alias := c.Param("alias")
	url, err := models.GetUrlOfAlias(alias)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.Redirect(http.StatusMovedPermanently, url)
}
