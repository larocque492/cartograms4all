/**
 * Created by timotongo on 6/14/17.
 */



    d3.cartogram = function() {

        function carto(topology,geometries) {

            topology = copy(topology);

            //length of map in x and y directions
            var LX=800, LY=500;

            //array for densities
            var rho0=Create2DArray(LX+1,LY+1), rho=Create2DArray(LX+1,LY+1);

            //array for velocity field at integer-valued pos
            var gridvx=Create2DArray(LX+1,LY+1), gridvy=Create2DArray(LX+1,LY+1);

            //arrays for position at t>0
            var x=Create2DArray(LX+1,LY+1), y=Create2DArray(LX+1,LY+1);

            //arrays for velocity field at position
            var vx=Create2DArray(LX+1,LY+1), vy=Create2DArray(LX+1,LY+1);

            //misc functions
            function Create2DArray(rows,col){
                var iMax = rows;
                var jMax = col;
                var f = new Array();

                for (i=0;i<iMax;i++) {
                    f[i]=new Array();
                    for (j=0;j<jMax;j++) {
                        f[i][j]=0;
                    }
                }
                return f
            }
        }
    }
