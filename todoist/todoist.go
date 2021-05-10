package todoist

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/lirc572/nanourl/settings"
)

var TODOIST_API_TOKEN = settings.TodoistApiToken

var client = &http.Client{
	Timeout: time.Second * 10,
}

func GetProjects() string {
	req, _ := http.NewRequest("GET", "https://api.todoist.com/rest/v1/projects", nil)
	req.Header.Add("Authorization", "Bearer "+TODOIST_API_TOKEN)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	bodyString := string(bodyBytes)
	if resp.StatusCode == http.StatusOK {
		if err != nil {
			log.Fatalln(err)
		}
		return bodyString
	} else {
		log.Printf("Error requesting for projects (%d: %s), possibly wrong API token\n", resp.StatusCode, bodyString)
		return fmt.Sprintf("{\"error\": %d}", resp.StatusCode)
	}
}
