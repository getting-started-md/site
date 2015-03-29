---
id: 2
title: Ruby & Sinatra
date: 2015-03-23 18:18:57 -0500
image: /static/images/sinatra.png
repo: https://github.com/getting-started-md/ruby-sinatra
summary: Sinatra is a super light weight, rack based microframework for ruby. Sinatra is a great place to start when learning ruby.
---

## Background

Sinatra is a lightweight web framework for Ruby.

Sinatra makes a great starting point for any new Ruby developer. Sinatra walks you though gems, rack applications, and routes.

Sinatra is ideal for creating APIs and small applications.

## Installing Ruby

This guide will focus on OSX.

OSX 10.10 ships with Ruby 2.0.0p481

This guide will just use the built in ruby.

If you want to install a different ruby use RVM.

Instructions to install RVM can be found here [https://rvm.io/](https://rvm.io/)


## Installing RubyGems

RubyGems is ruby's package manager. Most modern ruby installs ship with RubyGems installed. However if the `gem` command is not available, you can install it by downloading the tgz from [https://rubygems.org/pages/download](https://rubygems.org/pages/download)

## Install Bundler

Bundler is a project dependecy manager for ruby. Install it using the `gem` command to keep project dependencies and versions in sync.

```bash
$ sudo gem install bundler
```


## Setup the project


Create a folder for your new sinatra project and enter it.

```bash
$ mkdir sinatra-demo
$ cd sinatra-demo
```

## Sinatra


Create a Gemfile to manage project dependencies 

**Gemfile**

```ruby
gem 'sinatra'
```

Install project dependencies (sinatra), by running `bundle install`

## A simple application


Create an application file

**app.rb**

```ruby
require 'rubygems'
require 'bundler'
Bundler.require

get '/' do
  'Hello world!'
end
```

The first 3 lines load rubygems and bundler.

`Bundler.require` will auto-load the dependencies you specified in Gemfile.

From here we have loaded sinatra and can use the routing DSL to start defining the routes of our project.

## Templates and Views

In most web applications where you want to return a view, you will want to use a proper templating engine. The default template in ruby is erb. We can play with erb easily by changing our index route as follows.

```ruby
get '/' do
  message = "Hello World"
  erb :index, {locals: {message: message}}
end
```

In this example a file named **index.erb** under the **views/** directory will be used to generate the index view of our app.

```html
<h1> 
  <%= message %> 
</h1>
```

This will render the value of message inside if an h1 tag.


## Run it!

The server can be started with

`ruby app.rb`

Now just open your web browser to

`http://127.0.0.1:4567`
