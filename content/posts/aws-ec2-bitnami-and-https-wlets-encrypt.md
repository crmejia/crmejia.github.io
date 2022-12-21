+++
author = "Crismar Mejia"
categories = ["AWS", "bitnami", "https", "let's encrypt", "WordPress"]
date = 2017-05-15T20:07:06Z
description = ""
draft = false
slug = "aws-ec2-bitnami-and-https-wlets-encrypt"
tags = ["AWS", "bitnami", "https", "let's encrypt", "WordPress"]
title = "AWS EC2 + Bitnami and HTTPS w/Let's Encrypt"

+++


<span style="font-weight: 400;">I ran out of credit for Google Cloud. Turns out running a cluster is quite expensive. For the sake of having a blog while I keep learning about kubernetes and other technologies I decided to go with a simpler(and cheaper) approach to blogging.</span>

#### Enter AWS + Bitnami

<span style="font-weight: 400;">I chose to start AWS free trial and create a blog using the prepacked Bitnami solution. This deployment runs on a good ol’ VM and is cheap. Also, I get the chance to familiarize myself with the AWS stack which is useful since I could create a k8s cluster down the line and play with it.</span>

<span style="font-weight: 400;">Bitnami pre-packs WordPress, MariaDB, Apache HTTP Server, and some neat tools to facilitate a wordpress installation and setup. It’s a straightforward stack to set up and there is some fantastic </span><span style="font-weight: 400;">[documentation available](https://docs.bitnami.com/aws/get-started-marketplace).</span>

<span style="font-weight: 400;">I reached out to a colleague regarding my domain issue. Turns out I was using a forward on my A record hence the blog’s IP showed instead of the domain. After modifying the record I was able to have my domain show up.</span>

#### HTTPS with Let’s Encrypt

<span style="font-weight: 400;">Now that the blog is up I can work to enable HTTPS which is something I’ve been looking to do for a while. First, we need to get a certificate from a Certificate Authority(CA) which can be expensive see </span>[<span style="font-weight: 400;">here</span>](https://news.ycombinator.com/item?id=530600)<span style="font-weight: 400;"> and </span>[<span style="font-weight: 400;">here</span>](https://security.stackexchange.com/questions/93624/why-are-there-very-expensive-and-cheap-ssl-same-type-certificates)<span style="font-weight: 400;">. Fortunately, we can get a free certificate from </span>[<span style="font-weight: 400;">Let’s Encrypt</span>](https://letsencrypt.org/)<span style="font-weight: 400;"> that provides just what we need to enable HTTPS.</span>

<span style="font-weight: 400;">There are straightforward instructions on how to get a certificate using </span>[<span style="font-weight: 400;">EFF’s Certbot</span>](https://certbot.eff.org/)<span style="font-weight: 400;"> if you have shell access. For Bitnami the process is a bit different since there are tools to manage certificates. We still need to install the Certbot but the certificates need to be put in the corresponding directories within the bitnami app. Following the </span>[<span style="font-weight: 400;">guide</span>](https://docs.bitnami.com/aws/components/apache/#how-to-install-the-lets-encrypt-client)<span style="font-weight: 400;"> from Bitnami docs here are my steps:</span>

<span style="font-weight: 400;">First we need to install git and certbot. In the AWS instance:</span>  
``

$sudo sudo apt-get install git  
 $cd /tmp  
 $git clone https://github.com/certbot/certbot  
 $cd cerbot  
 $./certbot-auto

At the end of the installation we get the message

<span style="font-weight: 400; color: #ff0000;">Failed to find executable apache2ctl in PATH: /opt/bitnami/varnish/bin:/opt/bitnami/sqlite/bin:/opt/bitnami/php/bin:/opt/bitnami/mysql/bin:/opt/bitnami/apache2/bin:/opt/bitnami/common/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin</span>

<span style="font-weight: 400; color: #008000;">Certbot doesn’t know how to automatically configure the web server on this system. However, it can still get a certificate for you. Please run “certbot-auto certonly” to do so. You’ll need to manually configure your web server to use the resulting certificate.</span>

<span style="font-weight: 400;">Run again, this time:</span>

`$./certbot-auto certonly --webroot -w /opt/bitnami/apps/wordpress/htdocs/ -d crismar.me`

<span style="font-weight: 400;">After accepting the terms and providing our email we get a certificate! Now we must install it on the server. The guide we are following doesn’t state this but the apache server on this wordpress pack has a </span>[<span style="font-weight: 400;">dummy cert</span>](https://docs.bitnami.com/aws/apps/wordpress/#how-to-enable-https-support-with-ssl-certificates)<span style="font-weight: 400;"> that we need to replace with ours. The guide creates symbolic links to the certs instead of copying them, my guess is that this is to automate the cert renew process since the certs expire every 3 months. </span>

```
$cd /opt/bitnami/apache2/conf/<br></br>
$rm server.crt<br></br>
$rm server.key<br></br>
$sudo ln -s /etc/letsencrypt/live/crismar.me/fullchain.pem server.crt<br></br>
$sudo ln -s /etc/letsencrypt/live/crismar.me/privkey.pem server.key```

<span style="font-weight: 400;">Then add the following lines to the </span><span style="font-weight: 400;"> </span>*<span style="font-weight: 400;">/opt/bitnami/apps/wordpress/conf/httpd-prefix.conf </span>*<span style="font-weight: 400;">to force https:</span>

`<span style="font-weight: 400;">RewriteEngine On</span><span style="font-weight: 400;"><br></br></span><span style="font-weight: 400;">RewriteCond %{HTTPS} !=on</span><span style="font-weight: 400;"><br></br></span><span style="font-weight: 400;">RewriteRule ^/(.*) https://%{SERVER_NAME}/$1 [R,L]</span>`

<span style="font-weight: 400;">And once again modify the wp config file to point to https:</span>

```
$vim /opt/bitnami/apps/wordpress/htdocs/wp-config.php define('WP_SITEURL', 'https://crismar.me/');<br></br>
define('WP_HOME', 'https://crismar.me/');```

<span style="font-weight: 400;">A small digression. In the previous post </span>[<span style="font-weight: 400;">Let There Be a Domain</span>](https://crismar.me/2017/05/04/let-there-be-a-domain/)<span style="font-weight: 400;">, I explained how I broke the blog by changing these variables. At the time I didn’t quite understand what went wrong but now I finally get it. Basically, the goal of these variables is to generate the URLs of the blog. That is all the links to all the pages and posts. In our case we want these links to be a domain rather than an IP. Turns out since my DNS was (mis)configured to forward I had a loop between my server and the DNS server that never resolved. My domain pointed to the IP but WordPress pointed to my domain. All in all, now I have a better understanding of DNS and servers and how to connect to pods in a cluster.</span>

<span style="font-weight: 400;">Finally, lets restart Apache httpd:</span>

`<span style="font-weight: 400;">$sudo /opt/bitnami/ctlscript.sh restart apache</span>`

And the blog should be all green locked! Almost. My login page and admin console are but some pages are not.

[![](https://crismar.me/content/images/2017/05/mixed-content.png)](https://crismar.me/content/images/2017/05/mixed-content.png)

<span style="font-weight: 400;">Turns out, I have some** mixed content**: </span>

<span style="font-weight: 400;">Mixed Content: The page at 'https://crismar.me/2017/04/16/blog-day-1-site-unavailable/' was loaded over HTTPS, but requested an insecure image 'http://i.imgur.com/oXki5DH.png'. This content should also be served over HTTPS.</span>

<span style="font-weight: 400;">In other words, my resources have to be HTTPS too! Let’s edit the post(s) and change that. That did it. Green!</span>

![](https://crismar.me/content/images/2017/05/greenlock-300x41.png)

#### Conclusion

<span style="font-weight: 400;">This time I had the chance to familiarize myself with AWS and to explore how some companies such as Bitnami work to make setup and installation simple. Also, I got around to setting up HTTPS and Certificates and learned what it takes to make a server secure. Now that the blog is rolling(in a secure HTTPS way I must add) and stable. I plan to go back to kubernetes and create a cluster from scratch. Until then!</span>

