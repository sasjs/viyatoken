/**
  @file appinit.sas
  @brief provides the list of viya groups and other startup info
  @details 

  <h4> Dependencies </h4>
  @li mv_getgroups.sas

  @version 3.4
  @author Allan Bowe

**/


%mv_getgroups(outds=groups)

%webout(OPEN)
%webout(OBJ,groups)
%webout(CLOSE)
