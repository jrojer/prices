const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
 
gulp.task('default', () =>
    gulp.src('templates/index.html')
        .pipe(nunjucks.compile({static: "/static"}))
        .pipe(gulp.dest('../static'))
);
