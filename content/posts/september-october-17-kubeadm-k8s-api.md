+++
author = "Crismar Mejia"
categories = ["kubeadm", "Kubernetes"]
date = 2017-10-16T19:33:21Z
description = ""
draft = false
slug = "september-october-17-kubeadm-k8s-api"
tags = ["kubeadm", "Kubernetes"]
title = "September & October '17: kubeadm, K8s API, VIM, and a little Housekeeping"

+++


I’m trying a new approach for my documenting process. Namely:

- Shorter posts on the blog.
- More tweets to share more of the day-to-day.
- Walkthrough guides will now be versioned(as they should) on GitHub.

Without further ado here’s what I’ve been up to:


## Bare Metal & kubeadm

I picked up kubeadm and build a bare metal Kubernetes cluster. I wrote a guide about it, you can find it on [GitHub](https://github.com/crmejia/kubeadm-centos7-bare-metal).

> I got 3 x Dell Optiplex 380: Pentium Dual-Core 2.6Ghz 2GB RAM 160GB HDD and I’m going to install Centos 7 as the host [pic.twitter.com/ZFEyOOSVfS](https://t.co/ZFEyOOSVfS)
> 
> — Crismar Mejia (@CrismarMOz) [September 30, 2017](https://twitter.com/CrismarMOz/status/914219256014884865?ref_src=twsrc%5Etfw)


I learned so much on this project:

- I realized that building a cluster is not trivial(yet).
- There are many tradeoffs to make.
- Improved my Kubernetes debugging skills since I had to look at the kubelet, docker, pods, nodes, etc.

> Voilà ! [pic.twitter.com/4QJ4AFwUzP](https://t.co/4QJ4AFwUzP)
> 
> — Crismar Mejia (@CrismarMOz) [October 9, 2017](https://twitter.com/CrismarMOz/status/917228706946576384?ref_src=twsrc%5Etfw)


## Kubernetes API

I’m working on a ticket for service catalog that requires that I have a deeper understanding of k8s architecture and APIs. So, I took some time to reread and comprehend the [concepts](https://kubernetes.io/docs/concepts/) and [API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md). Similarly, I’ve been looking at the build process for both k8s and service catalog.


## Housekeeping

Perhaps you’ve noticed some changes in the blog. There is a new theme and the coffee beans header is gone. My domain now points to the (shorter)bio and I set up a simple email forwarding following this [guide](https://www.bersling.com/2017/07/11/forwarding-mail-with-ec2-ubuntu-and-elasticip/). This is part of my commitment to keep documenting. I plan to keep adding features and styling as time goes on.


## VIM

I’m also learning VIM. Two months ago, I taught myself how to touch type with gtypist as part of the process to learn VIM properly. Now I’m picking up VIM using vimtutor and following advice from this [guide](https://dev.to/peterfication/finally-switching-to-vim).


## Conclusion

Busy month. For the near future, I want to explore Helm and Prometheus on my new cluster. Also, I plan to keep contributing to the Kubernetes project and learning VIM. Catch you on the next one!

