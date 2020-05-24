/**
  @file gettoken.sas
  @brief returns token.  User must be admin.
  @details  Find and obtain app token

  <h4> Dependencies </h4>
  @li mv_getapptoken.sas

**/

%let client=client%sysfunc(ranuni(0),hex16.);
%let secret=secret%sysfunc(ranuni(0),hex16.);
%mv_getapptoken(client_id=&client,client_secret=&secret)

data work.clientinfo;
  client=symget('client');
  secret=symget('secret');
run;

%webout(OPEN)
%webout(OBJ,clientinfo)
%webout(CLOSE)

