---
title: "Domino Count"
date: 2023-07-17T15:17:43-04:00
draft: false
tags: ["Go", "Fly.io", "SQLite"]
description: "Small Web App to count dominican style domino games. Written in Go, deployed in Fly.io"
---
 Howdy folks,

Let me introduce [Domino Count](https://billowing-glade-1070.fly.dev/), a web app for keeping score of a game of dominoes. You can find the repo [here](https://github.com/crmejia/DominoCount). My goals with this project were:

- Frontend: Experiment with htmx and Tailwind CSS. The end result still looks terrible, but with classes :laughing:
- DevOps and infrastructure: Use Github Actions to deploy to [Fly.io](http://fly.io/)

On the Go side of things, there were a few new things for me:

- Delivering static content using go:embed and http.FileServer: Delivering static content (images, scripts, stylesheets, and other resources) is a standard task in a web app. I did run into a weird bug by using gorilla.mux for [routing](https://github.com/crmejia/DominoCount/blob/c129464d9fabbde2cabfd771321ba3450659d31b/server.go#L109), as the matches are a bit different from http. (See [L20](https://github.com/crmejia/DominoCount/blob/master/server.go#L20), [L29](https://github.com/crmejia/DominoCount/blob/master/server.go#L29), [L259](https://github.com/crmejia/DominoCount/blob/master/server.go#L259))
- Handling an HTTP PATCH request: As far as I understand, this type of request is not normally supported by a browser, but htmx enables you to send other types of requests, not just GET and POST. (See [L132](https://github.com/crmejia/DominoCount/blob/master/server.go#L132))

An issue worth mentioning is the data replication problem I ran into. I'm using SQLite as my backend since it's simple and robust. However, by default, [Fly.io](http://fly.io/) creates two machines and load balances between them. The issue arises because each instance has its own volume attached to it, so making sure data is replicated is left as [an exercise to the reader](https://fly.io/docs/reference/volumes/#volume-considerations). There is an open-source solution being developed by Fly.io called [LiteFS](https://github.com/superfly/litefs). However, to install it, I would have to switch to Docker images. Another solution could be to scale down the instances to a single app.

For the time being, before I hit project fatigue, I'll work on something else. Maybe writing that data replication package. Or finally, creating an auth package to use in my apps.
