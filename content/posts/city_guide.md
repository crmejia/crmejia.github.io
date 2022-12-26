---
title: "CityGuide: Go WebApp to Share Locations"
author: "Crismar Mejia"
date: 2022-12-26T16:50:08-04:00
draft: false
tags: ["Go", "Digital Ocean", "Terraform", "SQLite", "Nginx"]
---

# CityGuide: Go WebApp to Share Locations

[CityGuide](https://github.com/crmejia/CityGuide) is a WebApp to help you discover and share cool spots in cities. These guides are useful for backpackers, digital nomads, and people new in town that are keen to discover cool things. For the past year, I’ve been improving my Go coding skills with the goal of achieving a new milestone in my career. Similarly, I’ve been curious about Indie Hacking and MicroSaaS and what it would take for me to create my own product or service. Inspired by Peter Levels’ [Hoodmaps](https://levels.io/hoodmaps) creation in public and by an article called [Hello, production](https://blog.thepete.net/blog/2019/10/04/hello-production/) I decided to create CityGuide.
 
The goal of this project was to create a prototype that is deployed in production within a month. So for the month of August, I coded away and kept a log of my progress. Here’s that log:

Check out the GitHub repository here: https://github.com/crmejia/CityGuide

## Problem

As a digital nomad every time I travel to a new place I spend some time locating/discovering places that are useful to my stay: coworkings, gyms, markets, etc. I usually locate these places using a combination of Google Maps, reading blogs, and by asking around. This can take a few days of research which can be a problem for someone that relocates over the weekend and is looking to jump into a routine ASAP, specially if you’re working a regular 40h week. So it would be nice to be able to share a list of places, a guide, for a new town that answers these questions just by looking at it. In other words, you can see your options.

## Solution

Create an application that creates a city guide that can be shared with others. A city guide contains locations defined with: latitude, longitude, small review, and useful links.

Possible monetization: having hostels/accomodations pay to host the maps that they can offer to  guest for free. 

## Motivation

My motivation is to practice my Go skills as well as my product creation skills. I’m inspired by [Hoodmaps](https://levels.io/hoodmaps/) creation in public. Also by [Hello, production](https://blog.thepete.net/blog/2019/10/04/hello-production/) because I want to create a product that is running in prod even if it’s minimal. I believe this would be a great project that can be used as a portfolio.

## Building

### Day 0

Monday, *August 1*

Reading the hoodmaps blog posts and Hello, production.

### Day 1

Playing around with LeafletJS to see what is needed to draw locations on a map and familiarize myself with needed data. Followed this tutorial [https://leafletjs.com/examples/quick-start/](https://leafletjs.com/examples/quick-start/)

Reading: “Tracer Bullet” chapter in Pragmatic Programmer.

### Day 2

Started “City Guide” Go project. Decided to deploy *Hello World on Prod* as a map centered around a town.

### Day 3

Spend some time reading about: mapping projects, deployments, and CICD. The former two mostly by browsing Digital Ocean Community docs. Decided to deploy on my DO droplet 

- [https://www.digitalocean.com/community/tutorials/how-to-deploy-a-go-web-application-using-nginx-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-go-web-application-using-nginx-on-ubuntu-18-04)

Added a simple HTTP server serving a map. Tomorrow going to server it on Digital Ocean.

### Day 4

First order of the day is reorganizing my toolbox and processes. Focusing on simplicity and moving forward. I ended up setting up my own git server using this [guide](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server). 

### Day 5

Deploying on server. 

### Day 6

*Sunday, August 7*

While configuring the current server that host my blog(Crismar.me) I managed to locked myself out of the machine. I tried a few things like copying the `.ssh/authorized_keys` and even the Digital Ocean droplet recovery consul to no avail.

### Day 7

*Monday, August 8*

Started a new server(droplet) from scratch. Set up a git server. Installed Go.

### Day 8

*Tuesday, August 9*

Setting up nginx!

I spend about 2 hours reading about firewalls and ufw. 

As silly as it may sound, I spent most of my working day trying to figure what Go does with templates and assets. I discovered while deploying to prod that the template that I had created was not included in the binary so I’m getting an error when trying to reach the site’s index. I’ve asked in the [Go’s #newbies channel](https://gophers.slack.com/archives/C02A8LZKT/p1660068047198189) and in [Bitfield’s](https://bitfieldconsulting.com) #go channel. I was hoping for a definitive answer or some guidance on how this should be done when deploying. How was it done before the new `embed` package?

### Day 9

*Wednesday, August 10*

Used `embed` and it's now live here [http://142.93.188.236](http://142.93.188.236) ! 

I’ll have to build a Delivery pipeline

### Day 10

*Thursday, August 11*

Back to the code!

### Day 11

*Friday, August 12*

Decided to introduce IDs as the index to Guides instead of coordinates. That meant a lot of refactoring.

### Day 12

*Tuesday, August 16* 

Realized that POIs(Points of Interests) also ought to be indexed by IDs rather than coordinates(which are not necessarily unique). Also realized that POIs being a (hash)map adds unnecessary complexity because it makes into a “store” entity which means it needs CRUD. To avoid complexity, I’m keeping it simple as an array. This was the first lesson of the day.

Another interesting lesson, is the fact that I cannot template a variable inside a script block [https://go.dev/play/p/Kuw9QokufWC](https://go.dev/play/p/Kuw9QokufWC) I was about to ask on StackOverflow until I realized that this could be accomplished directly using Javascript. Something tells me this is on purpose.

### Day 13

*Wednesday, August 17*

Create Guide!

### Day 14

*Thursday, August 18*

Finished `/guide/create` with decent form validation.

### Day 15

*Friday, August 19*

I’ve realized that I’m closing in on 49 hours of work on this project and in the interest of keeping it short I’ve got to wrap it up. My current plan is to add the ability to add Points Of Interest to guides, add a DB, and redeploy.

### Day 16

*Monday, August 22*

Added POI creation but it was not at straightforward as I expected. Things like:

- the route `/guide/poi/create` was a picked in order to use the standard library’s `http.mux`
- Spend sometimes making the slice of POI persists since the allocated slice was being lost when out of scope.

### Day 17

*Tuesday, August 23*

- Polishing tests and increasing coverage.
- Reading about DBs:
    - Great resources, this articles are on 🔥
        - [https://www.alexedwards.net/blog/introduction-to-using-sql-databases-in-go](https://www.alexedwards.net/blog/introduction-to-using-sql-databases-in-go)
        - [https://www.alexedwards.net/blog/organising-database-access](https://www.alexedwards.net/blog/organising-database-access)
    - As recommend by previous articles:
        - [http://go-database-sql.org/importing.html](http://go-database-sql.org/importing.html)
        - https://github.com/jmoiron/sqlx
        - https://github.com/guregu/null
        - https://github.com/golang/go/issues/11939
        - [https://www.reddit.com/r/golang/comments/38hkor/go_best_practice_for_accessing_database_in/](https://www.reddit.com/r/golang/comments/38hkor/go_best_practice_for_accessing_database_in/)
    
    ### Day 18
    
    *Wednesday, August 24*
    
    - ****[David Crawshaw SQLite and Go](https://www.youtube.com/watch?v=RqubKSF3wig)****
        - Entertaining
    - ****[GopherCon 2021: Ben Johnson - Building Production Applications Using Go & SQLite](https://www.youtube.com/watch?v=XcAYkriuQ1o)****
        - Nice best practices for a modern sqlite go app.
        - Execute these:
        
        ```go
        const pragmaWALEnabled = `PRAGMA journal_mode = WAL;`
        const pragma500BusyTimeout = `PRAGMA busy_timeout = 5000;`
        const pragmaForeignKeysON = `PRAGMA foreign_keys = on=;`
        
        for _, stmt := range []string{pragmaWALEnabled, pragma500BusyTimeout, pragma500BusyTimeout} {
        		_, err = db.Exec(stmt, nil)
        		if err != nil {
        			return err
        		}
        	}
        ```
        
    
    ### Day 19 -21
    
    *Thursday, August 25 - Tuesday, August 30*
    
    Implementing SQLite store.
    
    ### Day 22
    
    Wednesday, August 31
    
    Reorganizing the relation between store, handlers, and guides. I had the idea to move things around to have the compiler help me enforce separation of concerns. 
    
    ### Day 23
    
    *Wednesday, September 7*
    
    [v0.0.1](https://github.com/crmejia/CityGuide/releases/tag/v0.0.1-alpha) First release! 🎉
    
    ### Day 24
    
    Thursday, September 8
    
    [v0.0.2](https://github.com/crmejia/CityGuide/releases/tag/v0.0.2-alpha) Fixed some 🐛
    
    ## Conclusion
    
    I went a few days over August but was able to accomplish my goal of creating a prototype and improving my Go skills along the way. Later on in November I added users and authentication to familiarize myself with that. As of right now, I’m considering deploying with containers and using [Caddy](https://caddyserver.com) instead of Nginx. Another option is to create a new project from scratch but this time using a framework to see how far I can get in a month and get closer to being able to ship a full product in a month.