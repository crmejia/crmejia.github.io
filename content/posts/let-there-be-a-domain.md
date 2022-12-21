+++
author = "Crismar Mejia"
categories = ["Docker", "GCP", "Kubernetes", "WordPress"]
date = 2017-05-04T18:41:36Z
description = ""
draft = false
slug = "let-there-be-a-domain"
tags = ["Docker", "GCP", "Kubernetes", "WordPress"]
title = "Let There be a Domain"

+++

Now that the blog is back up finally we can finally get around to setting up a domain. First thing we would need is a static IP to point the domain to. So let’s do.

### Static IP on GKE for a Kubernetes Service

I did not find an official guide on how to do this. Fortunately, I found a [blog post](http://terrenceryan.com/blog/index.php/making-kubernetes-ip-addresses-static-on-google-container-engine/) and a [Stack Overflow](http://stackoverflow.com/questions/32266053/how-to-specify-static-ip-address-for-kubernetes-load-balancer#answer-33830507) answer that explains how to accomplish this. In summary, there are two ways (1) reserve a static IP address and then assign it to the load balancer or (2) change an already existing load balancer IP from ephemeral to static. Both are done from the[ GCP Networking > External IP addresses dashboard](https://console.cloud.google.com/networking/addresses/list). Since the blog is already UP, I’m going to switch the service IP to static. Now we must add a `loadBalancerIP: 10.10.10.10` field to our service deployment. That way if we need to redeploy k8s knows where it needs to point.

### Let There be a Domain

I thought about it for a while and looked around on what would work as the blog name. Since is a software/technology blog I notice some of the most popular developer’s blog use name and/or last name. So it made sense to use my name or something rather simple as the blog name. I found a short [blog post](http://www.chrisg.com/catchy-blog-names/) going over some tips on what makes a good name. The tip: a blog name should be spellable caught my attention because my last name is not spelled(in english) like it sounds. So I sticked to my first name. I tried to get ramsir.com, my name spelled backwards, since the .com would add the C and my other initials(Mejia, Ozuna). Alas, it was taken as well as ramsirc. I  settled on crismar.me and bought the domain on godaddy with default setup: forward with masking to the server IP. Oh and I had to spend some time reading about DNS to freshen my memory. Julia Evans has some [cool zines on networking ](http://jvns.ca/zines/)and talks briefly about DNS.

### Unresponsive blog

The blog is down again. I changed two settings: WordPress Address URL and Site Address URL and broke the blog. I figured I should use my domain here instead of the IP but the changes broke the site.

#### Hardcoding URLs on the config file

I found a [guide](https://codex.wordpress.org/Changing_The_Site_URL#Changing_the_Site_URL) that explains how to manually hard code these settings in the main config file(wp_config.php). The challenge is how to set these values in a cluster setup, persistent volumes attached to a pod. I found [another guide](https://cloud.google.com/compute/docs/disks/add-persistent-disk#formatting) that explains the process. Here’s the process step by step:

1. 1. From GCP, ssh into the VM of the node using the disk. We can see the disks from [https://console.cloud.google.com/compute/disks](https://console.cloud.google.com/compute/disks) We click on the VM of the node we are redirected to the VM compute instance.
2. Here we can click on the SSH button in the top left corner and connect to a fully function bash terminal hassle-free:
3. Once we get access we proceed to mount the persistent disk.

```
$lsblk #list the disks<br></br>
$sudo mkdir -p /mnt/disks/disk1<br></br>
$sudo mount -o discard,defaults /dev/sdc /mnt/disks/disk1/<br></br>
$cd /mnt/disks/disk1<br></br>
$ls
```

1. Make a backup of the the wp_config.php file,then open it in your favorite editor and add the lines below to set the url to be IP.

```
$cp wp-config.php ~<br></br>
$sudo vim wp-config.php
```

```
define('WP_HOME','<a href="http://example.com%27/">http://10.0.0.1'</a>);<br></br>
define('WP_SITEURL','<a href="http://example.com%27/">http://10.0.0.1'</a>);
```

Back online! However, the settings are hardcoded and we are not able to change them in the admin dashboard. It would be better to connect to the DB and set the values back. So let’s do it!

#### Setting the URL through the DB

Connecting to the DB means connecting to the mysql container running inside a pod. Just like docker allows us to run commands on a container using `docker run`, in Kubernetes we can use `kubectl exec` to run commands on a pod’s container(s). In our case the MySQL pod has only one container but if we had more we could specify the container by using the -c option. Here’s are the steps:

1. connect to the DB

```
$kubectl get pods #basically get the pod name<br></br>
$kubectl exec wordpress-mysql-2569670970-f1grp -- env #copy the mysql password<br></br>
$kubectl exec wordpress-mysql-2569670970-f1grp -- mysql -p
```

By this point we are inside the mysql cli. Notice that I did not set the password as I was not able to use the environment variable `MYSQL_ROOT_PASSWORD` as an argument just like docker run command does by using quotes. I did a little search and found this [issue](https://github.com/kubernetes/kubernetes/issues/7688) which describes problems with quotes. There is a [PR](https://github.com/kubernetes/kubernetes/pull/43663) on github trying to address the issue but is on hold as it broke some other functionality. So for the sake of brevity I decided to copy the env and paste it into mysql.

1. Update the wp_options table

In [section 1.4](https://codex.wordpress.org/Changing_The_Site_URL#Changing_the_URL_directly_in_the_database) of the wp guide there is a brief explanation on how to change the URLs in the DB. It does so by accessing phpMyAdmin so the guide is only useful for us to get the table and fields that we need to change. Those are table *wp_options* and fields *siteurl* and *home*. So back in the `mysql cli` we run:

```
mysql> use wordpress;  #set the db. Notice the ;<br></br>
mysql> select * from wp_options where option_name = 'siteurl' or option_name = 'home';<br></br>
mysql> update wp_options set option_value = 'http://104.196.161.37' where option_name = 'siteurl' or option_name = 'home';<br></br>
mysql> \exit
```

Done. Now we can go back to the node VM, mount the wordpress persistent disk and remove the hardcoded values.

Going back to the admin console I’m able to change the values again and the blog is still alive. Success!

#### Conclusion

Setting up a domain proved easier than I expected. However, fixing the blog after my mistake was a good challenge. After all the problems I ran into I can confidently say I’m able to set up WordPress blog from scratch and do some basic debugging on a kubernetes cluster. I think knowing how to mount a persistent disk and how connect to a pod are useful basic skills in kubernetes.

#### What’s next

For the next mini-project, I might set up a certificate for the site provided by let’s encrypt to enable https. Also, I’m thinking about setting up a monitoring and/or log solution other than kubernetes-ui dashboard to keep learning. Or I might setup a new cluster following one of the other examples in the repo. Stay tuned!