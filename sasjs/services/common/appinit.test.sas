/**
  @file
  @brief testing appinit service
  @details tests to ensure at least 5 group membershps are returned

  <h4> SAS Macros </h4>
  @li mp_testservice.sas
  @li mp_assertdsobs.sas


  @version 3.4
  @author Allan Bowe

**/

%let _program=&appLoc/services/common/appinit;

%mp_testservice(&_program,
  outlib=webout
)

data work.groups;
  set webout.groups;
run;

%mp_assertdsobs(work.groups,
  desc=Test to ensure at least 5 groups are returned in appinit,
  test=ATLEAST 5,
  outds=work.test_results
)

%webout(OPEN)
%webout(OBJ,test_results)
%webout(CLOSE)
