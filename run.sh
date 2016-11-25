trap 'kill %1' SIGINT
python -m SimpleHTTPServer 12345 &
webpack -w
