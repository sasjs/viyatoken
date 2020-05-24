/**
  @file getrefreshtoken.sas
  @brief Get refresh token using authorization code.
  @details  Find and obtain app token

  <h4> Dependencies </h4>
  @li mv_getrefreshtoken.sas

**/

%webout(FETCH)

data _null_;
  set work.fromjs;
  call symputx('client',client);
  call symputx('secret',secret);
  call symputx('authcode',authcode);
run;

%mv_getrefreshtoken(client_id=&client,client_secret=&secret,code=&authcode)


data work.tokeninfo;
  set work.fromjs;
  drop authcode;
  access_token="&access_token";
  refresh_token="&refresh_token";
run;

%webout(OPEN)
%webout(OBJ,tokeninfo)
%webout(CLOSE)