//screw you ai, lol, this is better than your goofy ahh way of coding, learn how to code instead of vibe coding!

//idk why bfdi branches' server uses a lot of post requests instead of using get requests with params.

//imports

import express from 'express'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import http from 'https'
import fs from 'fs'

//settings

var disableSignatureCheck = false //Disables the signature check when checking if the account info is valid (NOT RECOMMENDED)
var disableHashCheck = false //Disables the hash check when checking if the account info is valid and uses the legacy method (NOT RECOMMENDED)
var usernameColorBadgesExploitFix = true //Fixes the exploit server-side that causes ACE on BFDI: Branches due to str_to_var() exploit on Godot (I'm not responsible if you get your account banned for cheating in Branches if you have this fix off)
var verbose = false //Logs more info
var trolladminurl = true //Trolls people by rickrolling when someone tries to go to /admin
var blockOtherUserAgent = true //Block other user agents except Godot (make it more accurate to the server)
var disableInventoryCheck = false //Disable the inventory check when purchasing PFPs
var enableResetDailyAward = true //Enables resetting the daily award when a certain day hits every 24 hours
var serverSync = {
    "version": false,
    "shopItems": true,
    "extraCredits": false //Why would you need this?
} //Makes the version, shopitems, and extracredits string match the official server by contacting the server
var disableStaticLevelsLink = true //Disables the static levels url
var disableLevelCompletion = false //Disables the function that completes level
var ignoreCreatorAsFirstCompleter = true //Ignores the creator when being the first to complete it (Allows other user to complete level first instead of the creator)
var secret = "bfdibranchessecrettestthatis256b" //A secret when signing/checking the credentials on signup/login

//variables

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const app = express()
var shopitems = '{ "fg": { "73": 500, "69": 1000, "24": 500, "25": 500, "34": 500, "30": 500, "43": 500, "31": 500, "41": 500, "57": 500, "32": 500, "42": 500, "33": 500, "36": 500, "72": 500, "78": 500, "84": 500, "45": 500, "7": 1000, "18": 1000, "8": 1000, "16": 1000, "5": 1000, "17": 1000, "15": 1000, "11": 1000, "9": 1000, "14": 1000, "19": 1000, "12": 1000, "20": 1000, "6": 1000, "13": 1000, "10": 1000, "21": 1000, "62": 1000, "65": 1000, "66": 1000, "67": 1000, "68": 1000, "47": 1500, "4": 4000, "40": 4000, "22": 4000, "63": 4000, "37": 7000, "35": 7000, "1010": 7000, "44": 15000, "59": 7000, "61": 7000, "64": 7000, "83": 7000, "90": 7000 }, "bg": { "8": 500, "9": 500, "10": 500, "11": 500, "12": 500, "33": 500, "34": 500, "35": 500, "37": 500, "36": 500, "38": 500, "39": 500, "13": 1000, "14": 1000, "20": 1000, "24": 1000, "21": 1000, "22": 1000, "23": 1000, "42": 1000, "43": 1000, "48": 1000, "49": 1000, "66": 1000, "67": 1000, "68": 1000, "69": 1000, "32": 1500, "15": 1500, "16": 1500, "17": 1500, "64": 1500, "18": 1500, "19": 1500, "25": 1500, "26": 1500, "27": 1500, "28": 1500, "29": 1500, "30": 1500, "31": 1500, "44": 1500, "45": 1500, "46": 1500, "70": 1500, "71": 1500, "65": 1500 } }'
var YFshopitems = '{ "fg": { "111": 500, "112": 500, "113": 500, "58": 500, "92": 500, "93": 500, "94": 500, "95": 500, "97": 500, "106": 500, "107": 500, "108": 500, "109": 500, "110": 500, "99": 500, "100": 500, "48": 1500, "49": 1500, "52": 1500, "54": 1500, "50": 1500, "56": 1500, "55": 1500, "51": 1500, "53": 1500, "60": 4000, "96": 4000, "101": 7000 }, "bg": { "51": 500, "53": 500, "52": 1000, "59": 1000, "60": 1000, "61": 1000, "62": 1000, "63": 1000, "75": 1000, "77": 1000, "78": 1000, "79": 1000, "80": 1000, "81": 1000, "83": 1000, "84": 1000, "85": 1000, "87": 1000, "90": 1000, "54": 1500, "55": 1500, "56": 1500, "57": 1500, "58": 1500, "82": 1500, "88": 1500, "89": 1500, "76": 1500 } }'
var version = "0.3.3.1" //A version the server reports to the client (If the client sees that it doesn't match this version, it will prompt you to update, unless the version check for the client is patched)
var port = 3000

app.use(express.json({ limit: '8mb' }))

const connection = await mysql.createConnection({
    // PUT YOUR OWN DATABASE IN AND I WOULD RECOMMEND PUTTING THE PASSWORD IN IT!!!
    host: 'localhost',
    user: 'root',
    database: 'bfdibranches'
});

function isNumeric(str) {
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

//code

app.get('/', (req, res) => {
    //obviously
    res.status(200).send('OK');
    if (verbose) {
        console.log("\x1b[34m", "<INFO> The server has been pinged by " + req.ip)
    }
});

if (trolladminurl == true) {
    app.get('/admin', (req, res) => {
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share")
        if (verbose) {
            console.log("\x1b[34m", "<INFO> " + req.ip + " tried to go to /admin, redirected to rickroll")
        }
    })
}

app.get('/favicon.ico', (req,res) => {
    res.status(404).end();
})

app.get('/version.php', (req, res) => {
    //Always gives out result from the variable
    res.status(200).send(version);
});

app.post('/version.php', (req, res) => {
    //same thing
    res.status(200).send(version);
});

app.post("/editpfp.php", async (req,res) => {
    //edit profile picture here
     try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) {
             var password = passresult["password"]
        
         var [results, fields] =  await connection.query(
        'SELECT foregroundsowned, backgroundsowned FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );
        if (results.length > 0) {
            var foregroundowned = false
            var backgroundowned = false
            var splitted = results[0]["foregroundsowned"].toString().slice(0,-1).slice(1).split(',')
            for (var i = 0; i < splitted.length; i++) {
                
                if (splitted[i] == req.body["foreground"]) {
                    foregroundowned = true
                    break
                }
            }
            splitted = results[0]["backgroundsowned"].toString().slice(0,-1).slice(1).split(',')
            for (var i = 0; i < splitted.length; i++) {
                
                if (splitted[i] == req.body["background"]) {
                    backgroundowned = true
                    break
                }
            }   
            if (foregroundowned && backgroundowned) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET foreground = ?,background = ? WHERE username = ? AND password = ?',[req.body["foreground"],req.body["background"],req.body["username"], password])
                if (results1["affectedRows"] > 0) {
                     const [results2, fields2] = await connection.query('UPDATE bfdibrancheslevel SET foreground = ?,background = ? WHERE username = ?',[req.body["foreground"],req.body["background"],req.body["username"]])
                if (results2["affectedRows"] > 0) {
                     res.status(200).end()
                     if (verbose) {
                        console.log("\x1b[34m", "<INFO> " + req.body["username"] + " changed their profile picture to FG: " + req.body["foreground"] + " and BG: " + req.body["background"] + "!")
                     }

                }
                else {
                    res.status(400).end()
                }
                }
               
            }
            else {
                res.status(400).send("You don't own this pfp")
                if (verbose) {
                    console.log("\x1b[34m", "<INFO> " + req.body["username"] +  "(" + req.ip + "*) attempted to change the profile picture to FG: " + req.body["foreground"] + " and BG: " + req.body["background"] +", but doesn't own it!")
                }
            }
        }
        else {
            res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
            
        }
        }
        else {
            res.status(400).end()
        }
        })
        
       
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }
})
app.post('/editprofile.php', async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            password = passresult["password"]
        
         const [results, fields] =  await connection.query(
        'UPDATE bfdibranchesaccount SET bio = ? WHERE username = ? AND password = ?',[req.body["bio"],req.body["username"], password]
    );
        if (results["affectedRows"] > 0) {
            res.status(200).send("Changed bio")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " edited their bio.")
            }
        }
        else {
            res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
        }
        })
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }
})
app.get("/static/leaderboards/0.json", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id, points, username,foreground,background,frame,usernameColor,bio,date,branchcoins,moderator,badges FROM bfdibranchesaccount ORDER BY points DESC LIMIT 100'
    );
        for (var i = 0; i < results.length; i++) {
        results[i]["id"] =  results[i]["id"].toString()
        results[i]["foreground"] =  results[i]["foreground"].toString()
        results[i]["background"] =  results[i]["background"].toString()
        results[i]["moderator"] =  results[i]["moderator"].toString()
        results[i]["points"] = results[i]["points"].toString()
        results[i]["user_rank"] = (i + 1).toString()
        results[i]["frame"] = results[i]["frame"].toString()
        results[i]["branchcoins"] = results[i]["branchcoins"].toString()
        results[i]["date"] = results[i]["date"].replaceAll("Account Created: ", "")
        if (usernameColorBadgesExploitFix) {
        if (results[i]["usernameColor"].startsWith("Object(")) {
            results[i]["usernameColor"] = "[0,0]"
        }
        if (results[i]["badges"].startsWith("Object(")) {
            results[i]["badges"] = "[]"
        }
    }
    }
        res.send(JSON.stringify(results).replaceAll("\"id\":","\"userid\":"))
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }
})

app.post("/static/leaderboards/0.json", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id, points, username,foreground,background,frame,usernameColor,bio,date,branchcoins,moderator,badges FROM bfdibranchesaccount ORDER BY points DESC LIMIT 100'
    );
        for (var i = 0; i < results.length; i++) {
        results[i]["id"] =  results[i]["id"].toString()
        results[i]["foreground"] =  results[i]["foreground"].toString()
        results[i]["background"] =  results[i]["background"].toString()
        results[i]["moderator"] =  results[i]["moderator"].toString()
        results[i]["points"] = results[i]["points"].toString()
        results[i]["user_rank"] = (i + 1).toString()
        results[i]["frame"] = results[i]["frame"].toString()
        results[i]["branchcoins"] = results[i]["branchcoins"].toString()
        results[i]["date"] = results[i]["date"].replaceAll("Account Created: ", "")
        if (usernameColorBadgesExploitFix) {
        if (results[i]["usernameColor"].startsWith("Object(")) {
            results[i]["usernameColor"] = "[0,0]"
        }
        if (results[i]["badges"].startsWith("Object(")) {
            results[i]["badges"] = "[]"
        }
    }
    }
        res.send(JSON.stringify(results).replaceAll("\"id\":","\"userid\":"))
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }
})

app.post("/static/pfpshopitems.json", (req, res) => {
    res.send(shopitems)
})
app.get("/static/pfpshopitems.json", (req, res) => {
    res.send(shopitems)
})
app.get("/static/pfpshopitems.php", (req, res) => {
    res.send(shopitems)
})

app.post("/static/pfpshopitems.php", (req, res) => {
    res.send(shopitems)
})

app.get("/static/pfpshopitemsYF.php", (req, res) => {
    if (parseFloat(version.slice(0,3)) > 0.1) {
        res.send(YFshopitems)
    }
    else {
        res.status(404).end()
    }
})

app.post("/static/pfpshopitemsYF.php", (req, res) => {
    if (parseFloat(version.slice(0,3)) > 0.1) {
        res.send(YFshopitems)
    }
    else {
        res.status(404).end()
    }
})

app.get("/static/pfpshopitemsYF.json", (req, res) => {
    if (parseFloat(version.slice(0,3)) > 0.1) {
        res.send(YFshopitems)
    }
    else {
        res.status(404).end()
    }
})

app.post("/static/pfpshopitemsYF.json", (req, res) => {
    if (parseFloat(version.slice(0,3)) > 0.1) {
        res.send(YFshopitems)
    }
    else {
        res.status(404).end()
    }
})

app.post("/getpfpinventory.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
           if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
         password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT foreground, background, branchcoins, backgroundsowned, foregroundsowned FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        
      res.status(200).send("[[" + results[0]["foreground"] + "," + results[0]["background"] + "," + results[0]["branchcoins"] + ",0]," + results[0]["foregroundsowned"] + "," + results[0]["backgroundsowned"] + ",[0]]")
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }  
        }) 
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/weeklyreward/reward.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
         password = passresult["password"]
        var [results, fields] =  await connection.query(
        'SELECT branchcoins,rewardavailable FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );
    if (results.length > 0) {
        var coins = results[0]["branchcoins"]
        const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, rewardavailable = 0 WHERE username = ? AND password = ? AND rewardavailable = 1',[parseInt(coins) + 700,req.body["username"], password])

        if (results1["affectedRows"] > 0) {
            res.status(202).send("1234567890")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " opened their weekly reward.")
            }
        }
        else {
            res.status(200).end()
        }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
        
        
}
catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/pfpshop.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            password = passresult["password"]
        if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        var [results, fields] =  await connection.query(
        'SELECT branchcoins,foregroundsowned,backgroundsowned,rewardavailable FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        var coins = results[0]["branchcoins"]
        var foregrounds1 = results[0]["foregroundsowned"]
        var backgrounds1 = results[0]["backgroundsowned"]
        if (req.body["mode"] == "get") {
            var result = ""
            for (var i = 0; i < results[0]["foregroundsowned"].split(',').length; i++) {
                var foregrounds = results[0]["foregroundsowned"].slice(0,-1).slice(1).split(',')
                    result = result + '{"type":0,"pfpid":' + foregrounds[i] + "},"         
            }
            for (var i = 0; i < results[0]["backgroundsowned"].split(',').length; i++) {
                var backgrounds = results[0]["backgroundsowned"].slice(0,-1).slice(1).split(',')
                //(i == backgrounds.length - 1) ? result = result + '{"type":1,"pfpid":' + backgrounds[i] + "}" : result = result + '{"type":1,"pfpid":' + backgrounds[i] + "}," 
                result = result + '{"type":1,"pfpid":' + backgrounds[i] + ((i == backgrounds.length - 1) ? "}" : "},")
            }
            res.status(206).send("[" + results[0]["branchcoins"] + "," + results[0]["rewardavailable"] + ",[" + result + "]]")
        }
        else if (req.body["mode"] == "buy") {
            if (typeof req.body["pfptype"] == "number" && req.body["pfptype"] == 0) {
                if (typeof req.body["pfpid"] == "number") {
                                var shopitemsobject = JSON.parse(shopitems)
                                var shopitemsobject2 = JSON.parse(YFshopitems)
                if (shopitemsobject["fg"][req.body["pfpid"]] != undefined) {
                    if (disableInventoryCheck == false && foregrounds1.includes("," + req.body["pfpid"] + ",") || foregrounds1.startsWith("[" + req.body["pfpid"]) || foregrounds1.endsWith("," + req.body["pfpid"] + "]")) {
                        res.status(400).send("Already Bought")
                    }
                    else {
                        if (results[0]["branchcoins"] >= shopitemsobject["fg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, foregroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject["fg"][req.body["pfpid"]]), foregrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])
                if (results1["affectedRows"] > 0) {
            res.status(202).send("1234567890")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " bought " + req.body["pfpid"] + " (FG).")
            }
        }
        else {
            res.status(400).end()
        }
                }
                else {
                    res.status(401).end()
                }
                    }
            }
            else if (shopitemsobject2["fg"][req.body["pfpid"]] != undefined) {
                    if (disableInventoryCheck == false && foregrounds1.includes("," + req.body["pfpid"] + ",") || foregrounds1.startsWith("[" + req.body["pfpid"]) || foregrounds1.endsWith("," + req.body["pfpid"] + "]")) {
                        res.status(400).send("Already Bought")
                    }
                    else {
                        if (results[0]["branchcoins"] >= shopitemsobject2["fg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, foregroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject2["fg"][req.body["pfpid"]]), foregrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])
                if (results1["affectedRows"] > 0) {
            res.status(202).send("1234567890")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " bought " + req.body["pfpid"] + " (FG).")
            }
        }
        else {
            res.status(400).end()
        }
                }
                else {
                    res.status(401).end()
                }
                    }
            }
            else {
                res.status(200).send("Price not found")
            }
                }
                else {
                    res.status(400).end()
                }
            }
            else if (typeof req.body["pfptype"] == "number" && req.body["pfptype"] == 1) {
                if (typeof req.body["pfpid"] == "number") {
                                var shopitemsobject = JSON.parse(shopitems)
                                var shopitemsobject2 = JSON.parse(YFshopitems)
                if (shopitemsobject["bg"][req.body["pfpid"]] != undefined) {
                    if (disableInventoryCheck == false && backgrounds1.includes("," + req.body["pfpid"] + ",") || backgrounds1.startsWith("[" + req.body["pfpid"]) || backgrounds1.endsWith("," + req.body["pfpid"] + "]")) {
                        res.status(400).send("Already Bought")
                    }
                    else {
                        if (results[0]["branchcoins"] >= shopitemsobject["bg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, backgroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject["bg"][req.body["pfpid"]]), backgrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])   
                if (results1["affectedRows"] > 0) {
            res.status(202).send("1234567890")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " bought " + req.body["pfpid"] + " (BG).")
            }
        }
        else {
            res.status(400).end()
        }
            }
            else {
                res.status(401).end()
            }
                    }
                                
        } 
        else if (shopitemsobject2["bg"][req.body["pfpid"]] != undefined) {
                    if (disableInventoryCheck == false && backgrounds1.includes("," + req.body["pfpid"] + ",") || backgrounds1.startsWith("[" + req.body["pfpid"]) || backgrounds1.endsWith("," + req.body["pfpid"] + "]")) {
                        res.status(400).send("Already Bought")
                    }
                    else {
                        if (results[0]["branchcoins"] >= shopitemsobject2["bg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, backgroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject2["bg"][req.body["pfpid"]]), backgrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])   
                if (results1["affectedRows"] > 0) {
            res.status(202).send("1234567890")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " bought " + req.body["pfpid"] + " (BG).")
            }
        }
        else {
            res.status(400).end()
        }
            }
            else {
                res.status(401).end()
            }
                    }
                                
        }
        else {
            res.status(200).send("Price not found")
        }
                }
                else {
                    res.status(400).end()
                }

            }
            else {
            res.status(400).end()
        }
        }
        else {
            res.status(400).end()
        }
 
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })       
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})
app.post("/moderation/checkifmoderator.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
         password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT moderator FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
         if (results[0]["moderator"] == 0) {
        res.status(200).send("Not a Moderator")
    }    
    else if (results[0]["moderator"] == 1) {
        res.status(200).send(200)
    }
    else if (results[0]["moderator"] == 2) {
        res.status(201).send(201)
    }   
    else {
        res.status(403).send(403)
    } 
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

if (disableStaticLevelsLink == false) {
    app.get("/static/levels/" + ":id" + ".json", async (req, res) => {
    try {
        let isnum = /^\d+$/.test(req.params.id)
    if (isnum) {
        const [results, fields] =  await connection.query(
        'SELECT data,dataLen FROM bfdibrancheslevel WHERE deleted = 0 AND id = ?',[req.params.id]
    );
    if (results.length > 0) {
        res.send(results)
        if (verbose) {
            console.log("\x1b[34m", "<INFO> " + req.ip + " requested level " + req.params.id + ". (GET)")
        }
    }
    else {
        res.status(404).end()
    }
    }
    else {
        res.status(400).end()
    }
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})
}

if (disableStaticLevelsLink == false) {
    app.post("/static/levels/" + ":id" + ".json", async (req, res) => {
    try {
        let isnum = /^\d+$/.test(req.params.id)
    if (isnum) {
        const [results, fields] =  await connection.query(
        'SELECT data,dataLen FROM bfdibrancheslevel WHERE deleted = 0 AND id = ?',[req.params.id]
    );
    if (results.length > 0) {
        res.send(results)
                if (verbose) {
            console.log("\x1b[34m", "<INFO> " + req.ip + " requested level " + req.params.id + ". (POST)")
        }
    }
    else {
        res.status(400).end()
    }
    }
    else {
        res.status(400).end()
    }
    } catch (err) {
    console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})
}

app.get("/static/extraCredits.txt", (req, res) => {
    if (fs.existsSync("./extraCredits.txt")) {
        res.status(200).send(fs.readFileSync("./extraCredits.txt"))
    }
    else {
        res.status(404).end()
    }
})

app.post("/static/extraCredits.txt", (req, res) => {
    if (fs.existsSync("./extraCredits.txt")) {
        res.status(200).send(fs.readFileSync("./extraCredits.txt"))
    }
    else {
        res.status(404).end()
    }
})

app.post("/getlevel.php", async (req, res) => {
    try {
        if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            let isnum = /^\d+$/.test(req.body["id"].toString())
    if (isnum) {
        const [results, fields] =  await connection.query(
        'SELECT data,dataLen,version FROM bfdibrancheslevel WHERE deleted = 0 AND id = ?',[req.body["id"]]
    );
    if (results.length > 0) {
        res.send(results)
    }
    else {
        res.status(404).end()
    }
    }
    else {
        res.status(400).end()
    }
        }
        else {
            res.status(400).end()
        }
    } catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }

})



app.post("/getlist.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            if (req.headers["x-branches-version"] == version) {
           var password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (req.body["password"] != "" || req.body["username"] != "") {
        if (results.length == 0) {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
     return
    }
    }
      if (req.body["type"] != "story") {
         if (req.body["searchtype"] == "level") {
        if (req.body["searchtitle"] != "") {
           if (req.body["searchtype2"] == "title") {
              if (req.body["type"] == "spotlight") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND title LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%", parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%",req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
            else if (req.body["type"] == "recent") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? ORDER BY id DESC LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND title LIKE ? ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND title LIKE ? ORDER BY id LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
           }
           else if (req.body["searchtype2"] == "id") {
              if (req.body["type"] == "spotlight") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND id = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["searchtitle"],parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND id = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],req.body["searchtitle"],parseInt(req.body["page"] * 10)])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND id = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[req.body["searchtitle"], parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND id = ? AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[req.body["searchtitle"],req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
            else if (req.body["type"] == "recent") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND id = ? ORDER BY id DESC LIMIT ?,10',[req.body["searchtitle"],parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND id = ? ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],req.body["searchtitle"],(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND title LIKE ? ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND title LIKE ? ORDER BY id LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
           }
        }
        else {
            if (req.body["type"] == "spotlight") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                             res.status(400).end()
                    }
                }
            }
            else if (req.body["type"] == "recent") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 ORDER BY id DESC LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 ORDER BY id LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? ORDER BY id LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
        }  
    }
    else if (req.body["searchtype"] == "user") {
                if (req.body["searchtitle"] != "") {
             if (req.body["type"] == "spotlight") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND username LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND username LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND username LIKE ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%", parseInt(req.body["page"] * 10)])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND username LIKE ? AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%",req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                             res.status(400).end()
                    }
                }
            }
            else if (req.body["type"] == "recent") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND username LIKE ? ORDER BY id DESC LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND username LIKE ? ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND username LIKE ? ORDER BY id LIMIT ?,10',["%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND username LIKE ? ORDER BY id LIMIT ?,10',[req.body["difficulty"],"%" + req.body["searchtitle"] + "%",parseInt(req.body["page"] * 10)])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
        }
        else {
            if (req.body["type"] == "spotlight") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = [];
                    if (req.body["difficulty"] == -1) {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                     [results1, fields1] = await connection.query('SELECT id,username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,version,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? AND spotlight = 1 OR spotlight = 2 ORDER BY id LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }

                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                            var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                             res.status(400).end()
                    }
                }
            }
            else if (req.body["type"] == "recent") {
                if (req.body["order"] == "newest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 ORDER BY id DESC LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? ORDER BY id DESC LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
                else if (req.body["order"] == "oldest") {
                    var [results1, fields1] = []
                     if (req.body["difficulty"] == -1) {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 ORDER BY id LIMIT ?,10',[(parseInt(req.body["page"] * 10))])
                    }
                    else {
                    [results1, fields1] = await connection.query('SELECT id, username,creatortime,title,description,difficulty,date,username,spotlight,completed,completedtime,icon,peoplebeaten,background,foreground,worldrecordtime,worldrecordholder,firstcompleter,lastcompleter,characterOnly FROM bfdibrancheslevel WHERE deleted = 0 AND difficulty = ? ORDER BY id LIMIT ?,10',[req.body["difficulty"],(parseInt(req.body["page"] * 10))])
                    }


                    if (results1.length > 0) {
                        for (var i = 0; i < results1.length; i++) {
                             var peoplebeatenarray = []
                            peoplebeatenarray = results1[i]["peoplebeaten"].split(",")
                            if (peoplebeatenarray[0] == "[]") peoplebeatenarray = ""

                            if (peoplebeatenarray.length > 0) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + ((results1[i]["firstcompleter"] == null) ? "" : results1[i]["firstcompleter"]) + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            results1[i]["icon"] =  results1[i]["icon"].toString()
                            results1[i]["spotlight"] =  results1[i]["spotlight"].toString()
                            results1[i]["difficulty"] =  results1[i]["difficulty"].toString()
                            results1[i]["foreground"] = results1[i]["foreground"].toString()
                            
                            results1[i]["background"]= results1[i]["background"].toString()
                                                        if (results.length > 0) {
                                  if (results1[i]["peoplebeaten"].toString().includes(",")) {
                                if (results1[i]["peoplebeaten"].toString().includes("," + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().endsWith("," + results[0]["id"] + "]")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else if (results1[i]["peoplebeaten"].toString().startsWith("[" + results[0]["id"] + ",")) {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            else {
                                if (results1[i]["peoplebeaten"] == "[" + results[0]["id"] + "]") {
                                    results1[i]["completed"]  = "true"
                                }
                                else {
                                    results1[i]["completed"]  = "false"
                                }
                            }
                            }
                        }
                        
                        var jsonstring = JSON.stringify(results1)
                        jsonstring = jsonstring.replaceAll("\"username\":","\"user\":")
                        res.send(jsonstring)
                    }
                    else {
                        res.status(400).end()
                    }
                }
            }
        }  
    }
      }
      else {
        res.status(204).end()
      }

     }
     else {
        res.status(400).send("Please update Branches!")
     }
        }
        else {
            res.status(400).end()
        }
        })
        
     
}
catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})  


app.post("/upload.php", async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT id, background, foreground FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );
    if (results.length > 0) {
        if (isNumeric(req.body["icon"])) {
            if (isNumeric(req.body["replaceid"])) {
            var datet = new Date(Date.now())
        const [results1, fields1] = await connection.query("SELECT username, levelVersion FROM bfdibrancheslevel WHERE id = ?",[req.body["replaceid"]])
            if (results1.length > 0) {
                   if (results1[0]["username"] != req.body["username"]) {
            res.status(403).send("You do not own this level")
        }
        else {
var [results2, fields2] = []
if (ignoreCreatorAsFirstCompleter == true) {
    [results2, fields2] = await connection.query("UPDATE bfdibrancheslevel SET title = ?, description = ?, difficulty = 0, icon = ?, data = ?, dataLen = ?,creatortime = ?,username = ?,date = ?,background = ?,foreground = ?,version = ?, levelVersion = ?,worldrecordholder=?,worldrecordtime=?,lastcompleter=?,peoplebeaten=?, spotlight = 0 WHERE id = ? AND deleted = 0",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"),results[0]["background"],results[0]["foreground"],version,results1[0]["levelVersion"] + 1, req.body["username"],req.body["creatortime"],req.body["username"], "[" + results[0]["id"] + "]",req.body["replaceid"]])
}
else {
     [results2, fields2] = await connection.query("UPDATE bfdibrancheslevel SET title = ?, description = ?, difficulty = 0, icon = ?, data = ?, dataLen = ?,creatortime = ?,username = ?,date = ?,background = ?,foreground = ?,version = ?, levelVersion = ?,worldrecordholder=?,worldrecordtime=?,firstcompleter=?,lastcompleter=?,peoplebeaten=?, spotlight = 0 WHERE id = ? AND deleted = 0",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"),results[0]["background"],results[0]["foreground"],version,results1[0]["levelVersion"] + 1, req.body["username"],req.body["creatortime"],req.body["username"],req.body["username"], "[" + results[0]["id"] + "]",req.body["replaceid"]])
}
        if (results2["affectedRows"] > 0) {
            if (Number.parseFloat(version.slice(0,3)) > 0.1) {
                res.status(200).send("Published new level!")
            }
            else {
                res.status(200).send("Published!")
            }
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body['username'] + " replaced level id of " + req.body["replaceid"] + " with level \"" + req.body["title"] + "\" with the time of " + req.body["creatortime"] + " seconds.")
               
            }
        }
        else {
            res.status(400).end()
        }
        }
            }
            else {
                 res.status(404).send("This level doesn't exist")
            }
        }
        else {
            var datet = new Date(Date.now())
        var [results1, fields1] = []
        if (ignoreCreatorAsFirstCompleter == true) {
            [results1, fields1] = await connection.query("INSERT INTO bfdibrancheslevel (title, description, difficulty, icon, data, dataLen,creatortime,username,date,background,foreground,version,worldrecordtime,lastcompleter,worldrecordholder,peoplebeaten) VALUES (?, ?, 0, ?, ? ,?, ?, ?, ?,?,?,?,?,?,?,?)",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"),results[0]["background"],results[0]["foreground"],version,req.body["creatortime"],req.body["username"], req.body["username"],"[" + results[0]["id"] + "]"])
        }
        else {
            [results1, fields1] = await connection.query("INSERT INTO bfdibrancheslevel (title, description, difficulty, icon, data, dataLen,creatortime,username,date,background,foreground,version,worldrecordtime,lastcompleter,worldrecordholder,peoplebeaten,firstcompleter) VALUES (?, ?, 0, ?, ? ,?, ?, ?, ?,?,?,?,?,?,?,?,?)",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"),results[0]["background"],results[0]["foreground"],version,req.body["creatortime"],req.body["username"], req.body["username"],"[" + results[0]["id"] + "]",req.body["username"]])
        }
        if (results1["affectedRows"] > 0) {
            if (Number.parseFloat(version.slice(0,3)) > 0.1) {
                res.status(200).send("Published new level!")
            }
            else {
                res.status(200).send("Published!")
            }
             if (verbose) {
                 console.log("\x1b[34m", "<INFO> " + req.body['username'] + " published the level \"" + req.body["title"] + "\" with the time of " + req.body["creatortime"] + " seconds.")
            }
        }
        else {
            res.status(400).end()
        }
        }
        }
        else {
            res.status(400).send("Failed: Invalid icon, probably our mistake, sorry!")
        }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
}
catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/signup.php", async (req, res) => {
    try {
if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            if (regexOutsideChecker("[a-z_0-9]+", req.body["username"]) == false && req.body["username"].length >= 3) {
        if (req.body["password"].length >= 8) {
             var usedusername = false
    const [results, fields] = await connection.query("SELECT username FROM bfdibranchesaccount")
    for (var i = 0; i < results.length; i++) {
        if (req.body["username"] == results[i]["username"]) {
            usedusername = true
            break;
        }
    }
    if (usedusername) {
        res.send("Username Taken")
    }
    else {
        var datet = new Date(Date.now())
        const [results1, field1] = await connection.query("INSERT INTO bfdibranchesaccount (username, password, date, lastonline) VALUES (?, ?, ?, ?)",[req.body["username"],req.body["password"],"Account Created: " + datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"), datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0")])

        if (results1["affectedRows"] > 0) {
        var token = ""
        if (disableHashCheck) {
            token = jwt.sign({"password":req.body["password"]}, secret,{algorithm: 'HS256'})
        }
        else {
            token = jwt.sign({"username":req.body["username"], "jwtid":hash(req.body["password"])}, secret,{algorithm: 'HS256'})
        }
        res.set({
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'X-Token': token
        })
        res.send("Account Created!\nYour ID is " + (parseInt(results.length) + 1).toString())
        if (verbose) {
            console.log("\x1b[34m", "<INFO> " + req.body["username"] + " has been created by " + req.ip + ".")
        }
        }
    }
        }
        else {
            res.status(400).send("Invalid password format\n(Must be between 8-256 characters)")
        }
   
}
else {
    res.status(400).send("Invalid username format\n(Letters a-z, numbers and underscores)")
}
        }
        else {
            res.status(400).end()
        }
    } catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
    
})
app.post("/login.php", async (req, res) => {
     try {
        if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            if (regexOutsideChecker("[a-z_0-9]+", req.body["username"]) == false && req.body["username"].length >= 3) {
            if (req.body["password"].length >= 8) {
                const [results, fields] =  await connection.query(
        'SELECT id, username, password FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], req.body["password"]]
    );
    if (JSON.stringify(results) != "[]") {
        var token = ""
        if (disableHashCheck) {
            token = jwt.sign({"password":req.body["password"]}, secret,{algorithm: 'HS256'})
        }
        else {
            token = jwt.sign({"username":req.body["username"], "jwtid":hash(req.body["password"])}, secret,{algorithm: 'HS256'})
        }
        res.set({
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'X-Token': token
        })
        res.send("Your User ID: " + results[0]["id"])
        if (verbose) {
            console.log("\x1b[34m", "<INFO> " + req.ip + " logged in to the account \"" + req.body["username"] + "\"")
        }
        
        
    }
    else {
        res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
            }
            else {
                res.status(400).send("Invalid password format\n(Must be between 8-256 characters)")
            }
        }
        else {
            res.status(400).send("Invalid username format\n(Letters a-z, numbers and underscores)")
        }
        }
        else {
            res.status(400).end()
        }
          
        
        
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }
    
})
async function parseJwt (token) {
    try {
        var result = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

        if (disableSignatureCheck == false) {
        var checktoken = jwt.sign(result, secret, { algorithm: "HS256" })

        if (checktoken == token) {
            if (disableHashCheck) {
                return result
            }
            else {
                 const [results, fields] =  await connection.query(
        'SELECT password FROM bfdibranchesaccount WHERE username = ?',[result["username"]]
    );

    if (results.length > 0) {
        var hash1 = hash(results[0]["password"])
        
        if (hash1 == result["jwtid"]) {
            return JSON.parse("{\"password\": \"" + results[0]["password"] + "\"}")
        } 
        else {
            return " "
        }
    }
    else {
        
        return " "
    }
            }
        }
        else {
            return " "
        }
        }
        else {
            if (disableHashCheck) {
                return result
            }
            else {
                 const [results, fields] =  await connection.query(
        'SELECT password FROM bfdibranchesaccount WHERE username = ?',[result["username"]]
    );

    if (results.length > 0) {
        var hash1 = hash(results[0]["password"])
        if (hash1 == result["jwtid"]) {
            return { "password": results[0]["password"] }
        } 
        else {
            return " "
        }
    }
    else {
        return " "
    }
            }
        }
        
    }
    catch (err) {
        return " "
    }
}

app.post("/completelevel.php", async (req, res) => {
   try {
        if (disableLevelCompletion == false) {
              // don't cheat!!! (otherwise you may get banned if you abuse their api, especially clearing D10 and D9 levels, but here, you can't get banned)
    var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            let isnum = /^\d+$/.test(req.body["levelid"])
     if (isnum) {
    password = passresult["password"]
    const [results, fields] = await connection.query("SELECT id, branchcoins, points,backgroundsowned FROM bfdibranchesaccount WHERE username = ? AND password = ?",[req.body["username"],password])
    if (results.length > 0) {
        const [results2, fields2] = await connection.query("SELECT peoplebeaten, worldrecordtime, title, spotlight, difficulty,firstcompleter,username FROM bfdibrancheslevel WHERE id = ?",[parseInt(req.body["levelid"])])
        if (results2.length > 0) {
            if (disableInventoryCheck == false && results[0]["backgroundsowned"].includes(",86,") || results[0]["backgroundsowned"].startsWith("[86") || results[0]["backgroundsowned"].endsWith(",86]")) {
                //do nothing, also branches programmers, if you see this, say hi!
                
            }
            else {
                if (req.body["multiplayer"] != undefined && req.body["multiplayer"] > 0) {
                    const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET backgroundsowned = ? WHERE username = ? AND password = ?',[results[0]["backgroundsowned"].replace("]", "") + ",86]",req.body["username"], password])
                if (results1["affectedRows"] > 0) {
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " got the mulitplayer achievement!")
            }
        }
                }
            }
            if (results2[0]["peoplebeaten"].toString().includes("," + results[0]["id"].toString() + ",") || results2[0]["peoplebeaten"].toString().startsWith("[" + results[0]["id"].toString() + ",") || results2[0]["peoplebeaten"].toString().endsWith("," + results[0]["id"].toString() + "]") || results2[0]["peoplebeaten"] == "[" + results[0]["id"].toString() + "]") {
                if (parseFloat(req.body["time"]) < parseFloat(results2[0]["worldrecordtime"])) {
                    if (req.body["time"].toString().endsWith(.00)) { req.body["time"] = req.body["time"].slice(0,-3) }
                    var [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET worldrecordtime = ?, worldrecordholder = ? WHERE id = ?", [req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    if (results3["affectedRows"] > 0) {
                        res.status(200).end()
                        if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " completed \"" + results2[0]["title"] +"\" with " + req.body["time"] + " seconds.")
                         }
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    res.status(200).end()
                    if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " completed \"" + results2[0]["title"] +"\" with " + req.body["time"] + " seconds.")
                         }
                }
            }
            else {
                if (results2[0]["peoplebeaten"] == "[]") {
                    if (!req.body["time"].toString().includes(".")) { req.body["time"] = req.body["time"].slice(0,-2) }
                    var [results3, fields3] = []
                    if ((results2[0]["username"] != req.body["username"] && ignoreCreatorAsFirstCompleter == true) || ignoreCreatorAsFirstCompleter == false) {
                        await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ?, firstcompleter = ?,worldrecordtime = ?, worldrecordholder = ?  WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + results[0]["id"].toString() + "]",req.body["username"], req.body["username"], req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    }
                    else {
                        await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ?, worldrecordtime = ?, worldrecordholder = ?  WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + results[0]["id"].toString() + "]",req.body["username"], req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    }
                    if (results3["affectedRows"] > 0) {
                        if (results2[0]["spotlight"] > 0) 
                        {
                            const [results4, fields4] = await connection.query("UPDATE bfdibranchesaccount SET points = ?, branchcoins = ? WHERE id = ?",[results[0]["points"] + results2[0]["difficulty"], results[0]["branchcoins"] + calculateBranchCoinsFromDifficulty(results2[0]["difficulty"]),results[0]["id"]])
                            if (results4["affectedRows"] > 0) 
                            {
                                res.status(200).end()
                            }
                            else {
                            res.status(400).end()
                            }
                        }
                        else {
                            res.status(200).end()
                        }
                        if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " completed \"" + results2[0]["title"] +"\" with " + req.body["time"] + " seconds.")
                         }
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    var [results3, fields3] = []
                    if ((results2[0]["username"] != req.body["username"] && ignoreCreatorAsFirstCompleter == true) && (results2[0]["firstcompleter"] == null || results2[0]["firstcompleter"] == undefined) || (ignoreCreatorAsFirstCompleter == false && (results2[0]["firstcompleter"] == null || results2[0]["firstcompleter"] == undefined))) {
                        [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ?, firstcompleter = ? WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + "," + results[0]["id"].toString() + "]",req.body["username"], req.body["username"], parseInt(req.body["levelid"])])
                    }
                    else {
                        [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ? WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + "," + results[0]["id"].toString() + "]",req.body["username"], parseInt(req.body["levelid"])])
                    }
                 if (parseFloat(req.body["time"]) > parseFloat(results2[0]["worldrecordtime"])) {
                    if (!req.body["time"].toString().includes(".")) { req.body["time"] = req.body["time"].slice(0,-2) }
                    const [resultt4, fields4] = await connection.query("UPDATE bfdibrancheslevel SET worldrecordtime = ?, worldrecordholder = ? WHERE id = ?", [req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    
                    if (results3["affectedRows"] > 0) {
                        if (results2[0]["spotlight"] > 0) 
                        {
                            const [results4, fields4] = await connection.query("UPDATE bfdibranchesaccount SET points = ?, branchcoins = ? WHERE id = ?",[results[0]["points"] + results2[0]["difficulty"], results[0]["branchcoins"] + calculateBranchCoinsFromDifficulty(results2[0]["difficulty"]),results[0]["id"]])
                            if (results4["affectedRows"] > 0) 
                            {
                                res.status(200).end()
                            }
                            else {
                            res.status(400).end()
                            }
                        }
                        else {
                            res.status(200).end()
                        }
                        if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " completed \"" + results2[0]["title"] +"\" with " + req.body["time"] + " seconds.")
                         }
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    if (results2[0]["spotlight"] > 0) 
                        {
                            const [results4, fields4] = await connection.query("UPDATE bfdibranchesaccount SET points = ?, branchcoins = ? WHERE id = ?",[results[0]["points"] + results2[0]["difficulty"], results[0]["branchcoins"] + calculateBranchCoinsFromDifficulty(results2[0]["difficulty"]),results[0]["id"]])
                            if (results4["affectedRows"] > 0) 
                            {
                                res.status(200).end()
                            }
                            else {
                            res.status(400).end()
                            }
                        }
                        else {
                            res.status(200).end()
                        }
                    if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.body["username"] + " completed \"" + results2[0]["title"] +"\" with " + req.body["time"] + " seconds.")
                         }
                }
                }
            }
        }
    }
    else {
        res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
     }
     else {
        res.status(400).send("Invalid format for level id")
     }
        }
        else {
            res.status(400).end()
        }
        })
    
     
        }
        else {
            res.status(200).end()
        }
   } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }

}) 

function calculateBranchCoinsFromDifficulty(difficulty)
{
    switch (difficulty) 
    {
        case 0:
        return 5
        case 1:
        return 25
        case 2:
        return 50
        case 3:
        return 75
        case 4:
        return 100
        case 5:
        return 150
        case 6:
        return 250
        default:
        return 500
    }

}
app.post("/getprofile.php", async (req, res) => {
    try {
        if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            var [results,fields] = []
            if (parseFloat(version.slice(0,3)) > 0.1) {
             [results, fields] =  await connection.query(
        'SELECT id,username,bio,date,branchcoins,moderator,badges,foreground,background,frame,usernameColor,points FROM bfdibranchesaccount WHERE username = ?',[req.body["username"]]
    );
            }
            else {
                [results, fields] =  await connection.query(
        'SELECT id,username,bio,date,branchcoins,moderator,badges,foreground,background,frame,usernameColor,lastonline FROM bfdibranchesaccount WHERE username = ?',[req.body["username"]]
    );
            }
   if (results.length == 0) 
    { res.send("{}") } 
   else { 
    if (usernameColorBadgesExploitFix == false) {
        res.send(results[0])
    }
    else {
        if (results[0]["usernameColor"].startsWith("Object(")) {
            results[0]["usernameColor"] = "[0,0]"
        }
        if (results[0]["badges"].startsWith("Object(")) {
            results[0]["badges"] = "[]"
        }
        res.send(results[0])
    }
     }
        }
        else {
            res.status(400).end()
        }
      
    } catch (err) {
        console.log("\x1b[31m", "<ERROR> " + err)
        res.status(400).end()
    }

})

app.post("/moderation/getlevelinfo.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
              if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT moderator FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        let isnum = /^\d+$/.test(req.body["id"])
         if (isnum) {
            if (results[0]["moderator"] >= 1) {
            const [results1, fields1] = await connection.query("SELECT title, icon, deleted, username, date, description, difficulty FROM bfdibrancheslevel WHERE id = ?", [req.body["id"]])
            results1[0]["user"] = results1[0]["username"]
            res.status(200).send(results1)
        } else {
            res.status(403).send("Not a moderator")
        }    
         }
         else {
            res.status(400).send("Invalid format for level id")
         }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        }) 
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/moderation/getreports.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT moderator FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {

            if (results[0]["moderator"] >= 1) {
                var [results1, fields1] = []
                if (req.body["resolved"] == 1) {
                    [results1, fields1] =  await connection.query('SELECT reportid,leveltitle,levelid,levelcreatorname,levelcreatorid,reportername,date,resolved,description FROM bfdibranchesreport WHERE resolved = 0 ORDER BY reportid DESC LIMIT ?,10',[req.body["page"] * 10]);
                }
                else {
                     [results1, fields1] =  await connection.query('SELECT reportid,leveltitle,levelid,levelcreatorname,levelcreatorid,reportername,date,resolved,description FROM bfdibranchesreport ORDER BY reportid DESC LIMIT ?,10',[req.body["page"] * 10]);
                }
                if (results1.length > 0) {
                    for (var i = 0; i < results1.length; i++) {
                    results1[i]["reporter"] = results1[i]["reportername"]
                    const [results2, fields2] = await connection.query('SELECT reportid FROM bfdibranchesreport WHERE levelid = ?', [results1[i]["levelid"]])
                    if (results2.length > 0) {
                        results1[i]["totalreports"] = results2.length
                    }
                }
                res.send(results1)
                }
                else {
                    res.status(200).end()
                }
        } else {
            res.status(403).send("Not a moderator...")
        }    
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/moderation/changelevelinfo.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
          if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT moderator FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        let isnum = /^\d+$/.test(req.body["levelid"])
         if (isnum) {
            if (results[0]["moderator"] == 2) {
                if (req.body["spotlight"] == null) req.body["spotlight"] = 0;
            const [results1, fields1] = await connection.query("UPDATE bfdibrancheslevel SET spotlight = ?, difficulty = ? WHERE id = ?", [req.body["spotlight"], req.body["difficulty"],req.body["levelid"]])
            if (results1["affectedRows"] > 0) {
                res.status(200).send("Level changed!")

            }
            else {
                res.status(400).send("Something went wrong")
            }
        } else {
            res.status(403).send("Not a moderator or not the highest")
        }    
         }
         else {
            res.status(400).send("Invalid format for level id")
         }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }  
        })
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/reportlevel.php", async (req, res) => {
        try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
       let isnum = /^\d+$/.test(req.body["levelid"])
       if (isnum) {
        const [results2, fields2] =  await connection.query(
        'SELECT title, username FROM bfdibrancheslevel WHERE id = ?',[req.body["levelid"]]
    );
if (results2.length > 0) {
    const [results3, fields3] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ?',[results2[0]["username"]]
    );

    if (results3.length > 0) {
        var datet = new Date(Date.now())
         const [results4, fields4] =  await connection.query(
        'INSERT INTO bfdibranchesreport (leveltitle,levelid,levelcreatorname,levelcreatorid,reportername,date,description) VALUES (?,?,?,?,?,?,?)',[results2[0]["title"],req.body["levelid"],results2[0]["username"],results3[0]["id"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate().toString().padStart(2,"0") + " " + datet.getHours().toString().padStart(2,"0") + ":" + datet.getMinutes().toString().padStart(2,"0"),req.body["description"]]
    );
        if (results4["affectedRows"] > 0) {
            res.status(200).send("Level reported")
                if (verbose) {
                    console.log("\x1b[34m", "<INFO> " + req.body["username"] + " reported the level \"" + results2[0]["title"] + "\" by " + results2[0]["username"] + ".")
                }
        }
    }
}
       }
        else {
            res.status(400).send("Invalid format for level id")
         }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
        
       
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/delete.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        const [results1, fields1] = await connection.query("SELECT username FROM bfdibrancheslevel WHERE id = ?", [req.body["levelid"]])
        if (results1.length > 0) {
            if (results1[0]["username"] == req.body["username"]) {
                const [results2, fields2] = await connection.query("UPDATE bfdibrancheslevel SET deleted = 1 WHERE id = ?", [req.body["levelid"]])
                if (results2["affectedRows"] > 0) {
                    res.status(200).send("Level deleted")
                    if (verbose) {
                        console.log("\x1b[34m", "<INFO> " + req.body["username"] + " deleted the level " + req.body["levelid"])
                    }
                }
                else {
                    res.status(500).send("Something went wrong")
                }
            }
            else {
                res.status(400).end()
            }
        }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

app.post("/changelevelinfo.php", async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])
        password.then(async function(passresult) {
            if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
        password = passresult["password"]
        const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        const [results1, fields1] = await connection.query("SELECT username FROM bfdibrancheslevel WHERE id = ?", [req.body["levelid"]])
        if (results1.length > 0) {
            if (results1[0]["username"] == req.body["username"]) {
                const [results2, fields2] = await connection.query("UPDATE bfdibrancheslevel SET description = ?, icon = ?, title = ? WHERE id = ?", [req.body["newdescription"],req.body["newicon"],req.body["newtitle"],req.body["levelid"]])
                if (results2["affectedRows"] > 0) {
                    res.status(200).send("Level info changed")
                    if (verbose) {
                        console.log("\x1b[34m", "<INFO> " + req.body["username"] + " changed the level info of " + req.body["levelid"])
                    }
                }
                else {
                    res.status(500).send("Something went wrong")
                }
            }
            else {
                res.status(400).end()
            }
        }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        })
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
})

function regexOutsideChecker(regex, content) {
    if (content != "") {
        var re = RegExp("[a-z_0-9]+")
    var array = re.exec(content)
    var length = 0
    for (var i = 0; i < array.length; i++) {
        length = length + array[i].length
    }
    if (length == content.length) {
        return false;
    }
    else {
        return true;
    }
    }
    else {
        return true;
    }
}
app.post("/changeaccountinfo.php", async (req, res) => {
     try {
        if (blockOtherUserAgent == false || req.headers["user-agent"] != undefined && req.headers["user-agent"].startsWith("GodotEngine")) 
        {
            const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], req.body["password"]]
    );

    if (results.length > 0) {
        if (regexOutsideChecker("[a-z_0-9]+", req.body["newusername"]) == false && req.body["newusername"].length >= 3) {
            if (req.body["newpassword"].length >= 8) {
        const [results1, fields1] = await connection.query("UPDATE bfdibranchesaccount SET username = ?, password = ? WHERE username = ? AND password = ?",[req.body["newusername"],req.body["newpassword"],req.body["username"],req.body["password"]])
        if (results1["affectedRows"] > 0) {
            const [results2, fields2] = await connection.query("SELECT id FROM bfdibranchesaccount WHERE username = ?", [req.body["newusername"]])
            if (results2.length > 0) {
                      var token = jwt.sign({"password":req.body["password"]}, secret,{algorithm: 'HS256'})
        res.set({
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'X-Token': token
        })
                res.status(200).send("Changed Info\nYour User ID: " + results2[0]["id"])
            }
            else {
                res.status(400).end()
            }
        }
            }
            else {
                res.status(400).send("Invalid password format\n(Must be between 8-256 characters)")
            }

        }
    else {
        res.status(400).send("Invalid username format\n(Letters a-z, numbers and underscores)")
    }
    }
    else {
     res.status(401).send("Invalid Info")
            if (verbose) {
                console.log("\x1b[34m", "<INFO> " + req.ip + " attempted to access with an invalid info.")
            }
    }
        }
        else {
            res.status(400).end()
        }
        
    }
     catch (err) {
     console.log("\x1b[31m", "<ERROR> " + err)
     res.status(400).end()
    }
}) 

app.post("/forgotpassword/passwordreset.php", (req, res) => {
    console.log("\x1b[34m", "<STUB> /forgotpassword/passwordreset.php return 501")
    res.status(501).end()
})

app.use((req, res)=>{
  res.status(404).send({message:"Not Found"});
  console.log("\x1b[33m", "<WARN> NOT IMPLEMENTED: \"" + req.protocol + "://" + req.get("host") + req.originalUrl + "\" (" + req.method + ")")
})

function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
        h = 31 * h + s.charCodeAt(i);
    }
    return h;
}

async function resetAward() {
        var datet = new Date(Date.now())
    if (datet.toLocaleString('en-us', {  weekday: 'long' }) == "Friday") {
        const [results1, fields1] = await connection.query("UPDATE bfdibranchesaccount SET rewardavailable = 1")
        if (results1["affectedRows"] > 0)
        {
        if (verbose) {
        console.log("\x1b[34m", "<INFO> Reseted every user's daily award envelope")
        }
        }
        else {
            if (verbose) {
        console.log("\x1b[31m", "<ERROR> Something went wrong while attempting to reset every user's daily award envelope!")
        }
        }
    }
    await delay(8.64e+7)
    resetAward()
}

app.listen(port, () => {
    if (verbose) {
        console.log("\x1b[34m", "<INFO> Server started up on port " + port)
    }
    if (disableSignatureCheck == true) {
    console.warn("\x1b[33m","<WARN> Disabling the password signature check can cause the server to be less secure and more prone to hackers from outside the game! We would strongly recommend enabling this for extra protection!")
}
if (disableHashCheck == true) {
    console.warn("\x1b[33m","<WARN> Disabling the hashing check and method for password is not recommended as hackers can obtain your password via methods! We would strongly recommend enabling this for extra protection!")
}
    if (enableResetDailyAward) {
        resetAward()
    }
    if (serverSync["version"] == true) {
        try {
            const options = {
                hostname: "api.bfdibranches.com",
                path: "/version.php",
                headers: {
                    'User-Agent': 'totallychrome'
                }
            }

            http.get(options, (response) => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk.toString()
                })

                response.on('end', () => {
                    version = data
                    console.log("\x1b[34m", "<INFO> Version string synced with official server")
                })
            })
        }
        catch (err) {
            console.log("\x1b[31m", "<ERROR> " + err)
        }
    }
    if (serverSync["shopItems"] == true) {
        try {
            const options = {
                hostname: "api.bfdibranches.com",
                path: "/static/pfpshopitems.php",
                headers: {
                    'User-Agent': 'totallychrome'
                }
            }

            http.get(options, (response) => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk.toString()
                })

                response.on('end', () => {
                    shopitems = data
                    const options1 = {
                hostname: "api.bfdibranches.com",
                path: "/static/pfpshopitemsYF.php",
                headers: {
                    'User-Agent': 'totallychrome'
                }
            }

            http.get(options, (response) => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk.toString()
                })

                response.on('end', () => {
                    YFshopitems = data
                    console.log("\x1b[34m", "<INFO> Shop items synced with official server")
                })
            })
                })
            })
        }
        catch (err) {
            console.log("\x1b[31m", "<ERROR> " + err)
        }
    }
    if (serverSync["extraCredits"] == true) {
        try {
            const options = {
                hostname: "api.bfdibranches.com",
                path: "/static/extraCredits.txt",
                headers: {
                    'User-Agent': 'totallychrome'
                }
            }

            http.get(options, (response) => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk.toString()
                })

                response.on('end', () => {
                    if (fs.existsSync("./extraCredits.txt")) fs.unlinkSync("./extraCredits.txt")
                    fs.writeFileSync("./extraCredits.txt", data)
                    console.log("\x1b[34m", "<INFO> Extra credits file synced with official server")
                })
            })
        }
        catch (err) {
            console.log("\x1b[31m", "<ERROR> " + err)
        }
    }
})
