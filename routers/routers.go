package routers

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lirc572/nanourl/middleware/jwt"
	"github.com/lirc572/nanourl/routers/api"
	v1 "github.com/lirc572/nanourl/routers/api/v1"
	"github.com/lirc572/nanourl/settings"
)

func InitRouters() *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{
		"Content-Type",
		"Content-Length",
		"Accept-Encoding",
		"X-CSRF-Token",
		"Authorization",
		"accept",
		"origin",
		"Cache-Control",
		"X-Requested-With",
	}
	r.Use(cors.New(config))

	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/app")
	})
	r.Static("/app", settings.AppPath)

	r.POST("/register", api.RegisterRouter)
	r.POST("/login", api.LoginRouter)

	r.GET("/:alias", api.RedirectByAlias)

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
