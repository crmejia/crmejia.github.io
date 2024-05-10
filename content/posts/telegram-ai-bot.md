---
title: "How to use a LLMs If you don’t have a fancy GPU"
date: 2024-05-08T23:19:49-04:00
draft: false
tags: ["Go", "Fly.io", "Docker", "Ollama", "Llama3", Wireguard", "Telegram_bot"]
---

LLMs are cool and all but they take a long time to run if you have an old machine without a powerful GPU. You can use this idle this time to ponder about life or you can leverage the cloud and make it rain compute. It turns out the reason there’s limited GPU availability on the market is because cloud providers have been hoarding all the GPUs. In this short guide I’m going to walk you through how to leverage [Ollama](https://ollama.com/), [Fly.io](http://fly.io) and [Telegram Bots](https://core.telegram.org/bots/) to have your own personal AI assistant on demand using Go.

### Running LLMs with Ollama and Docker

I learned about Ollama last month as I was searching for how to run the recently released Llama3 model locally. It was love at first sight. It’s pretty simple to get running, supports several LLMs, and is written in Go. To get it running you can [download](https://ollama.com/download) the binaries from their site. In my case, I decided to run the [Docker image](https://hub.docker.com/r/ollama/ollama).

Running from a container it’s pretty straightforward, the only caveat is that you’d want to map a host directory to the container so you don’t have to download models every time you run the container. With that in mind here are the steps:

1. Pull the Ollama image. `docker pull ollama/ollama` .
2. Make a directory and map it to the container.
3. Run the container.
4. Exec into the container and start asking questions.
5. Finally, realize your old machine takes a while to answer.

```bash
docker pull ollama/ollama
mkdir ollama
docker run -d -v $(pwd)/ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama run llama3
```

### Enter Fly.io

The folks at Fly.io have gotten their hands on a few GPUs and have made them available to everyone. So why not leverage the Ollama docker image and get your own LLM running in The Cloud. You can find a complete tutorial on Fly.io’s blog: [Scaling Large Language Models to zero with Ollama](https://fly.io/blog/scaling-llm-ollama/). This setup allows you to run the LLM on demand and save monies by turning off your model when you don’t need it. Keep in mind that you can use cheaper(😉) GPUs such as A10s if your app lives in the windy city(ord). Also, you can access your LLMs from you machine [using a wireguard tunnel to your fly app network](https://fly.io/docs/networking/private-networking/#private-network-vpn). Alas, we are not here to dig tunnels.

### **Telegram bots**

Telegram is a popular social messaging platform with several innovative features. One of them being [Telegram’s bot capabilities](https://core.telegram.org/bots/), which we can leverage to relay messages to our LLMs, creating our own assistant in the process. There are several options in various programming languages to write bots for telegram. In my case, I choose to use Go and the [tgbotapi package](https://pkg.go.dev/github.com/go-telegram-bot-api/telegram-bot-api/v5). It’s worth nothing that there are a [few package options](https://core.telegram.org/bots/samples#go). The other package I use is the [Ollama API package](https://pkg.go.dev/github.com/ollama/ollama/api) to talk to the LLM.

The [code](https://github.com/crmejia/telegram-ai-bot) is simple. It creates two clients: a tgbotapi client that listens to messages using Go Channels and a Ollama API client that handles the communication with the LLM. To be able to run you need to provide a Telegram API Token. Which you can get by talking to [Telegram’s Bot Father](https://core.telegram.org/bots/tutorial#obtain-your-bot-token). For a local test, you would setup two enviroment variables: The `TELEGRAM_API_TOKEN` provided by Bot Father and `OLLAMA_HOST` which is a URL pointing to your model. The model can be running locally or if you did dig that Wireguard tunnel you can activate it and connect directly to the LLM.

To run on Fly is as simple as running `fly deploy` . Now we are ready to start chatting with our LLM.

### Conclusion

Turns out it’s straightforward to setup an AI assistant. Ollama and the Telegram API do most of the heavy lifting. From this hello world setup you can expand or change any part of the stack for your own projects. Enjoy!
