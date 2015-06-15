---
id: 5
title: Elixir & Phoenix
date: 2015-06-15 18:18:57 -0500
image: /static/images/phoenix.png
repo: https://github.com/getting-started-md/elixir-phoenix
summary: Phoenix is a full-blown MVC framework for Elixir.
---

Phoenix is a full-blown MVC framework for Elixir. It has a similar feel to rails and is quickly becomming the de-facto framework for developing full stack Elixir websites.


##Install elixir

Elixir is a functional programming langauge that runs on the Erlang BeamVM. Elixir syntax is inspired by Ruby and tries to bring things developers love about Ruby syntax to functional programming.

```bash
brew install elixir
```

##Install hex

hex is elixir's package manager. If you have a rails or node background this would be analogous to `gem` or `npm`.

```bash
mix local.hex
```

## Install Phoenix

Once we have hex installed we can install our first package. The following command will install the 0.13.1 version of Phoenix. This will also provide the global mix task `phoenix.new`. `mix` is our main task runner for elixir. If you've used ruby it acts like rake/bundler/rails combined.

```bash
mix archive.install https://github.com/phoenixframework/phoenix/releases/download/v0.13.1/phoenix_new-0.13.1.ez
```


##Create demo project

We will create our demo project based on the standard Phoenix scaffold. The main caveat here is, we are skipping ecto. Ecto is kind of an ORM but more of a high level abstraction for querying a postgres database. Working with a Database is out of scope for this guide so we are running the command with `--no-ecto`

```bash
mix phoenix.new sample_app --no-ecto
```

##Compile and run server

We can test that everything works before we start changing things by compiling and running the server. Mix will basically compile our application on demand so we can simply start our server and it will compile your application along with any dependencies.

```bash
mix phoenix.server
```

## Visit the site

By browsing to the site you should see a generic phoenix welcome page.

[http://localhost:4000/
](http://localhost:4000/
)

## Exploring Phoenix

By default a PageController is generated with your new app.

Open **web/controllers/page_controller.ex**

```elixir
defmodule SampleApp.PageController do
  use SampleApp.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end
end
```

Elixir doesn't have classes but you can think of `defmodule` as the functional equivelent.

This basic controller defines a basic index function. According to our default router, this funciton is called when the client visits **/** .

The call to render tells Phoenix to render the template "index.html" to conn, which is the current connection. 

Functional programming languages have no sense of an instances, or instance variables so everything must be explicitly passed.

To get started lets try passing dynamic content to our template.

```elixir
defmodule SampleApp.PageController do
  use SampleApp.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html", %{data: "Hello World"}
  end
end
```

Now lets adjust our template to use the data variable.

Open **web/templates/page/index.html.eex** and change the content to

```html
<h1>
  <%= @data %>
</h1>
```

Now lets clean up the layout

Open **web/templates/layout/application.html.eex** and change the content to

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title> Sample App </title>
  </head>
  <body>
      <%= @inner %>
  </body>
</html>
```

If you stopped your server, start it again with

```bash
mix phoenix.server
```

Now visit http://localhost:4000/ and you should see your simple page rendering your custom data variable in an h1 tag.


## Create a new page

Now lets add an addition route.

Open **web/router.ex** and look for the section

```elixir
scope "/", SampleApp do
  pipe_through :browser # Use the default browser stack

  get "/", PageController, :index
end
```

You can probably guess how the routing works based on this example.

Add a new get route similar to the following

```elixir
scope "/", SampleApp do
  pipe_through :browser # Use the default browser stack

  get "/", PageController, :index
  get "/awesome", AwesomeController, :index
end
```

This will send requests to **/awesome** to the index function of the AwesomeController.

Next we need to create an AwesomeController, create **web/controllers/awesome_controller.ex**

```elixir
defmodule SampleApp.AwesomeController do
  use SampleApp.Web, :controller

  plug :action

end
```

Next lets add an index function 

```elixir
defmodule SampleApp.AwesomeController do
  use SampleApp.Web, :controller

  plug :action
  
  def index(conn, _params) do
    render conn, "index.html", %{message: "is Awesome!"}
  end

end
```

Now we need to actually create a template to render, create a new file **web/templates/awesome/index.html.eex**

```html
<h1>
  This template <%= @message %>
</h1>
```

In addition to our template we will need a view. The view can be generic for now and should be created as **web/views/awesome_view.ex**

```elixir
defmodule SampleApp.AwesomeView do
  use SampleApp.Web, :view
end
```

Now if we start the server and navigate to **http://localhost:3000/awesome** we should see a large *This template is Awesome!* message.