
var MODULE = (function () {
  "use strict";
  var that = {},
    t = 0, T = 1, f = 60,
    ivl, iFn, lastFrame;
  /**sets default functin and order */

  var order=1, fn="exp", oldfn="exp", p=1;
  var c1=1, c2=0, c3=0; // current c0 etc.
  var o1=1, o2=0, o3=0; // old c0 etc.
  var t1=1, t2=0, t3=0; // target c0 etc.
  var X0 = [0,0], dX = [0,0],X1 = [0,0],dX1 = [0,0], z00=0.45, z0 = 0.1, z1 = -0.1, z11=0.45; //z0= position of pink marker on x axis
  var el = that.el = {};
  var fnOnChange, ordOnChange;
  var xScale, yScale;

  var fns = {

    "exp" : function (z) {
      return (3*Math.exp(6*(z-0.4))-1);
    },
    "cubic" : function (z) {
      return (6*z**3);
    },
    "polyorder4" : function (z) {
      return (13*z**4-6*z**2);
    },
    "square" : function (z) {

      if(z<0.4 && z>0){
        return 1;
      }
      if(z<1 && z>0.8){
        return 1;
      }
      if(z<-0.4 && z>-0.8){
        return 1;
      }
      else{
        return -1;
      }

    }

  }


 const integrate_exp = function(a, b) {
  return((a - 0.045359*Math.exp(6*a)+0.045359*Math.exp(6*b)-b)/(0.5*(b-a)))

 }

 const integrate_exp_sin = function(a, b, c) {
  return(( 2*((0.272154 *(Math.exp(6* b)* ((-0.166667 *a**22 + 0.333333 *a* b - 0.166667 *b**2)* Math.sin((6.28319* b *c)/(a - b)) + c* (0.174533* a - 0.174533 *b) *Math.cos((6.28319* b *c)/(a - b))) - Math.exp(6* a)* ((-0.166667* a**2 + 0.333333* a* b - 0.166667 *b**2) *Math.sin((6.28319 *a *c)/(a - b)) + c* (0.174533* a - 0.174533 *b)* Math.cos((6.28319* a* c)/(a - b)))))/(a**2 - 2* a* b + b**2 + 1.09662* c**2) + ((0.159155 *a - 0.159155 *b) *Math.cos((6.28319 *a *c)/(a - b)) + (0.159155* b - 0.159155* a) *Math.cos((6.28319* b *c)/(a - b)))/c))/(b - a))

 }

 const integrate_exp_cos = function(a, b, c) {
  return((2*((Math.exp(6* a)* (-0.045359 *a**2 + 0.090718* a* b - 0.045359 *b**2) *Math.cos((6.28319 *a* c)/(a - b)) + Math.exp(6* b) *(0.045359 *a**2 - 0.090718* a *b + 0.045359* b**2) *Math.cos((6.28319 *b *c)/(a - b)) + Math.exp(6* a) *c* (0.0474998 *b - 0.0474998 *a)*Math.sin((6.28319 *a *c)/(a - b)) + Math.exp(6 *b)* c *(0.0474998 *a - 0.0474998 *b)*Math.sin((6.28319 *b* c)/(a - b)))/(a**2 - 2 *a* b + b**2 + 1.09662*c**2) + ((0.159155* a - 0.159155* b) *Math.sin((6.28319 *a *c)/(a - b)) + (0.159155* b - 0.159155* a) *Math.sin((6.28319 *b *c)/(a - b)))/c))/(b - a))

 }

 const integrate_cubic = function(a, b) {
  return((12 *((b**4)/4 - (a**4)/4))/(b - a))

 }

 const integrate_cubic_sin = function(a, b, c) {
  return((12 *(a - b) *(0.0759909* (a - b)* (a**2 *(c**2 - 0.0506606) + 0.101321* a* b - 0.0506606* b**2)*Math.sin((6.28319 *a *c)/(a - b)) + 0.00384974* (a - b) *(a**2 - 2* a* b + b**2* (1 - 19.7392 *c**2)) *Math.sin((6.28319 *b *c)/(a - b)) - 0.159155 *a* c* (a**2* (c**2 - 0.151982) + 0.303964* a* b - 0.151982 *b**2) *Math.cos((6.28319 *a* c)/(a - b)) + b* c* (-0.0241887* a**2 + 0.0483773* a *b + b**2* (0.159155* c**2 - 0.0241887)) *Math.cos((6.28319 *b *c)/(a - b))))/(c**4* (b - a)))

 }

 const integrate_cubic_cos = function(a, b, c) {
  return((12* (a - b)* (-0.159155* a* c* (a**2* (c**2 - 0.151982) + 0.303964* a* b - 0.151982* b**2) *Math.sin((6.28319* a* c)/(a - b)) + b *c *(-0.0241887* a**2 + 0.0483773* a* b + b**2* (0.159155 *c**2 - 0.0241887)) *Math.sin((6.28319 *b *c)/(a - b)) - 0.0759909* (a - b)* (a**2 *(c**2 - 0.0506606) + 0.101321 *a *b - 0.0506606* b**2) *Math.cos((6.28319 *a *c)/(a - b)) - 0.00384974* (a - b) *(a**2 - 2* a* b + b**2 *(1 - 19.7392* c**2)) *Math.cos((6.28319 *b* c)/(a - b))))/(c**4* (b - a)))

 }

 const integrate_polyorder4 = function(a, b) {
  return((2* (13* ((b**5)/5 - a**5/5) - 6* ((b**3)/3 - (a**3)/3)))/(b - a));
 }

 const integrate_polyorder4_cos = function(a, b, c) {
  return((2 *((13* (-0.101321* a* c* (a**3* b *(0.607927 - 2* c**2) + a**4* (c**2 - 0.151982) + a**2 *b**2* (c**2 - 0.911891) + 0.607927* a *b**3 - 0.151982* b**4) *Math.cos((6.28319 *a* c)/(a - b)) + b* c *(a* b**3 *(0.0615959 - 0.202642* c**2) - 0.015399* a**4 + 0.0615959* a**3* b + a**2* b**2 *(0.101321* c**2 - 0.0923938) + b**4 *(0.101321* c**2 - 0.015399)) *Math.cos((6.28319 *b* c)/(a - b)) - 0.159155* (a**3* b**2* (0.15399 - 0.911891* c**2) + a**5 *(c**4 - 0.303964* c**2 + 0.015399) + a**4* b* (-1*c**4 + 0.911891* c**2 - 0.0769949) + a**2* b**3* (0.303964 *c**2 - 0.15399) + 0.0769949* a* b**4 - 0.015399* b**5)*Math.sin((6.28319 *a* c)/(a - b)) + (a**3* b**2* (0.0245082 - 0.0483773* c**2) + 0.00245082 *a**5 - 0.0122541* a**4 *b + a**2 *b**3 *(0.145132 *c**2 - 0.0245082) + a* b**4* (0.159155* c**4 - 0.145132 *c**2 + 0.0122541) + b**5* (-0.159155* c**4 + 0.0483773 *c**2 - 0.00245082))*Math.sin((6.28319* b* c)/(a - b))))/c**5 - (6 *(a - b)* (-0.159155* (a**2 *(c**2 - 0.0506606) + 0.101321* a* b - 0.0506606 *b**2) *Math.sin((6.28319 *a *c)/(a - b)) + (-0.00806288* a**2 + 0.0161258* a* b + b**2* (0.159155 *c**2 - 0.00806288))*Math.sin((6.28319* b* c)/(a - b)) - 0.0506606* a *c *(a - b) *Math.cos((6.28319* a *c)/(a - b)) + b *c *(0.0506606 *a - 0.0506606 *b) *Math.cos((6.28319* b *c)/(a - b))))/c**3))/(b - a))

 }

 const integrate_square_sin = function(a,b,c){

  return((2* (((0.159155 *a - 0.159155* b)*Math.cos((6.28319 *a* c)/(a - b)) - 0.159155* a + 0.159155 *b)/c + ((0.159155 *a - 0.159155* b) *Math.cos((6.28319 *b* c)/(a - b)) - 0.159155* a + 0.159155 *b)/c))/(b - a));
 }




 const integrate_square_2 = function(a,b,c){
  return((2 *((2 *((0.159155* a - 0.159155* b)*Math.cos((2.51327 *c)/(a - b)) - 0.159155 *a + 0.159155* b))/c + ((0.159155* a - 0.159155 *b)*Math.cos((2.51327* c)/(a - b)) + (0.159155* b - 0.159155* a)*Math.cos((6.28319 *a *c)/(a - b)))/c + ((0.159155 *a - 0.159155 *b)*Math.cos((2.51327* c)/(a - b)) + (0.159155* b - 0.159155 *a)* Math.cos((6.28319* b* c)/(a - b)))/c))/(b - a));
 }

 const integrate_square_3 = function(a,b,c){
  return((2 *((2 *((0.159155* a - 0.159155 *b) *Math.cos((2.51327* c)/(a - b)) - 0.159155 *a + 0.159155* b))/c + (2 *((0.159155* a - 0.159155* b)* Math.cos((2.51327 *c)/(a - b)) + (0.159155 *b - 0.159155* a)* Math.cos((5.02655 *c)/(a - b))))/c + ((0.159155 *b - 0.159155* a) *Math.cos((5.02655* c)/(a - b)) + (0.159155 *a - 0.159155* b)*Math.cos((6.28319* a* c)/(a - b)))/c + ((0.159155* b - 0.159155* a)* Math.cos((5.02655 *c)/(a - b)) + (0.159155 *a - 0.159155 *b) *Math.cos((6.28319 *b *c)/(a - b)))/c))/(b - a));
 }







  var order1 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b)/2) + (integrate_exp_cos(a,b,1) *Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a)))));
    },

    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a)))));
      }
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a)))));
      }
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a)))));
      }
    }}



  var order2 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a)))));
        }
      }

  }

  var order3 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a)))));
        }
      }


  }

  var order4 = {

    "exp" : function (z,a,b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a)))));
          }
      }


  }
  var order5 = {

    "exp" : function (z,a,b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a)))));
            }
        }


  }

  var order6 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a)))));
              }
          }

  }

  var order7 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,7)*Math.cos(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,7)*Math.sin(7*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,7)* Math.sin(7*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a)))));
                }
            }



  }
  var order8 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,7)*Math.cos(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,7)*Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,8)*Math.cos(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,8)*Math.sin(8*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,7)* Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,8)* Math.sin(8*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a)))));
              }
        }


  }

  var order9 = {

    "exp" : function (z,a,b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,7)*Math.cos(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,7)*Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,8)*Math.cos(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,8)*Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,9)*Math.cos(9*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,9)*Math.sin(9*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,7)* Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,8)* Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,9)* Math.sin(9*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a)))));
            }
      }
  }

  var order10 = {

    "exp" : function (z, a, b) {
      return ((integrate_exp(a, b, 1)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,7)*Math.cos(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,7)*Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,8)*Math.cos(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,8)*Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,9)*Math.cos(9*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,9)*Math.sin(9*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a, b,10)*Math.cos(10*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,10)*Math.sin(10*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,7)* Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,8)* Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,9)* Math.sin(9*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,10)*Math.cos((10*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,10)* Math.sin(10*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,10)*Math.cos((10*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a)))));
              }
        }



  }

  var order20 = {

    "exp" : function (z, a,b) {
      return ((integrate_exp(a, b)/2) + (integrate_exp_cos(a,b,1) *Math.cos(z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 1) * Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,2)*Math.cos(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a, b, 2)*Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,3)*Math.cos(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,3)*Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,4)*Math.cos(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,4)*Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,5)*Math.cos(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,5)*Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,6)*Math.cos(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,6)*Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,7)*Math.cos(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,7)*Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,8)*Math.cos(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,8)*Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,9)*Math.cos(9*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,9)*Math.sin(9*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a, b,10)*Math.cos(10*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,10)*Math.sin(10*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,11)*Math.cos(11*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,11)*Math.sin(11*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,12)*Math.cos(12*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,12)*Math.sin(12*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,13)*Math.cos(13*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,13)*Math.sin(13*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,14)*Math.cos(14*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,14)*Math.sin(14*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,15)*Math.cos(15*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,15)*Math.sin(15*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,16)*Math.cos(16*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,16)*Math.sin(16*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,17)*Math.cos(17*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,17)*Math.sin(17*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,18)*Math.cos(18*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,18)*Math.sin(18*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,19)*Math.cos(19*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,19)*Math.sin(19*z*Math.PI/(0.5*(b-a))))+(integrate_exp_cos(a,b,20)*Math.cos(20*z*Math.PI/(0.5*(b-a))))+(integrate_exp_sin(a,b,20)*Math.sin(20*z*Math.PI/(0.5*(b-a)))));
    },
    "cubic" : function (z,a,b) {
      return ((integrate_cubic(a,b)/2)+(integrate_cubic_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,1)* Math.sin(z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,2)* Math.sin(2*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,3)* Math.sin(3*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,4)* Math.sin(4*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,5)* Math.sin(5*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,6)* Math.sin(6*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,7)* Math.sin(7*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,8)* Math.sin(8*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,9)* Math.sin(9*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,10)*Math.cos((10*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,10)* Math.sin(10*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,11)*Math.cos((11*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,11)* Math.sin(11*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,12)*Math.cos((12*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,12)* Math.sin(12*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,13)*Math.cos((13*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,13)* Math.sin(13*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,14)*Math.cos((14*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,14)* Math.sin(14*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,15)*Math.cos((15*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,15)* Math.sin(15*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,16)*Math.cos((16*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,16)* Math.sin(16*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,17)*Math.cos((17*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,17)* Math.sin(17*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,18)*Math.cos((18*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,18)* Math.sin(18*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,19)*Math.cos((19*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,19)* Math.sin(19*z*Math.PI/(0.5*(b-a))))+(integrate_cubic_cos(a,b,20)*Math.cos((20*z*Math.PI)/(0.5*(b-a))))+(integrate_cubic_sin(a,b,20)* Math.sin(20*z*Math.PI/(0.5*(b-a)))));
    },
    "polyorder4" : function (z,a,b) {
      return ((integrate_polyorder4(a,b)/2)+(integrate_polyorder4_cos(a,b,1)*Math.cos((z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,2)*Math.cos((2*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,3)*Math.cos((3*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,4)*Math.cos((4*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,5)*Math.cos((5*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,6)*Math.cos((6*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,7)*Math.cos((7*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,8)*Math.cos((8*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,9)*Math.cos((9*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,10)*Math.cos((10*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,11)*Math.cos((11*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,12)*Math.cos((12*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,13)*Math.cos((13*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,14)*Math.cos((14*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,15)*Math.cos((15*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,16)*Math.cos((16*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,17)*Math.cos((17*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,18)*Math.cos((18*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,19)*Math.cos((19*z*Math.PI)/(0.5*(b-a))))+(integrate_polyorder4_cos(a,b,20)*Math.cos((20*z*Math.PI)/(0.5*(b-a)))));
    },
    "square" : function (z,a,b) {
      if(b<0.4){
        return ((integrate_square_sin(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,11)*Math.sin((11*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,12)*Math.sin((12*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,13)*Math.sin((13*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,14)*Math.sin((14*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,15)*Math.sin((15*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,16)*Math.sin((16*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,17)*Math.sin((17*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,18)*Math.sin((18*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,19)*Math.sin((19*z*Math.PI)/(0.5*(b-a))))+(integrate_square_sin(a,b,20)*Math.sin((20*z*Math.PI)/(0.5*(b-a)))));}
      if(b>0.4 && b<0.8){
        return ((integrate_square_2(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,11)*Math.sin((11*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,12)*Math.sin((12*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,13)*Math.sin((13*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,14)*Math.sin((14*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,15)*Math.sin((15*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,16)*Math.sin((16*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,17)*Math.sin((17*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,18)*Math.sin((18*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,19)*Math.sin((19*z*Math.PI)/(0.5*(b-a))))+(integrate_square_2(a,b,20)*Math.sin((20*z*Math.PI)/(0.5*(b-a)))))}
      if(b>0.8){
        return ((integrate_square_3(a,b,1)*Math.sin((z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,2)*Math.sin((2*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,3)*Math.sin((3*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,4)*Math.sin((4*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,5)*Math.sin((5*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,6)*Math.sin((6*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,7)*Math.sin((7*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,8)*Math.sin((8*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,9)*Math.sin((9*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,10)*Math.sin((10*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,11)*Math.sin((11*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,12)*Math.sin((12*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,13)*Math.sin((13*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,14)*Math.sin((14*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,15)*Math.sin((15*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,16)*Math.sin((16*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,17)*Math.sin((17*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,18)*Math.sin((18*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,19)*Math.sin((19*z*Math.PI)/(0.5*(b-a))))+(integrate_square_3(a,b,20)*Math.sin((20*z*Math.PI)/(0.5*(b-a)))));
                }
          }

  }




  fnOnChange = function () {
    oldfn = fn;
    el["order"].value = 1;
    fn = el["function"].value;
    clearInterval(ivl);
    lastFrame = +new Date;
    t=0;
    ivl = setInterval(iFn, 1000/f);
  };

  ordOnChange = function () {
    o1 = c1;
    o2 = c2;
    o3 = c3;
    switch (+el["order"].value) {
      case 0:
        t1 = 0; t2 = 0; t3 = 0;
        break;
      case 1:
        t1 = 1; t2 = 0; t3 = 0;
        break;
      case 2:
        t1 = 1; t2 = 1; t3 = 0;
        break;
      case 3:
        t1 = 1; t2 = 1; t3 = 1;
        break;
    }
    clearInterval(ivl);
    lastFrame = +new Date;
    t=0;
    ivl = setInterval(iFn, 1000/f);
  };

  iFn = function () {
    var now, x;
    now = +new Date;
    t += (now - lastFrame)/1000;
    lastFrame = now;
    if (t > T) {
      clearInterval(ivl);
      o1 = c1 = t1;
      o2 = c2 = t2;
      o3 = c3 = t3;
      p = 1;
      oldfn = fn;
      that.redraw();
      return;
    }
    x = (1 - Math.cos(Math.PI * t / T)) / 2;
    c1 = o1 + (t1 - o1) * x;
    c2 = o2 + (t2 - o2) * x;
    c3 = o3 + (t3 - o3) * x;
    p = x;
    that.redraw();
  };

  that.redraw = function () {
    var x0 = 311.123832, y0 = 497.57214; // Page Coordinates of graph line
    var fxStr = "", gxStr = "";
    var f, g, inRange;
    for (var i = 0; i < 512  ; i += 1) {
      f = p*fns[fn](i/512) + (1-p)*fns[oldfn](i/512) || 0
      inRange = true;
      f = Math.min(Math.max(f, -4), 4)
      fxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512) + "," + (y0 + yScale * f)
      
      if(+el["order"].value=== 1){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order1[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 2){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order2[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 3){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order3[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 4){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order4[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 5){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order5[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 6){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order6[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 7){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order7[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 8){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order8[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 9){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order9[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 10){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order10[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 20){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order20[fn](i/512, -z0, z0))}
    }
    for (var i = 0; i > -512; i -= 1) {
      f = p*fns[fn](i/512) + (1-p)*fns[oldfn](i/512) || 0
      inRange = Math.abs(f) < 4;
      f = Math.min(Math.max(f, -4), 4)
      g = p *(fns[fn](f)  + (i/512 - f))
      g += (1-p) *(fns[oldfn](f)  + (i/512 - f))
      fxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512) + "," + (y0 + yScale * f)
      
      if(+el["order"].value=== 1){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order1[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 2){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order2[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 3){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order3[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 4){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order4[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 5){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order5[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 6){
        gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order6[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 7){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order7[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 8){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order8[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 9){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order9[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 10){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order10[fn](i/512, -z0, z0))}
      if(+el["order"].value=== 20){
          gxStr += ((i && inRange)?" L ":" M ") + (x0 + xScale*i/512)+ "," +( y0+ yScale* order20[fn](i/512, -z0, z0))}
    }
    el["fx"].setAttribute("d", fxStr);
    el["gx"].setAttribute("d", gxStr);
    el["interval1"].setAttribute("d", "M " + (x0+xScale*z0) + "," + (y0-190) + " L " + (x0+xScale*z0) + "," + (y0-yScale*3));
    el["interval2"].setAttribute("d", "M " + (x0-xScale*z0) + "," + (y0-190) + " L " + (x0-xScale*z0) + "," + (y0-yScale*3));
    el["intervalmark"].setAttribute("d", "M " + (x0+xScale*z0) + "," + (y0-190) + " L " + (x0+xScale*z0) + "," + (y0-yScale*3));
    
  };


  that.init = function () {
    ["root", "layer1", "initText", "graph", "function", "order", "xAxis", "yAxis", "fx", "gx", "interval1", "interval2", "intervalmark"].map(
        function (id) {
          el[id] = document.getElementById(id);
        });
  
      el["function"].onchange = fnOnChange;
      el["order"].oninput = ordOnChange;
      document.getElementById("order20").onclick = function(){
        el["order"].value = 20;
        ordOnChange();
      }
  
      xScale = el["xAxis"].getBBox().width/2;
      yScale = -el["yAxis"].getBBox().height / 2 / 3;
  
      X0 = [el["interval1"].getBBox().x+257, el["interval1"].getBBox().y];
  
      var mousePressed = false
      document.body.onmousemove = function (e) {
        if (!mousePressed) {
          el["interval1"].style.cursor = "pointer";
          return e.preventDefault();
        }
        el["interval1"].style.cursor = "grabbing";
        dX = [e.clientX - X0[0], e.clientY - X0[1]]
        z0 = Math.min(Math.max(z00 + dX[0]/xScale, 0), 1);
        that.redraw();
        return e.preventDefault();
      };
  
      el["interval1"].onmousedown = function (e) {
        mousePressed = true;
        return el["interval1"].onmousemove(e);
      };
  
      document.body.onmouseup = function (e) {
        mousePressed = false;
        return e.preventDefault();
      };
  
      el["interval1"].ondragstart = function (e) { return e.preventDefault(); };
  
      el["order"].value = order;
      el["function"].value = fn;
      that.redraw()
  
      document.body.onclick = null;
      el["layer1"].style.filter = null;
      el["initText"].style.display = "none";
    };
  
    return that;
  }());