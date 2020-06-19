/**
  @file getgroups.sas
  @brief a wrapper macro purely to demonstrate app-specific macros in SASjs

  <h4> Dependencies </h4>
  @li mv_getgroups.sas

  @version 3.4
  @author Allan Bowe

**/

%macro getgroups(outds=);
  %mv_getgroups(outds=&outds)
%mend;

