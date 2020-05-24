# SAS Rap

## TL;DR

Run the code below in SASStudioV, and open the link in a browser, eg:  YOURSERVER/SASJobExecution?_program=/Public/app/viyatoken/clickme


```
filename sasjs url "https://sasjs.io/viyatoken.sas";
%inc sasjs;
```

If you don't have internet access from your browser, just copy paste the code directly from https://sasjs.io/viyatoken.sas. 

NOTE - this will only work if your JobExecution service is running under an admin identity that can access the CONSUL token (ie, yours).  If you have a pooled session, and this app works, then you have a security problem as your shared account has too much system access.


## What is this?

As SAS Application Developers, we are frequently needing to generate client tokens.  We also need an easy way for our customers to do the same.

So we built a SASjs app for it.

By default the app will be created in a `/Public/app/viyatoken` directory, if you'd like to change this, then modify the `appLoc` variable in the generated `viyadeploy.sas` program to a preferred location.

## Prerequisites

* NPM
* SASjs 

Once you have installed NPM, run `sasjs i -g sasjs-cli` to get the CLI tool

## Build Process

Clone the repo and `cd` into it.  Then run `sasjs cb viya`.  This will compile the assets from the `src` folder and build a deployment program under `sasjsbuild`.  Run this program in SAS (must be StudioV in Viya) to create the services.  The link will be at the bottom of the log.
