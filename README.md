# BFDI: Branches Custom Server

This is a repository where the BFDI: Branches Custom Server is avaliable at and is open-source, letting you know how the server is like, even though it isn't the same. (I'm aware some functions may broke after 2.0, but this project is not really in my priority, so expect it to come out in few months)

## What's implemented

This is what we have implemented so far:

* Creating and signing in user
* Profile editing (PFP, Bio)
* Gelatin's Shop
* Leaderboard
* Levels (partially)
* version.php (needed to let the game check for updates)
* Moderation API

## Setting up

(This setup assumes you are going to use a MySQL server and that you have node.js installed)

You can set up the project by first, making your MySQL server, you can edit the code to use other databases as well.

Make sure you created the database "bfdibranches", then run the following command to import the sql file
`mysql -u root -p bfdibranches < bfdibranches.sql`
or
`mysql -u root -p bfdibranches < "<some file path to the folder where the sql file is located>\bfdibranches.sql"`

In index.js, if you're using mysql, then edit the connection variable to your own connection settings.

If you are using Visual Studio (Code), then you can start debugging from there. Otherwise, you can start the server with `node index.js` (Make sure the MySQL server is running as well!)

If you want to share your custom server to the public, then port forwarding is required and making the part you're using allowed on your firewall for incoming and outgoing connection.

## Patching the game for custom server

BFDI: Branches usually have the server set to "branchesbfdi.nfshost.com", however you can change it either by hex editor or decompiling the game and editing it.

(**Make sure to always sign out after switching servers as the way of storing your info is not the same!**)
### Hex Editor
**(Easiest, but you can mess up)**

First, open up your favorite hex editor, for example, we will be using HxD.

With HxD, open up bfdibranches.pck, go to search and press on Find (or Ctrl+F) and type in this value you want to find:
`"https://branchesbfdi.nfshost.com"`
(Make sure to find it as a Text-String)

Make sure that your url is not longer than the length of the original, if it's shorter, you can just fill the rest of empty space with 0A (in hex, not text.)

You can save the patched pck as you have patched the game to use your custom server.

### Decompiling the game
**(Safest, but not simplest)**

First, use your favorite decompiler to decompile the pck file, which in our case, is `bfdibranches.pck`

Before you open up the project, note that all of the svg file (depending of the decompiler you use) may not be decompiled properly, so you must use the hex editor to dump the svg. [They are actually webp]

Once you're done fixing the project, open up the project, go to global.gd, and change the server variable to your server url.

You can save the project and compile it for Windows and other platforms too.

(If the decompiler complains about encryption key, then you're most likely trying to decompile for version below 0.1.4, the solution is to update or use the hex editor method)

**(The URL text you see after you changed the server to the custom server on the top-right is normal and is expected)**

