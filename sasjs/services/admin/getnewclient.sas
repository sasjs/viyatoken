/**

  @file getnewclient.sas
  @brief returns token.  User must be admin.
  @details  Find and obtain app token

  <h4> Dependencies </h4>
  @li mv_registerclient.sas

**/

%webout(FETCH)

data _null_;
  set clientsettings;
  call symputx('client_name',name);
  call symputx('authorized_grant_types',authorized_grant_types);
  call symputx('scope',scope);
  call symputx('access_token_validity',access_token_validity);
  call symputx('refresh_token_validity',refresh_token_validity);
  call symputx('required_user_groups',required_user_groups);
  call symputx('autoapprove',autoapprove);
  call symputx('use_session',use_session);
run;

%mv_registerclient(
   client_id=client%sysfunc(ranuni(0),hex16.)
  ,client_secret=secret%sysfunc(ranuni(0),hex16.)
  ,client_name=&client_name
  ,scopes=&scope
  ,grant_type=&authorized_grant_types
  ,required_user_groups=&required_user_groups
  ,autoapprove=&autoapprove
  ,use_session=&use_session
  ,access_token_validity=%sysfunc(coalescec(&access_token_validity,DEFAULT))
  ,refresh_token_validity=%sysfunc(coalescec(&refresh_token_validity,DEFAULT))
  ,outds=clientinfo
  ,outjson=inputjson
)

%webout(OPEN)
%webout(OBJ,clientinfo)
%webout(OBJ,inputjson)
%webout(CLOSE)

