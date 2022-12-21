+++
author = "Crismar Mejia"
categories = ["Docker", "GCP", "Kubernetes", "WordPress"]
date = 2017-04-16T22:50:28Z
description = ""
draft = false
slug = "from-0-to-blogging-wordpress-on-kubernetes"
tags = ["Docker", "GCP", "Kubernetes", "WordPress"]
title = "From 0 to Blogging: WordPress on Kubernetes"

+++

I want to become a SRE/Distributed Systems Engineer. An expert in the field suggested I started small by setting up a WordPress blog using Kubernetes + Docker on a local machine or a cloud like a droplet from Digital Ocean or GKE from Google. So this is my journey setting up a blog.

## Udacity 615: Scalable Microservices with Kubernetes

I was debating where to start since I wasn’t familiar with Kubernetes or Docker. Luckily, I found a course on Udacity called Scalable Microservices with Kubernetes it took me around 5 nights to complete it. It’s a good course that gives a high level overview on how these technologies are put together and what they’re trying to solve, building scalable web apps. 

## Local Setup with Docker for MAC

To continue on my journey, I decided to forgo the cluster part and just familiarize myself with docker. Here’s a how to.

Install Docker for Mac using these [instructions](https://docs.docker.com/docker-for-mac/). If you are running linux or windows you can also install docker on your system.

Once you got docker installed open up a terminal and pull the images:

`$docker pull mysql`

`$docker pull wordpress`

Following the instructions on the[ mysql image ](https://hub.docker.com/_/mysql/)and [WordPress image](https://hub.docker.com/_/mysql/) get the DB server going(in a container) with:

`$docker run --name wp_db -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql`

Then get the WordPress going with:

`$docker run --name wp_demo --link wp_db:mysql -e WORDPRESS_DB_PASSWORD=my-secret-pw -p 8080:80 -d wordpress`

Notice the link to the mysql container with the option `--link wp_db``.` If you run: `$docker ps`

You should see both containers running.
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
b741bf4c23cc        wordpress           "docker-entrypoint..."   9 days ago          Up 42 seconds       0.0.0.0:8080->80/tcp   wp_demo
68d3739555af        mysql               "docker-entrypoint..."   9 days ago          Up 54 seconds       3306/tcp               wp_db
```
Your blog is live at localhost:8080!

Now stop the containers with : `$docker stop wp_demo && docker stop_wp_db`

## Minikube Setup

Now that we were able to get WordPress working locally is time to set it up in a Kubernetes cluster. Once again I decided to start small and set up Minikube by following this [guide](https://kubernetes.io/docs/getting-started-guides/minikube/#installation). Minikube is a tool to run a single node-cluster locally.  Minikube needs a vm to set up the cluster I’ve decided to go with xhyve as is more lightweight and already part of Docker for Mac. When done installing start the cluster with: `$minikube start --vm-driver=xhyve`

I found a [guide](https://github.com/kubernetes/kubernetes/tree/release-1.6/examples/mysql-wordpress-pd) in the kubernetes github repo for setting up WordPress + MySQL on a cluster. Following that example, without the persistent storage and without secrets for simplicity. I created two manifest that can be found [here](https://github.com/crmejia/blog_sample) one for a MySQL  deployment and one for WordPress.

From your working directory you can clone the repo or directly use the url to the files(raw). I chose the former: Create both deployments with:

`$kubectl create -f mysql-deployment.yaml`

`$kubectl create -f wordpress-deployment.yaml`

Check both pods are running with kubectl get pods

After find the service url with  minikube service wordpress –url

You should be able to curl the url or use your browser. 

## Google Container Engine(GKE)

FinalIy time to go big, I’m going to set up a k8s cluster on Google Cloud. However, this time I’m going to implement secrets to save the passwords and persistent volumes to allow the blog to persist.

First step, is to sign up for a Google Account to start using the Google Container Engine(GKE). I chose Google Cloud because they’ve extended their trial period for a whole year recently. Also, they have a free tier(3 node cluster) which enough for this project. Once you have access to the cloud, create a project and call it *blog. *Once you are in the project dashboard go to the *API Manager* and enable the Google Container API. Then start the cloud shell and run the following commands:

`$gcloud config set compute/zone us-east1-b`

`$gcloud container clusters create k0`

First commands sets the time zone. The second, creates a default cluster with 3 nodes. Yes, as simple as that! By the way you can check all the zones available by running: $gcloud compute zones list

Now we need to create the GCE persistent disks. One for WordPress and one for MySQL. Run:

`$gcloud compute disks create --size=20gb --zone=us-east1-b wordpress-1`

`$gcloud compute disks create --size=20gb --zone=us-east1-b wordpress-2`

And following the guide, we create persistent volume objects in our cluster for these disks. Notice how we are using the repo file(raw) instead of cloning the whole kubernetes repo.

`$export KUBE_REPO=https://raw.githubusercontent.com/kubernetes/kubernetes/master`

`$kubectl create -f $KUBE_REPO/examples/mysql-wordpress-pd/gce-volumes.yaml`

Now, let’s create the secret. First create a file with your password.

`$echo ‘<YOUR-PASSWORD>’ > password.txt`

Then remove any trailing newline(\n) and create the secret as per the guide.

`$tr --delete '\n' <password.txt>.strippedpassword.txt && mv.strippedpassword.txt password.txt`

`$kubectl create secret generic mysql-pass --from-file=password.txt`

Now let’s deploy mysql, as per the guide:

`$kubectl create -f $KUBE_REPO/examples/mysql-wordpress-pd/mysql-deployment.yaml`

After a brief period the pod should be up and running: `$kubectl get pods`

```
NAME                 READY     STATUS    RESTARTS   AGE 
wordpress-mysql-2569670970-4pzw0   1/1       Running   0    11m
```
And finally: `$kubectl get services wordpress`

Gets us the external IP where we can find our blog!

The guide warns against leaving the installation page live. Either set up the blog completely, delete the instance or set up a firewall.

In my case, I’m going to set up the blog and post.

## Conclusion

In this post we walked through setting up this very WordPress blog using Docker and Kubernetes. It just occurred to me to do a 2nd part, in this I’m going to break the bank and set up a domain(and come up with a cool name for the blog or just my name). Also, I’ve noticed that there is a newer version of WordPress so I’m going to be upgrading that too!
