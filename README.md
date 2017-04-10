# Jekyll Site Template

This Jekyll development setup uses Grunt for task management. [Browsersync](https://github.com/BrowserSync/grunt-browser-sync) is used to create the site preview during local development instead of `jekyll serve`.

In a default Jekyll setup, Sass/SCSS files are built along with HTML files during the `jekyll build` task. In this setup, I use [grunt-sass](https://github.com/sindresorhus/grunt-sass) to build CSS files so the grunt watch task can generate new CSS and HTML files independently from one another.

I use the zen sorting method to organize my stylesheets. The JSON file used by Grunt that I've included in this setup is borrowed from the [PostCSS Sorting predefined configs](https://gist.github.com/hudochenkov/b7127590d3013a5982ed90ad63a85306#file-zen-json).

## Instructions

For local development, run `grunt ws` in terminal run an initial build, begin browserSync and start the watch task. Run `grunt buildDev` to build the site for local development without running Browsersync or watch. Use `grunt build` or just `grunt` to generate production-ready files.

---

This template is a work in progress. I will be updating it as my development process evolves.
