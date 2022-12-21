+++
author = "Crismar Mejia"
categories = ["Docker", "GCP", "Kubernetes", "WordPress"]
date = 2017-04-16T21:39:55Z
description = ""
draft = false
slug = "blog-day-1-site-unavailable"
tags = ["Docker", "GCP", "Kubernetes", "WordPress"]
title = "Blog Day 1. Site Unavailable!?"

+++


#### Tuesday, March 21, 2017 around 6:30 pm

Just got home from work to find my brand new blog very slow. Which I find odd since I’m still at 104.196.107.177 and only shared the IP with a friend. So I’m jumped on the cloud shell to have a looks at the pods logs:

`$kubectl logs wordpress-3772071710-cn374`

```
10.1xx.xxx.xxx- - [21/Mar/2017:22:44:56 +0000] "GET http://weibo.cn/5179282824 HTTP/1.1" 301 332 "http://weibo.cn/5179282824" "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko" 10.92.0.1 - - [21/Mar/2017:22:44:56 +0000] "POST http://prostokvashino.ru:80/ HTTP/1.1" 404 10516 "http://prostokvashino.ru/" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9a3pre) Gecko/20070330" 1xx.xxx.xxx - - [21/Mar/2017:22:44:56 +0000] "GET http://weibo.cn/5179282824 HTTP/1.1" 301 332 "http://weibo.cn/5179282824" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 QIHU 360SE" 10.92.0.1 - - [21/Mar/2017:22:44:56 +0000] "GET http://weibo.cn/5179282824 HTTP/1.1" 301 332 "http://weibo.cn/5179282824" "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)"
```

A bunch of GET requests clogging down my kubernetes cluster. I have no idea why this is happening. Have I reached enough fame for a ddos attack in less than 24hrs? Is it an infinite loop somewhere in the stack(wordpress, mysql, apache, docker, kubernetes)? The bad news is I have no idea the origin. The good news is that I now have a good reason to write a blog on my blog. Everything still very meta.

#### Stop the Bleed

So where to start? After the logs I decided to stop the service which exposes the external IP:

`$kubectl delete service wordpress`

Blog down for the time being. Oddly enough after stopping the service I kept getting the same logs. Maybe an error in the stack? Next I decided to stop the wordpress pod: `$kubectl delete pod wordpress-3772071710-cn374`

After a few minutes it was restarted by the cluster but I get no logs. Similarly, I tried to get logs for the MySQL pod but nothing. I used `$kubectl describe pod wordpress-3772071710-scd0q` to get the pod IP and I noticed in the events that the persistent volume failed to mount:

```Warning         FailedMount     Failed to attach volume "wordpress-pv-2" on node "gke-k0-default-pool-1b3db445-lzl6" with: googleapi: Error 400: The disk resource 'projects/blog-162023/zones/us-east1-b/disks/wordpress-2' is already being used by 'projects/blog-162023/zones/us-east1-b/instances/gke-k0-default-pool-1b3db445-8fph'```

I also tried curling the pod and got the process just hanged. Looking at the logs I see:

```$ kubectl logs wordpress-3772071710-scd0qAH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 10.92.2.4. Set the 'ServerName' directive globally to suppress this messageAH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 10.92.2.4. Set the 'ServerName' directive globally to suppress this message[Tue Mar 21 22:50:16.686623 2017] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.10 (Debian) PHP/5.6.28 configured -- resuming normal operations[Tue Mar 21 22:50:16.686883 2017] [core:notice] [pid 1] AH00094: Command line: 'apache2 -D FOREGROUND'```

#### Restarting and Updating wordpress

I’ve recreated the service again by doing:

`$kubectl create -f $KUBE_REPO/examples/mysql-wordpress-pd/wordpress-deployment.yaml`

Only the service gets created since the pods is already up and running.

Now I wish to update the image to `wordpress:4.7.3-apache` from `wordpress:4.6.1-apache`. According to the [guide ](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/):

`kubectl set image deployment/wordpress wordpress=wordpress:4.7.3-apache`

Up and running. Yet the site appears to be compromised again… delete the service for the time being.


#### Redeploying from Scratch

I did some research to figure out what was happening but had no luck. I even asked on the [WordPress forum](https://wordpress.org/support/topic/fresh-install-using-docker-kubernets-on-google-cloud-looks-compromised/) to no avail. I’ve decided to recreate the cluster from scratch and try again. 

To no surprise I ran into issues trying to use MySQL 5.7: 

```2017-04-15T21:11:54.033297Z 0 [ERROR] --initialize specified but the data directory has files in it. Aborting.2017-04-15T21:11:54.033464Z 0 [ERROR] Aborting```

Fortunately, rolling back to 5.6 I had no issues deploying the DB and using the latest version of WordPress, that is 4.7.3.

Back online.

#### Conclusion

I’ve got to admit that fixing the blog became more troublesome than expected. I even thought of giving up on the kubernetes/docker platform for the sake of simplicity but that would beat the purpose of learning how to deploy something on production for the world to see.



