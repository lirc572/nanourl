package util

type DbNoRecordUpdated struct{}

func (e *DbNoRecordUpdated) Error() string {
	return "No rows updated"
}

var ErrRecordNotUpdated = &DbNoRecordUpdated{}
