## Place in /etc/profile.d
ip=`echo $SSH_CONNECTION | cut -d " " -f 1`

currentDate=`date`
description="SSH login from $USER from the IP $ip"

if [ "$USER" != "postgres" ]; then
	curl -X POST -d "{\"description\": \"$description\"}" -H "Content-Type: application/json" http://toolbox.localhost/new_log
fi
