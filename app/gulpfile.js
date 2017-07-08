var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('build-scss', function()
{
    try
    {
        return gulp.src( 'scss/style.scss' )
            .pipe( sass() )
            .pipe( gulp.dest( 'css/' ) );
    }
    catch ( error )
    {
      return error;
    }
    return "Failed to compile";
});

// Watch for file updates
gulp.task('watch', function()
{
    gulp.watch( 'scss/**/*.scss', ['build-scss'] );
});

gulp.task( 'default', ['build-scss', 'watch'] );
