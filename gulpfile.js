var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var gutil       = require('gulp-util');
var ftp         = require( 'vinyl-ftp' );

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('media/styles/screen.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/media/styles/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('media/styles'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('media/styles/*.scss', ['sass']);
    gulp.watch(['*.html', '**/*.html'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

gulp.task( 'deploy', function () {
    var conn = ftp.create( {
        host:     'web369.webfaction.com',
        user:     'chadspencer',
        password: 'Yibup10Aweop53Swouh5',
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        '_site/**'
    ];
    
    return gulp.src( globs, { base: './_site', buffer: false } )
        .pipe( conn.newer( '/home/chadspencer/webapps/chadspencer' ))
        .pipe( conn.dest( '/home/chadspencer/webapps/chadspencer' ));
} );
