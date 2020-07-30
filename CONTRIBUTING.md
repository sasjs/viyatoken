# SAS Rap

## TL;DR
Run the code below in SASStudioV, and open the link in a browser, eg:  YOURSERVER/SASJobExecution?_program=/Public/app/viyatoken/clickme


```
filename sasjs url "https://sasjs.io/viyatoken.sas";
%inc sasjs;
```

## What is this?

As SAS Application Developers, we are frequently needing to generate client tokens.  We also need an easy way for our customers to do the same.

So we built a SASjs app for it.

## Prerequisites

* NPM
* SASjs 

Once you have installed NPM, run `sasjs i -g @sasjs/cli` to get the CLI tool

## Build Process

Clone the repo and `cd` into it.  Then run `sasjs cb viya`.  This will compile the assets from the `src` folder and build a deployment program under `sasjsbuild`.  Run this program in SAS (must be StudioV in Viya) to create the services.  The link will be at the bottom of the log.
