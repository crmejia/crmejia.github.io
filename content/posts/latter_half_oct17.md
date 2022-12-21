+++
author = "Crismar Mejia"
categories = ["GCP", "Kubernetes", "Neovim", "Prometheus"]
date = 2017-11-02T16:03:52Z
description = ""
draft = false
slug = "latter_half_oct17"
tags = ["GCP", "Kubernetes", "Neovim", "Prometheus"]
title = "Journal: Latter Half of October '17"

+++

So here is an update on what I’ve been doing in the latter half of October.

## Prometheus

I’m finally playing around with Prometheus and monitoring which is something I wanted to do for a long time. I’ve started by creating a 5 node cluster on GKE and then following a simple guide, [Kubernetes monitoring with Prometheus in 15 minutes](https://itnext.io/kubernetes-monitoring-with-prometheus-in-15-minutes-8e54d1de2e13) by [Giancarlo Rubio](https://twitter.com/gianrubio). Afterwards, I watched two talks about the subject [Monitoring, the Prometheus Way](https://www.youtube.com/watch?v=PDxcEzu62jk) by [Julius Volz](https://twitter.com/juliusvolz), one of the founders of Prometheus. Also, [End to end monitoring with the Prometheus Operato](https://www.youtube.com/watch?v=5Jr1v9mWnJc)r by [Frederic Branczyk](https://twitter.com/fredbrancz), he works for CoreOS and is one of the maintainers of the Prometheus Operator. I’ve learned a lot from both talks, now I plan to dive deeper into monitoring. As a side note, I’ve also watched [Taking the Helm: Delivering Kubernetes-Native Applications](https://www.youtube.com/watch?v=zBc1goRfk3k "Taking the Helm: Delivering Kubernetes-Native Applications by Michelle Noorali") by [Michelle ](https://twitter.com/michellenoorali)Noorali, Matt Butcher, and [Adnan Abdulhussein](https://twitter.com/prydonius).  I watched it because Helm is a very important project, in my opinion, and I used it to install the Prometheus operator.


## Service-Catalog

Last time, I mentioned I was reading up on the k8s API since I was working on a ticket. Here is the [Pull Request](https://github.com/kubernetes-incubator/service-catalog/pull/1480). This one was basically Bash scripting and Makefiles, however, I did learn a lot!


## Neovim

So I’ve been busy learning VIM, however, I decided to start using Neovim instead. Is a drop-in replacement for VIM that tries to keep what’s good and add new features. The same configuration works. I’ve also created a [dotfiles repo](https://github.com/crmejia/dotfiles) to keep track of my configuration. Have a look!


## Conclusion

That’s about it for these last two weeks. I’m planning to stick with the same subjects going into November. Catch you later!

