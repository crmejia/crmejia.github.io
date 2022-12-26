+++
author = "Crismar Mejia"
categories = ["AWS", "Infrastructure", "Terraform"]
date = 2017-09-19T00:41:29Z
description = "Creating a simple Kubernetes cluter in AWS with Terraform"
draft = false
slug = "creating-a-simple-cluster-with-terraform"
tags = ["AWS", "Infrastructure", "Terraform"]
title = "Creating a Simple Cluster with Terraform"

+++


Since my last post I’ve been reading about [Consul](https://www.consul.io/intro/index.html). Also, I found an interesting book: [Site Reliability Engineering ](https://landing.google.com/sre/book.html)by Google. So far I’ve read the intro and first chapter and I’m captivated. I want to take my career into SRE/DevOps and this book provides good insight. However, this post is about Terraform, I found a great blog and learned more about it.

## The Case for Terraform

I found a great series of posts by the engineers at Gruntwork called [A Comprehensive Guide to Terraform.](https://blog.gruntwork.io/a-comprehensive-guide-to-terraform-b3d32832baca) In the first [post,](https://blog.gruntwork.io/why-we-use-terraform-and-not-chef-puppet-ansible-saltstack-or-cloudformation-7989dad2865c) the author talks about their choice to use Terraform. Interestingly, the article describes trade-offs between Terraform and other choices as:

- Configuration Management vs Orchestration
- Mutable Infrastructure vs Immutable Infrastructure
- Procedural vs Declarative
- Client/Server Architecture vs Client-Only Architecture

I really liked this approach because I learned about how other technologies approach the IAC(Infrastructure As Code) problem in comparison with Terraform. Technologies such as Chef, Puppet, Ansible,etc., are now a clearer in how they work and where they might be the right solution.

## The Guide That I found After My Initial Post

The [second post](https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180) of the series is an i ntro guide to Terraform just like my previous post. Yet I learned new things while going through it. First new thing I learned, is to set up a new AWS user with limited power instead of using the root account that is created by default. This is described further in the [AWS IAM(Identity and Access Management) Best Practices guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html). I had to delete my root key as a security measure and then create a new user. See [Creating Your First IAM Admin User and Group](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html). Also, I learned how to name an AWS instance with a ‘tag’.

After creating an initial instance, the guide goes further by deploying a simple web server. First, we make use of an EC2’s User Data to run a simple script at launch that starts our server. Then we create a new resource, a security group, to allow our server to be reached from any IP through port 8080. After`$terraform apply` we can hit our web server with` $curl `http`://<EC2_INSTANCE_PUBLIC_IP>:8080`. The public IP address is set as an output in the tf file.

The guide goes on to create a cluster of web servers using an AWS Auto Scaling Group(ASG), which takes care of starting/restarting instances, monitoring health, and adjusting scale based on demand. We start by replacing the “aws_instance” with an “aws_launch_configuration”. This new resource configuration is similar to the aws_instance with the addition of the “lifecycle” block. Alas, we must add this new block to all resources on which the new resource depends on. In this case, we must add it to the aws_security_group. Then we add the ASG resource as “aws_autoscaling_group”. Finally, we use a data_source to fetch all the availability zones from AWS and use them within our ASG as availability_zones = [“${data.aws_availability_zones.all.names}”]. This new variable allows our EC2 instances to be deployed in different(isolated) data centers.

We need two more resources. First, since we have multiple instances running we need a load balancer to distribute the traffic to our instances. For this example, we use AWS very own load balancer, Elastic Load Balancer(ELB). As part of the configuration, we add a “listener” to tell the load balancer how to route incoming requests. In this case, we simply route port 80(HTTP) on the ELB to our instances’ port 8080(set in the variable server_port). The second resource is a new security group to enable traffic to the load balancer. The guide goes on to add “health_check” on the load balancer. This requires outbound traffic to be enabled as an ‘egress’ on the security group. Finally, we must register the instances with the ELB everytime a new instance is created. We do this by adding health_check_type = “ELB” to the ASG configuration. Finally, we add the ELB DNS as output to be able to test our deployment. Hit `$terraform plan` and if everything looks good `$terraform apply`. As the resources are being created can check the console for the resources. Once the instances are running we can `$curl `http`://<elb_dns_name>` and expect “Hello,  Word” back.

## Conclusion

I learned  more about Terraform and AWS with these two posts. I’m impressed by the way we could deploy a simple cluster with a few lines of code thanks to Terraform and AWS.  We even had health checks! Well, I’m wrapping up this post at 30,000(28,014)ft feet in the air on my way to Austin for Hashiconf. Hopefully, I’ll learn more about Terraform and the other solutions from Hashicorp as well as meeting some smart people. Catch you on the next one!

