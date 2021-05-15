/**
  @file
  @brief Test initialisation

**/
data _null_;
  length _pgm $1000;
  _pgm=symget('_program');
    cnt=find(_pgm,'/tests/');
    if cnt=0 then cnt=find(_pgm,'/services/');
    if cnt=0 then cnt=find(_pgm,'/jobs/');
    put cnt=;
    apploc=substr(_pgm,1,cnt-1);
    call symputx('apploc',apploc);
run;