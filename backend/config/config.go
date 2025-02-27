package config

import (
	"github.com/spf13/viper"
)

// InitConfig sets up viper to automatically load environment variables
func InitConfig() {
	viper.AutomaticEnv()
}