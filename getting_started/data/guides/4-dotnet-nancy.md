## Dotnet And Nancy

## Background on .NET and OSX/Linux

.NET was originally a window only product targeted at replacing Java/Visual J++ and Legacy VisualBasic with C# and VisualBasic.NET

This guide will focus on .NET and C# via the Mono project. 

There has been a huge movement over the last 10 years to bring .NET to linux and osx via the mono project. Recently microsoft has opensourced a large ammount of their .NET framework and tools along with contributing to the Mono project.

.NET/C# can be used to develop desktop application, client web applications (Silverlight) and Web apps (ASP.NET)

Tradional ASP.NET is huge and not well suited to a getting started guide. 

For this guide and to follow with the theme of the guides on this site we will start with the microframework Nancy.

# What is Nancy

Nany is a lightweight web development framework for the .NET
framework. At it's core it is a simple router / routing dsl, similar to flask or sinatra.

## Installing the Mono MDK.

Download and run installer from

`http://www.mono-project.com/download/#download-mac`

or if you have brew cask installed

```
brew cask install mono-mdk
```

## .NET versions

The dot net framework has gone through multiple versions.
1-4.5 at the time of writing this guide.

Binstubs are versioned and for the purpose of this guide we are assuming we using .NET 4.x

A common cause of errors is a mismatch between compiler/nuget versions and asp server versions. If you run into strange assembly version mismatch errors, ensure the server and nuget versions match.


## Nuget

Nuget is the package manager of .NET, modern releases of Mono and the MDK should ship with a Nuget binstub. If your release doesn't contain one, there are guides for creating it.

See:
[https://gist.github.com/andypiper/2636885](https://gist.github.com/andypiper/2636885)


## Create an application folder

First you want to create a folder for your application. I keep my projects in ~/projects. So i would `cd` to ~/projects

`cd ~/projects`

then

`mkdir -p nancy_example`

and finally

`cd nancy_example`

## Installing Nancy

First we want to create our package file. This is an xml document that defines our application's dependencies. Similar to a requirements.txt or a Gemfile, if you are familiar with Python or Ruby.

Create a new folder in your project for packages.

`mkdir -p packages`

and create a file called packages.config with the following content.

```
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Nancy" version="1.2.0" />
  <package id="Nancy.Hosting.Aspnet" version="1.2.0" />
</packages>
```

Once created, you can use `nuget` to install the packages.

`nuget restore packages/packages.config -PackagesDirectory packages`

## A Simple app

Nancy uses what it calls modules but are really classes to define routes. By default it will find and load all classes that subclass `Nancy.NancyModule`

To define an index route, create a file in your application folder named SampleModule.cs and include the content listed below.

```
public class SampleModule : Nancy.NancyModule
{
    public SampleModule()
    {
        Get["/"] = _ => "Hello World!";
    }
}
```

The first like declares a public class named SampleModules that inherits Nancy.NancyModule.

Next is a construct declaration. In C#, a constructor is a public function with the same name as class.

Inside the function is the Nancy DSL for defining a route.

In this case its defining a response to a GET request for "/" aka our index route.

Finally we tell Nancy to respond to the index route with the text Hello World.

## Web Servers

The .NET ecosystem actually has developed a few webservers including IIS/ASP.NET and OWIN.

The happy path to ASP.NET is certainly IIS/ASP.NET so we will just keep things simple. Nancy can also self host, but it is a bit off the beaten path as most .NET development is served via IIS/ASP.NET and there are opensource modules for Apache and FastCGI.


## Web.config

ASP.NET apps general behavior and assembly loading is done via a Web.config. The full spec of Web.config is a bit out of scope, but the following boilerplate will allow you to run a Nancy application in IIS/ASP.NET without much hastle.

For more information see: [https://msdn.microsoft.com/en-us/library/aa306178.aspx](https://msdn.microsoft.com/en-us/library/aa306178.aspx)

Create a file named Web.config in your application folder root and fill it with the following content.

```
<system.web>
  <compilation debug="true" targetFramework="4.5" />
  <httpHandlers>
    <add verb="*" type="Nancy.Hosting.Aspnet.NancyHttpRequestHandler" path="*"/>
  </httpHandlers>
</system.web>

<system.webServer>
  <modules runAllManagedModulesForAllRequests="true"/>
  <validation validateIntegratedModeConfiguration="false"/>
  <handlers>
    <add name="Nancy" verb="*" type="Nancy.Hosting.Aspnet.NancyHttpRequestHandler" path="*"/>
  </handlers>
</system.webServer>
```

## Building

C# / .NET code is compiled into Byte code and ran in a VM similaraly to Java. The following will allow you to compile your SampleModule into a .NET assembly library which can be loaded by ASP.NET/IIS. The product of this is a DLL file.

In your application root create a bin folder for your compiled assemblies.

`mkdir -p bin`

Now run the compiler and target the bin folder.

`mcs -r:packages/Nancy.1.2.0/lib/net40/Nancy.dll -t:library SampleModule.cs -out:bin/SampleModule.dll`

mcs or `Mono Compiler Service` will compile your .cs file into a EXE or DLL.

We are asking for DLL by specifing the `-t:library` flag

We also tell it to load the Nancy assembly from NuGet by specifing the `-r:packages/Nancy.1.2.0/lib/net40/Nancy.dll` flag.

Finally we tell it to put the compiled DLL in bin by specifing the 
`-out:bin/SampleModule.dll` flag.

## Link Assemblies

In order for IIS/ASP.NET to find the Nancy assemblies we place them in the bin folder with our Nancy module assemblies.

The best way to do this and allow them to stay up to date with our NuGet packages is to use symbolic links.

These are created with the `ln -s` command.

The `-s` flag specifies symbolic links rather than hard-links.

See the manpage for `ln` for more info.

```
ln -s ../packages/Nancy.Hosting.Aspnet.1.2.0/lib/net40/Nancy.Hosting.Aspnet.dll bin/Nancy.Hosting.Aspnet.dll
ln -s ../packages/Nancy.1.2.0/lib/net40/Nancy.dll bin/Nancy.dll
```


## Run it

Once everything is compiled and the bin folder is prepared, we can run our server.

xsp, is the stand-alone ASP.NET application server. Rember how I said that the binstubs are versioned. Since our application is targeting the 4.x framework version we use `xsp4` if we were target 2 or 3 we could use `xsp2` or `xsp3`.

In side your application root run

`xsp4`

This should start a ASP.NET compatible development server and you can view your application at http://localhost:8080

## Updates

Since .NET runs as compiled bytecode we must recompile the .cs file to a new DLL when we make changes.

## Makefile

As the project grows in complexity and we have multiple cs targets to compile we may want to make compilation a bit more automated.

The make command and a Makefile is a great way to do this.

Create a file in your application's root called __Makefile__ with following content.

```
DEPENDENCIES=-r:packages/Nancy.1.2.0/lib/net40/Nancy.dll

all: sample

sample:
  mcs $(DEPENDENCIES) -t:library SampleModule.cs -out:bin/SampleModule.dll

server:
  xsp4
```

The first line is declaring a variable called dependencies since all our modules will require this.

Next we define our *all* task.

The all task will just be responsible for running other tasks.

```
all: sample
``` 

just means that the default task should run the sample task.

When we call `make` it will run sample.

Next we declare the sample task.
This is where we define how the sample module should be built.

This will run mcs just like before except it will include our dependency variable to help avoid typing out all the dependencies for every module. This will also allow us to add new common dependencies easily.

Finally we just add a server task to easily run our server from the make tool. This is totally optional but just goes to show how make can be a simple runner for our project.

Now when we update our cs file, all we need to do is type make to recompile our application.

`make`

Adding additional files is as easy as defining additional tasks to compile additional assembiles

```
DEPENDENCIES=-r:packages/Nancy.1.2.0/lib/net40/Nancy.dll

all: sample template_example

sample:
  mcs $(DEPENDENCIES) -t:library SampleModule.cs -out:bin/SampleModule.dll

template_example:
  mcs $(DEPENDENCIES) -t:library TemplateSampleModule.cs -out:bin/TemplateSampleModule.dll

server:
  xsp4
```

Now `make` will compile 2 assemblies every time it is run.

Another useful make task is *clean*.

We can implement this the same way in our Makefile

```
(snip)

clean:
  rm -rf bin/*
  ln -s ../packages/Nancy.Hosting.Aspnet.1.2.0/lib/net40/Nancy.Hosting.Aspnet.dll bin/Nancy.Hosting.Aspnet.dll
  ln -s ../packages/Nancy.1.2.0/lib/net40/Nancy.dll bin/Nancy.dll


(snip)
```

now running `make clean` will empty our bin folder, and relink our nuget assembly dependencies so that we can rebuild.

It might be useful to clean before every build so in our *all* task we can do the following

```
(snip)

all: clean sample template_example

(snip)
```

## Templates

.NET is not short on templating libraries, although for general purpose templating Razor seems to be a favorite.

### Installing Razor

First, modify your packages/packages.config by adding

```
  <package id="Microsoft.AspNet.Razor" version="3.2.3" />
  <package id="Nancy.Viewengines.Razor" version="1.2.0" />
```

to the `<packages>` block

Your file should look like this:

```
<packages>
  <package id="Nancy" version="1.2.0" />
  <package id="Nancy.Hosting.Aspnet" version="1.2.0" />
  <package id="Microsoft.AspNet.Razor" version="3.2.3" />
  <package id="Nancy.Viewengines.Razor" version="1.2.0" />
</packages>
```

Now update your packages:

run `nuget restore packages/packages.config -PackagesDirectory packages` in the root of your application.

### Configure Razor

Open your web.config and add the following lines to the top:

  <configSections>
    <section name="razor" type="Nancy.ViewEngines.Razor.RazorConfigurationSection, Nancy.ViewEngines.Razor" />
  </configSections>

  <razor disableAutoIncludeModelNamespace="false">
  </razor>

The complete file should look like this:

```
<?xml version="1.0"?>
<configuration>

  <configSections>
    <section name="razor" type="Nancy.ViewEngines.Razor.RazorConfigurationSection, Nancy.ViewEngines.Razor" />
  </configSections>

  <razor disableAutoIncludeModelNamespace="false">
  </razor>

  <system.web>
    <compilation debug="true" targetFramework="4.5" />
    <trace enabled="true" pageOutput="true" requestLimit="40" localOnly="false"/>
    <httpHandlers>
      <add verb="*" type="Nancy.Hosting.Aspnet.NancyHttpRequestHandler" path="*"/>
    </httpHandlers>
  </system.web>

  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true"/>
    <validation validateIntegratedModeConfiguration="false"/>
    <handlers>
      <add name="Nancy" verb="*" type="Nancy.Hosting.Aspnet.NancyHttpRequestHandler" path="*"/>
    </handlers>
  </system.webServer>

</configuration>

```

### Add a route for your template

To show how an application can load multiple modules, I am suggesting you create a new .cs file to play with templates, however your could just modify your __SampleModule.cs__.

Create a new file in root of your application folder called __TemplateSampleModule.cs__ and add the following:

```
public class TemplateSampleModule : Nancy.NancyModule
{
    public TemplateSampleModule()
    {
        Get["/hello"] = Hello;
    }

    private dynamic Hello(dynamic parameters)
    {
        ViewBag.title = "Hello World!";
        return View["hello_world"];
    }
}
```

As in the previous example we are defining a GET route for /hello, however this time we are pointing it a function instead of a string.

The private function Hello defined below will be run when a client sends a GET request to /hello.

This function sets ViewBag.title to "Hello World!" and the returns the hello_world view.

ViewBag is an object shared with the view and makes it easy to pass variables from the controller to the view.

### Creating our View

Views are stored in a views folder.

First create a views folder in your application's root.

`mkdir -p views`

Next create a new file in the views folder called __hello_world.cshtml__ with the following content:

```
<!DOCTYPE html>
<html>
<body>
  <h1> @ViewBag.title </h1>
</body>
</html>
```

This will render the value of our ViewBag.title in an H1 tag.

### Compiling our additional module.

If you followed the extra step of adding the *template_example* task to your Makefile all you need to do is run `make`

Otherwise you can add it to your Makefile now, or just invoke mcs manually to compile the additional template.

`mcs -r:packages/Nancy.1.2.0/lib/net40/Nancy.dll -t:library TemplateSampleModule.cs -out:bin/TemplateSampleModule.dll`

### Run the server

Now you can run `xsp4` or `make server`

Navigate to http://localhost:8080/hello and you should be greeted by a large __HELLO WORLD!__
