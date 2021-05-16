package v1

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/httputil"
	"github.com/lirc572/nanourl/middleware/jwt"
	"github.com/lirc572/nanourl/models"
)

type createShortUrlReq struct {
	Alias string `form:"alias" json:"alias" xml:"alias" binding:"required,min=3,max=20"`
	Url   string `form:"url" json:"url" xml:"url" binding:"required,url"`
}

type updateShortUrlReq struct {
	Url string `form:"url" json:"url" xml:"url" binding:"required,url"`
}

func ReadShortUrls(c *gin.Context) {
	jwtVerificationStatus := c.GetInt("jwt-verification-status")
	if jwtVerificationStatus != jwt.JWT_SUCCESS {
		c.JSON(http.StatusUnauthorized, httputil.HttpError{
			Error: strconv.Itoa(jwtVerificationStatus),
		})
		return
	}
	username := c.GetString("jwt-verified-username")
	shortUrls, err := models.ReadShortUrlsOfUser(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, shortUrls)
}

func CreateShortUrl(c *gin.Context) {
	jwtVerificationStatus := c.GetInt("jwt-verification-status")
	if jwtVerificationStatus != jwt.JWT_SUCCESS {
		c.JSON(http.StatusUnauthorized, httputil.HttpError{
			Error: strconv.Itoa(jwtVerificationStatus),
		})
		return
	}
	username := c.GetString("jwt-verified-username")
	var createShortUrl createShortUrlReq
	err := c.ShouldBind(&createShortUrl)
	if err != nil {
		c.JSON(http.StatusBadRequest, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	err = models.CreateShortUrl(username, createShortUrl.Url, createShortUrl.Alias)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.Status(http.StatusNoContent)
}

func ReadShortUrl(c *gin.Context) {
	jwtVerificationStatus := c.GetInt("jwt-verification-status")
	if jwtVerificationStatus != jwt.JWT_SUCCESS {
		c.JSON(http.StatusUnauthorized, httputil.HttpError{
			Error: strconv.Itoa(jwtVerificationStatus),
		})
		return
	}
	username := c.GetString("jwt-verified-username")
	alias := c.Param("alias")
	shortUrl, err := models.ReadShortUrl(username, alias)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, shortUrl)
}

func UpdateShortUrl(c *gin.Context) {
	jwtVerificationStatus := c.GetInt("jwt-verification-status")
	if jwtVerificationStatus != jwt.JWT_SUCCESS {
		c.JSON(http.StatusUnauthorized, httputil.HttpError{
			Error: strconv.Itoa(jwtVerificationStatus),
		})
		return
	}
	username := c.GetString("jwt-verified-username")
	alias := c.Param("alias")
	var updateShortUrl updateShortUrlReq
	err := c.ShouldBind(&updateShortUrl)
	if err != nil {
		c.JSON(http.StatusBadRequest, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	err = models.UpdateShortUrl(username, alias, updateShortUrl.Url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.Status(http.StatusNoContent)
}

func DeleteShortUrl(c *gin.Context) {
	jwtVerificationStatus := c.GetInt("jwt-verification-status")
	if jwtVerificationStatus != jwt.JWT_SUCCESS {
		c.JSON(http.StatusUnauthorized, httputil.HttpError{
			Error: strconv.Itoa(jwtVerificationStatus),
		})
		return
	}
	username := c.GetString("jwt-verified-username")
	alias := c.Param("alias")
	err := models.DeleteShortUrl(username, alias)
	if err != nil {
		c.JSON(http.StatusInternalServerError, httputil.HttpError{
			Error: err.Error(),
		})
		return
	}
	c.Status(http.StatusNoContent)
}
