+++
author = "Crismar Mejia"
categories = ["GitHub", "Kubernetes"]
date = 2017-08-21T19:45:31Z
description = ""
draft = false
slug = "july-august-2017-my-first-prs"
tags = ["GitHub", "Kubernetes"]
title = "July & August 2017: My first PRs"

+++


So last time I mentioned I was looking to contribute to the Kubernetes project. After an initially steep learning curve, I’ve managed to get two PRs approved on Service Catalog, a Kubernetes incubator project. Here’s how that happened.

## How I got started

I was looking for a good place to start on the k8s project. Coincidentally, I came across a [tweet by @TheNikhita](https://twitter.com/TheNikhita/status/872129013887664128) and decided to reach out and ask her about her experience and tips contributing to k8s. She suggested that I start by setting up the dev environment(see [running locally](https://github.com/kubernetes/community/blob/master/contributors/devel/running-locally.md) and [development](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md) ) and reading the [API convention](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md). Both of which are great resources.

I also read the [k8s community README](https://github.com/kubernetes/community#sigs). Here they suggested that the first step to contribute is to join a SIG(Special Interest Group) to figure out what’s going on and ask for a good place to start.

## Service Catalog

Service Catalog is a Special Interest Group(SIG) that is looking to implement the Open Broker API. I got interested because is a new project, alpha about to go beta, and is its own subsystem, with controllers, API server, etc. I believe is a great opportunity to get experience on an early stage project and help it grow. So I joined the meeting (Mondays 20:00 UTC) and after I reached out to one of the leads [@cheddarmint](https://twitter.com/cheddarmint) for tips on how to get started. He suggested following the [walkthrough](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/walkthrough.md) to get the catalog deployed on a k8s cluster. I was able to deploy the catalog without major drawbacks.

## My first approved PR

On the meeting on June 26, [@arschles](https://twitter.com/arschles) mentioned he was going to add some new test and refactor some old tests, that it would be a great place to start. So I reached out to him and he suggested I worked on [issue 860](https://github.com/kubernetes-incubator/service-catalog/issues/860). So I called #dibs on the ticket.

I started by following the workflow from the [k8s development guide](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md). Basically,

1. Fork in the cloud
2. Clone locally the fork
3. Make your changes on a branch
4. Keep in sync with upstream
5. Push to your fork
6. PR to upstream

However, I made a critical mistake in the process. I cloned to $GOPATH/src/github.com/crmejia/ instead of $GOPATH/src/github.com/Kubernetes-incubator. This simple mistake made it impossible for me to compile locally and run the test faster. For a while, I was running the test on docker until I realized my mistake and correctly set up my clone. I added the process to the svc-ca guide, [my first PR](https://github.com/kubernetes-incubator/service-catalog/pull/1114).

## Unit Testing & Go

Now for issue 860, I was tasked with testing an important testing component a fake rest client($GOPATH/src/github.com/Kubernetes-incubator/service-catalog/pkg/rest/core/fake/rest_client.go). Which encapsulates TPR based storage functionality within a fake client.

But how to go about testing in Go?I found a good [guide](https://blog.codeship.com/testing-in-go/) covering basic testing. So I started by testing the main data structure of the client, NamespacedStorage, which is a map of namespaces to types. These types are themselves a custom TypedStorage mapping types to ObjectStorage, which is mapping object names to k8s runtime.Objects. So basically a map within a map within a map. I tested the methods defined on NamedspacedStorage: Get, Getlist, Set, and Delete. I did not find this test very complicated since I have experience with data-structures.

It wouldn’t be a rest client if it couldn’t REST. So there is a RESTClient struct defined in rest_client.go that extends the fake client defined in the package k8s.io/client-go/rest/fake and adds a NamedspacedStorage, a Watcher, and a MetadataAccessor. Also. there is a private responseWriter struct defined with its own methods, testing these methods wasn’t complicated either.

Now the part I got stuck was when testing the RESTClient itself. At first, I was trying to test the handlers directly but it didn’t work since the router was not populated. After some time wondering why I got no objects out of populated storage, I figured that I needed a working router and that populating manually would be naive as it would be duplicating the rest client’s code. So I read up on gorilla/mux, the router used by the client, and started testing the handlers using the router. I had the good fortune to come across a video [justforfunc #16: unit testing HTTP servers](https://www.youtube.com/watch?v=hVFEV-ieeew) by [@francesc](https://twitter.com/francesc) that gives a good insight on how the test an HTTP server and how to use test tables and subtests. Sometimes I would get stuck on some service catalog details, thankfully the people over at the #sig-service-catalog in the k8s slack would clear up the confusion every time.

Finally, after much trial and much learning, I completed the [PR](https://github.com/kubernetes-incubator/service-catalog/pull/1113). I had to close the [old one](https://github.com/kubernetes-incubator/service-catalog/pull/1009) as I had signed the CLA(contributor license agreement) with a different email than the one I had for Github. So I had to make a new PR. However, this was also part of the reason I understood how to setup the clone properly.

## Conclusion

I was able to complete one of my short-term career goals, contribute to an OSS project. Is not a breakthrough contribution but it proves to me that I can do it. I’m nowhere near an expert in k8s but I took another step in the right direction. Going forward I want to keep contributing and learning while documenting. Catch you on the next post!

