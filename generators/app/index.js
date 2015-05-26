'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var github = require('./github');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appName', { type: String, required: false });
    this.appName = this.appName || path.basename(process.cwd());
  },
  
  prompting: function () {
    var done = this.async();
    
    this.log(yosay(
      'Welcome to the spectacular ' + chalk.red('Boombox') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'username',
        message: 'What\'s the username of your GitHub account?',
        default: 'someuser'
      },
      {
        type: 'input',
        name: 'appNamespace',
        message: 'What\'s the namespace of your application?',
        default: this.appName,
      },
      {
        type: 'input',
        name: 'description',
        message: 'What\'s the short description of this project?',
        default: 'Awesome app',
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },
  
  configuring: {
    appInfo: function() {
      this.props.appName = this.appName;
    },
    
    userInfo: function () {
      var done = this.async();
      
      github(this.props.username, function (user) {
        this.props.user = user;
        done();
  	  }.bind(this), this.log);
    }
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath('README.md'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('_LICENSE'),
        this.destinationPath('LICENSE'),
        this.props
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('jscsrc'),
        this.destinationPath('.jscsrc')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('travis.yml'),
        this.destinationPath('.travis.yml')
      );
      this.fs.copy(
        this.templatePath('src'),
        this.destinationPath('src')
      );
      this.fs.copy(
        this.templatePath('test'),
        this.destinationPath('test')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
