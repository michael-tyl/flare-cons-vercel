docker build -t flare-ai-consensus .
docker run -p 80:80 -it --env-file .env flare-ai-consensus
