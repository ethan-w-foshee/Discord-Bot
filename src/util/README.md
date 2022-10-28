# /src/util/ folder

## Purpose

The util folder is intended to hold modules and function definitions which
actually carry out the functions of features. If you made a command declaration
in `/src/applicationCommands/`, then the definition will be in a file in here.

## Actually adding a feature

In this folder, there should only be 1 item per feature. If a feature needs
multiple files, it should be placed into a folder within this folder
(`/src/util/`).

To link this code to the actual bot, you'll want to import the function(s) with
a statement in `/bot.js`

```deno
import <function name> from "./src/util/<featurename>"
```

You'll then call that function based on "events" as defined under the bot
object.

It's also possible you'll have to import this into the `main.js` file, but I
haven't run into that, so idk man
