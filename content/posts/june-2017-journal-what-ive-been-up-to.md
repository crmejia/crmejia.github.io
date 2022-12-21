+++
author = "Crismar Mejia"
categories = ["Kubernetes"]
date = 2017-07-02T11:11:30Z
description = ""
draft = false
slug = "june-2017-journal-what-ive-been-up-to"
tags = ["Kubernetes"]
title = "June 2017 Journal: What I've Been up to"

+++

Howdy folks! It’s been a while. I’ve kept myself busy this past month learning about different things in kubernetes and distributed systems. I’ve document most of it but I felt that nothing was worth a post that is until I found this article by Sam Jarman titled [“Online Presence”](https://www.samjarman.co.nz/blog/online-presence?utm_content=bufferbe064&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer). The article talks about, you guessed it, online presence in its various forms(blogs, vlogs, github, etc) but what really caught my attention was a linked video: [Gary Vaynerchuk’s Document, Don’t Create](https://www.youtube.com/watch?v=RVKofRN1dyI). After the video Sam gives some tips on what to document and how to document as a developer. That’s what I’m going to do going forward: document my learning process, log my journey, tell my story.

## Kubernetes the Hard Way

Right after setting up the blog I was asking the recurring “Where to go next”. I decided to complete Kelsey Hightower’s [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) guide. In this guide we use GCP and since I spend all the credit in my main account I had to set up another trial in my old account. This time I’ll be more careful with clusters. Overall, the guide was straight-forward. I learned more about components and how many of them you need to bootstrap a cluster.

## Running Workloads in Kubernetes

I learned about application patterns and how they’re addressed in k8s from Janet Kuo’s [Running Workloads in Kubernetes](https://medium.com/google-cloud/running-workloads-in-kubernetes-86194d133593). Turns out my blog project follows a “stateless pattern”. But there are also other patterns such as stateful, daemons, and batch. We do not set up datastore cluster the same way we schedule tasks. I will set up some quick projects with these patterns later on. 

## The Log: What every software engineer should know about real-time data’s unifying abstraction

I cannot for the life of me remember where I found it, I guess that’s another good reason for  documenting often. I know it was in another article that referenced it as *if you take away anything from here let it be reading this excellent article.* So I did. Before reading, my concept of logging was more of an application log for humans to read. The author puts it best:

> But before we get too far let me clarify something that is a bit confusing. Every programmer is familiar with another definition of logging—the unstructured error messages or trace info an application might write out to a local file using syslog or log4j. For clarity I will call this “application logging”. The application log is a degenerative form of the log concept I am describing. The biggest difference is that text logs are meant to be primarily for humans to read and the “journal” or “data logs” I’m describing are built for programmatic access.

So the article did teach me a better important lesson. Now when I have to design a system or a service I will consider a log centric approach. As a plus, I understood some of the ideas behind Apache kafka. So what are you waiting for go read [The Log: What every software engineer should know about real-time data’s unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying).

## Consensus -> Orchestration -> Raft

So I learned about consensus in Coursera’s [Cloud Computing Concepts, Part 1](https://www.coursera.org/learn/cloud-computing) and then I  came across this [talk](https://www.youtube.com/watch?v=Qsv-q8WbIZY&feature=youtu.be) about orchestration by Laura Frank. I really like it since it painted a picture of where consensus comes in for cluster orchestration. In k8s’ case in comes in etcd’s choice of the raft algorithm. My favorite part of the algorithm though is the [website](https://raft.github.io/) because it gathers all the key information you need to understand it: papers, talks, courses, where to ask questions, and real-world examples. I found some interesting assignments in the courses listed to implement raft. I hope to give it a go further down the line but for now let me stay on k8s.

## Where to Next?

One of my short-term career goals is to get involved in a OSS project and contribute. So after completing the guide and reading the articles I decided I want to contribute to k8s. I’ve already started working towards that goal. I found some good people willing to help out and a very interesting kubernetes SIG(Special Interest Group) but that’s story for another post. I want to advance further before sharing my experience. Sort of not to be jinxed. I’ll be documenting however. See you then.

