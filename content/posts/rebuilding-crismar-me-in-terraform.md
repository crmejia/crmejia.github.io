+++
author = "Crismar Mejia"
date = 2021-08-16T21:57:41Z
description = ""
draft = false
slug = "rebuilding-crismar-me-in-terraform"
title = "Rebuilding crismar.me in Terraform"

+++


Howdy. It's been a while since I've maintained the blog. So instead of upgrading everything manually I've just decided to rewrite everything in Terraform and migrate the data. 

## Create the new Droplet using Terraform

First, we need to set up the Digital Ocean [Terraform provider](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs) following this [guide](https://www.digitalocean.com/community/tutorials/how-to-use-terraform-with-digitalocean). I added my token as an environment variable. Afterwards, we can create the droplet itself following the digital ocean droplet resource [docs](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet). I've published the [code](https://github.com/crmejia/crismar.me) on GitHub if you want to have a look.

## Setting up HTTPS for www.crismar.me

After the initial setup I tried accessing [www.crismar.me](http://www.crismar.me) but the browser complained that the certificate was invalid as it's only valid for crismar.me. After some googling, I found this [guide](https://ghost.org/docs/ghost-cli/#ssl) that explains how to setup ssl for additional domains.

The tl;dr is that we need to re-run the ghost config with the additonal domain so that ghost generates a new cert and a new nginx conf. Afterwards, we reset to the canonical domain and change the nginx confs of the additional domain to redirect to the canonical domain. Here's a step by step walkthough as there are something that are not obvious:

```bash
#ssh into your droplet and swith to the ghost usr
sudo -i -u ghost-mgr

#cd into the blog directory and the run the config
cd /var/www/ghost/
ghost config url https://www.crismar.me
ghost setup nginx ssl

#then reconfig to the original url and exit to the root usr
ghost config url https://crismar.me
exit
```

The next on the guide is to change the `location` blocks content to be `return 301 [https://my-canonical-domain.com$request_uri;](https://my-canonical-domain.com$request_uri;`)` that is a redirect. However, this instruction is vague if you're not familiar with how nginx works. The general idea, is that the confs are kept under `/etc/nginx/sites-available` and `/etc/nginx/sites-enabled` , the latter being symbolic links to the former:

```bash
# ls -l  sites-*
sites-available:
total 24
-rw-rw-r-- 1 ghost-mgr ghost-mgr  749 Aug 11 22:16 crismar.me-ssl.conf
-rw-rw-r-- 1 ghost-mgr ghost-mgr  546 Aug 11 22:15 crismar.me.conf
-rw-r--r-- 1 root      root      2416 Mar 26  2020 default
-rw-rw-r-- 1 ghost-mgr ghost-mgr  553 Aug 16 21:08 www.crismar.me-ssl.conf
-rw-rw-r-- 1 ghost-mgr ghost-mgr  337 Aug 16 21:08 www.crismar.me.conf

sites-enabled:
total 0
lrwxrwxrwx 1 root root 46 Aug 11 22:16 crismar.me-ssl.conf -> /etc/nginx/sites-available/crismar.me-ssl.conf
lrwxrwxrwx 1 root root 42 Aug 11 22:15 crismar.me.conf -> /etc/nginx/sites-available/crismar.me.conf
lrwxrwxrwx 1 root root 50 Aug 16 20:56 www.crismar.me-ssl.conf -> /etc/nginx/sites-available/www.crismar.me-ssl.conf
lrwxrwxrwx 1 root root 46 Aug 16 20:55 www.crismar.me.conf -> /etc/nginx/sites-available/www.crismar.me.conf

```

So we only need to make changes under `/etc/nginx/sites-available` . So in our case we would modify both `www.crismar.me.conf` and `www.crismar.me-ssl.conf` by changing everything inside the first location block to redirect to the canonical domain `crismar.me` 

```bash
location / {
       return 301 https://crismar.me$request_uri;
    }
```

Then test that the config is valid and reload the daemon:

```bash
nginx -t 
sudo nginx -s reload
```

and voila the new blog is ready to go!



