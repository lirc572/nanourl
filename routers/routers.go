package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/middleware/jwt"
	"github.com/lirc572/nanourl/routers/api"
	v1 "github.com/lirc572/nanourl/routers/api/v1"
	"github.com/lirc572/nanourl/todoist"
)

func InitRouters() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "v0.1",
		})
	})
	r.Static("/app", "./frontend/build")
	r.GET("/projects", func(c *gin.Context) {
		jsonData := []byte(todoist.GetProjects())
		c.Data(http.StatusOK, gin.MIMEJSON, jsonData)
	})

	r.POST("/register", api.RegisterRouter)
	r.POST("/login", api.LoginRouter)

	r.GET("/go/:alias", api.RedirectByAlias)

	apiv1 := r.Group("api/v1")
	apiv1.Use(jwt.JwtVerify())
	{
		apiv1.GET("/shorturls", v1.ReadShortUrls)
		apiv1.POST("/shorturls", v1.CreateShortUrl)
		apiv1.GET("/shorturls/:alias", v1.ReadShortUrl)
		apiv1.PUT("/shorturls/:alias", v1.UpdateShortUrl)
		apiv1.DELETE("/shorturls/:alias", v1.DeleteShortUrl)
	}
	return r
}
