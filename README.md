[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/sasjs/viyatoken)

# Viya Token Generator

## TL;DR

Run the code below in SASStudioV, and open the link from the log in a browser, eg:  YOURSERVER/SASJobExecution?_program=/Public/app/viyatoken/clickme


```
filename vt url "https://raw.githubusercontent.com/sasjs/viyatoken/master/runme.sas";
%inc vt;
```

If you don't have internet access from your SAS Compute instance, just copy paste the code directly into SASStudioV from https://raw.githubusercontent.com/sasjs/viyatoken/master/runme.sas.

NOTE - this will only work if your JobExecution service is running under an admin identity that can access the CONSUL token (ie, **yours**).  If you have a pooled session, and this app works, then you have a security problem as your shared account has too much system access.


## What is this?

As SAS Application Developers, we are frequently needing to generate client tokens.  We also need an easy way for our customers to do the same.

So we built a SASjs app for it.

By default the app will be created in a `/Public/app/viyatoken` directory, if you'd like to change this, then modify the `appLoc` variable in the generated `viyadeploy.sas` program to a preferred location.

## Prerequisites

* NPM
* SASjs

Once you have installed NPM, run `sasjs i -g @sasjs/cli` to get the CLI tool

## Build Process

Clone the repo and `cd` into it (or, just click the gitpod link above).  Then run `sasjs cb viya`.  This will compile the assets from the `src` folder and build a deployment program under `sasjsbuild`.  Run this program in SAS (must be StudioV in Viya) to create the services.  The link will be at the bottom of the log.
