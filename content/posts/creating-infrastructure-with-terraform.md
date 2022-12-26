+++
author = "Crismar Mejia"
categories = ["AWS", "Infrastructure"]
date = 2017-09-03T20:15:56Z
description = "Creating Infrastructure with Terraform"
draft = false
slug = "creating-infrastructure-with-terraform"
tags = ["AWS", "Infrastructure"]
title = "Creating Infrastructure with Terraform"

+++

I’m attending HashiConf ‘17, an annual tech conference from HashiCorp. I came across HashiCorp sometime ago when I was playing around with Vagrant, a neat tool for creating and managing dev environments using virtual machines. I became aware of the conference thanks to Twitter and reached out to the organizers asking if there was any financial aid or scholarships. Lucky for me, I was offered a complimentary ticket to attend. So here I come HashiConf ‘17!

## Terraform

Since I’m attending the conference I want to become familiar with other HashiCorp products. I’m going to start with Terraform following the intro [guide](https://www.terraform.io/intro/index.html) on Terraform.io. According to the guide, Terraform is a tool for building, changing, and versioning infrastructure safely and efficiently. It can manage popular services providers as well as custom solutions.

### Install & Build

First, we need to install terraform. The guide provides a link to the binaries but I decided to install it using [Homebrew](https://brew.sh/).

`$brew install terraform`  
`$terraform version #verify it was installed properly`

After the installation, we start to [build basic infrastructure](https://www.terraform.io/intro/getting-started/build.html) on AWS. First, we create a Terraform configuration file(.tf) and copy and paste our access keys for now. We can figure out the keys on [AWS’s IAM console](https://console.aws.amazon.com/iam/home?#security_credential). I created a pair easily by clicking on “Create new access key”. Then, we do $terraform init which basically is the “mise en place” or the initial configuration to start building the infrastructure. We can see how Terraform plans to create(or modify) the infrastructure with: `$terraform plan`. If we get no errors back we can go ahead and proceed with apply: `$terraform apply`. Which creates the instance. We can then do `$terraform show` to check the state. The guide asks that we check the console to confirm the instance was created. However, this was not the case for me! I tried looking for any report of this error online but found nothing. Similarly, I couldn’t find the ami “ami-2757f631”, my guess is that the instance is not provided by Amazon anymore. The fine print in the guide states that:

**Note**: The above configuration is designed to work on most EC2 accounts, with access to a default VPC. For EC2 Classic users, please use t1.micro for instance_type, and ami-408c7f28for the ami. If you use a region other than us-east-1 then you will need to choose an AMI in that region as AMI IDs are region specific.

Some new terms for me. [Amazon](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Introduction.html) defines VPC(Virtual Private Cloud) as a virtual network that resembles the network in a data center. Also, EC3 Classic only applies to accounts created before [2013-12-04](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-vpc.html). Since the next chapter in the guide is about deleting and modifying infrastructure, I’m going to keep going to see if changing the ami solves the issue.

### Change the Infrastructure

The guide wants us to modify the ami and see how Terraform handles the change. It asks to change to ami-b374d5a5. However, after looking for this ami I cannot find any reference on the ami section of the EC2 dashboard. I’m going to change it to ami-da786da3 which is Suse Enterprise 12. I chose this image from the ‘launch instance’ menu. I did` $terraform apply` and I got the following error:

Error applying plan:1 error(s) occurred:* aws_instance.example: 1 error(s) occurred:* aws_instance.example: Error launching source instance: InvalidAMIID.NotFound: The image id '[ami-da786da3]' does not exist        status code: 400, request id: ccf07eee-c5c9-4204-b308-0614e2915af8Terraform does not automatically rollback in the face of errors.Instead, your Terraform state file has been partially updated withany resources that successfully completed. Please address the errorabove and apply again to incrementally change your infrastructure.

Which points to the error being my fault. Terraform does correctly give an error message when a wrong image is used. Though in hindsight, I think it would be better to know in the plan stage not after the previous instance was destroyed. Now, I have two doubts: (1) What console am I supposed to find the instance? (2) Where are the appropriate images?

I’m going to change the ami to what the guide suggest: ami-b374d5a5.  Then $terraform plan & $terraform apply. No errors.

I found the issue! Turns out, I was in the wrong region on the console! I was looking at the west region, where the blog resides. The guide, however, is working in the East region. I’m going to try to modify the configuration with a Suse image from this region. AMI being ami-8fac8399.

aws_instance.example: Creation complete after 51s (ID: i-0a3da5f272e78ec90)Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

Success!

### Destroy

Next step on the guide is to destroy. We can see what’s going to be destroyed with $terraform plan -destroy. Then we can destroy with: $terraform destroy after which we get prompted to confirm we want to delete the resources.

### Resource Dependencies & Provision

In this section, we are introduced to configurations with multiple resources and dependencies between resources. We start by assigning an elastic IP to the EC2 instance by adding an “aws_ip” resource to the configuration. In this new resource we interpolate the instance ID using a reference:instance = “${aws_instance.example.id}” . When we do $terraform plan we can still see the value since its interpolated once the resource is created. After $terraform apply we notice an order in the creation of the resources, first the instance then the elastic IP. This is an implicit dependency, terraform takes care of this automatically. We can also create explicit dependencies with the “depends_on” parameter.

We run $terraform destroy and move onto the next part of the guide, Provision. Provisioners are introduced as a way to do some initial setup on instances, be it running scripts or a configuration management tool. As an example, we add a provisioner to the example instance which runs the command “echo ${aws_instance.example.public_ip} > ip_address.txt” when the instance is created. If the provisioning fails, the resource is marked as tainted and destroyed and recreated on the next execution plan. Finally, there are also destroy provisioners that are executed during the destroy phase.

### Input & Output Variables

In this section we’re introduced to variables as a way to make configurations shareable & version controlled. As an example, we create variables for the access keys as they are hardcoded at the moment. First we create a file(variables.tf) to declare our variables and replace these names in the configuration. Now when we $terraform plan we are asked for the values of these variables. We can assign  the values as command-line flags, set them in a separate file or set them in environment variables.  We can also create lists and maps. For the example we create a map with amis for each region. Finally, we can also create output variables which serve as a way to organize output data that can be queried by the user.

### Modules & Remote Backends

Since modules require non-free tier usage of AWS I’m going to skip the hands-on part of the tutorial. Modules are a way to make components reusable and help organize the workflow. To me, the most interesting part of the modules is the source field in the module declaration. In this example, we create a Consul cluster from a configuration that is saved as part of the GitHub project: `source = "github.com/hashicorp/consul/terraform/aws"`. Finally, remote backends are a way to handle terraform in production. As the guide says, remote backends are used to run terraform remotely and store a master Terraform state remotely.

## Conclusion

I learn a few important lessons from working through this tutorial:

- I got an overview of a cool way to manage all this infrastructure in a clever and organized way.
- Read and Understand the fine print in guides! Or anywhere for that matter
- I learned more about the features of AWS and to be aware of the regions.

Looking forward to the conference and learning about Terraform. Catch you on the next one!

