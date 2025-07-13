//screw you ai, lol, this is better than your goofy ahh way of coding, learn how to code instead of vibe coding!

//idk why bfdi branches' server uses a lot of post requests instead of using get requests with params.

//imports

import express from 'express'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

//variables
const app = express()
var shopitems = '{ "fg": { "69": 1000, "73": 500, "24": 500, "25": 500, "34": 500, "30": 500, "43": 500, "31": 500, "41": 500, "57": 500, "32": 500, "42": 500, "33": 500, "36": 500, "72": 500, "78": 500, "84": 500, "7": 1000, "18": 1000, "8": 1000, "16": 1000, "5": 1000, "17": 1000, "15": 1000, "11": 1000, "9": 1000, "14": 1000, "19": 1000, "12": 1000, "20": 1000, "6": 1000, "13": 1000, "10": 1000, "21": 1000, "62": 1000, "65": 1000, "66": 1000, "68": 1000, "67": 1000, "4": 4000, "40": 4000, "22": 4000, "63": 4000, "37": 7000, "35": 7000, "1010": 7000, "44": 15000, "59": 7000, "61": 7000, "64": 7000, "83": 7000 }, "bg": { "8": 500, "9": 500, "10": 500, "11": 500, "12": 500, "33": 500, "34": 500, "35": 500, "37": 500, "36": 500, "38": 500, "39": 500, "13": 1000, "14": 1000, "20": 1000, "24": 1000, "21": 1000, "22": 1000, "23": 1000, "42": 1000, "43": 1000, "48": 1000, "49": 1000, "66": 1000, "67": 1000, "68": 1000, "69": 1000, "32": 1500, "15": 1500, "16": 1500, "17": 1500, "64": 1500, "18": 1500, "19": 1500, "25": 1500, "26": 1500, "27": 1500, "28": 1500, "29": 1500, "30": 1500, "31": 1500, "44": 1500, "45": 1500, "46": 1500, "70": 1500, "71": 1500, "65": 1500 } }'
var version = "0.1.6.2"
var port = 3000
app.use(express.json())

const connection = await mysql.createConnection({
    // PUT YOUR OWN DATABASE IN AND I WOULD RECOMMEND PUTTING THE PASSWORD IN IT!!!
    host: 'localhost',
    user: 'root',
    database: 'bfdibranches',
});


//code

app.get('/', (req, res) => {
    //obviously
    res.status(200).send('OK');
});


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
        var password = parseJwt(req.body["password"])["password"]
        
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

                }
                else {
                    res.status(500).end()
                }
                }
               
            }
            else {
                res.status(400)
                res.send("You don't own this pfp")
            }
        }
        else {
            res.status(401)
            res.send("Invalid Info")
        }
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.post('/editprofile.php', async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])["password"]
        
         const [results, fields] =  await connection.query(
        'UPDATE bfdibranchesaccount SET bio = ? WHERE username = ? AND password = ?',[req.body["bio"],req.body["username"], password]
    );
        if (results["affectedRows"] > 0) {
            res.status(200).send("Changed bio")
        }
        else {
            res.status(401).send("Invalid Info")
        }
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.get("/static/leaderboards/0.json", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id, points, user_rank, username,foreground,background,frame,usernameColor,bio,date,branchcoins,moderator,badges FROM bfdibranchesaccount ORDER BY user_rank LIMIT 100'
    );
        for (var i = 0; i < results.length; i++) {
        results[i]["id"] =  results[i]["id"].toString()
        results[i]["foreground"] =  results[i]["foreground"].toString()
        results[i]["background"] =  results[i]["background"].toString()
        results[i]["moderator"] =  results[i]["moderator"].toString()
        results[i]["points"] = results[i]["points"].toString()
        results[i]["frame"] = results[i]["frame"].toString()
        results[i]["branchcoins"] = results[i]["branchcoins"].toString()
    }
        res.send(JSON.stringify(results).replaceAll("Account Created: ", "").replaceAll("\"id\":","\"userid\":"))
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }
})

app.post("/static/leaderboards/0.json", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id, points, user_rank, username,foreground,background,frame,usernameColor,bio,date,branchcoins,moderator,badges FROM bfdibranchesaccount ORDER BY user_rank LIMIT 100'
    );
        for (var i = 0; i < results.length; i++) {
        results[i]["id"] =  results[i]["id"].toString()
        results[i]["foreground"] =  results[i]["foreground"].toString()
        results[i]["background"] =  results[i]["background"].toString()
        results[i]["moderator"] =  results[i]["moderator"].toString()
        results[i]["points"] = results[i]["points"].toString()
        results[i]["frame"] = results[i]["frame"].toString()
        results[i]["branchcoins"] = results[i]["branchcoins"].toString()
    }
        res.send(JSON.stringify(results).replaceAll("Account Created: ", "").replaceAll("\"id\":","\"userid\":"))
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }
})

app.post("/static/pfpshopitems.json", (req, res) => {
    res.send(shopitems)
})
app.get("/static/pfpshopitems.json", (req, res) => {
    res.send(shopitems)
})
app.post("/getpfpinventory.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
        const [results, fields] =  await connection.query(
        'SELECT foreground, background, branchcoins, backgroundsowned, foregroundsowned FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        
      res.status(200).send("[[" + results[0]["foreground"] + "," + results[0]["background"] + "," + results[0]["branchcoins"] + ",0]," + results[0]["foregroundsowned"] + "," + results[0]["backgroundsowned"] + ",[0]]")
    }
    else {
     res.status(401).send("Invalid Info")
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/weeklyreward/reward.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])["password"]
        var [results, fields] =  await connection.query(
        'SELECT branchcoins,rewardavailable FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );
    if (results.length > 0) {
        var coins = results[0]["branchcoins"]
        const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, rewardavailable = 0 WHERE username = ? AND password = ?',[parseInt(coins) + 700,req.body["username"], password])

        if (results1["affectedRows"] > 0) {
            res.send("1234567890")
        }
        else {
            res.status(400).end()
        }
    }
    else {
     res.status(401).send("Invalid Info")
    }
}
catch (err) {
     console.log(err)
     res.status(400).end()
    }
})
app.post("/pfpshop.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])["password"]
        var [results, fields] =  await connection.query(
        'SELECT branchcoins,foregroundsowned,backgroundsowned,rewardavailable FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
        var coins = results[0]["branchcoins"]
        var foregrounds1 = results[0]["foregroundsowned"]
        var backgrounds1 = results[0]["backgroundsowned"]
        if (req.body["mode"] == "get") {
            res.status(206)
            var result = ""
            for (var i = 0; i < results[0]["foregroundsowned"].split(',').length; i++) {
                var foregrounds = results[0]["foregroundsowned"].slice(0,-1).slice(1).split(',')
                    result = result + '{"type":0,"pfpid":' + foregrounds[i] + "},"         
            }
            for (var i = 0; i < results[0]["backgroundsowned"].split(',').length; i++) {
                var backgrounds = results[0]["backgroundsowned"].slice(0,-1).slice(1).split(',')
                    if (i == backgrounds.length - 1) {
                        result = result + '{"type":1,"pfpid":' + backgrounds[i] + "}" 
                    }   
                    else {
                        result = result + '{"type":1,"pfpid":' + backgrounds[i] + "}," 
                    }     
            }
            res.send("[" + results[0]["branchcoins"] + "," + results[0]["rewardavailable"] + ",[" + result + "]]")
        }
        else if (req.body["mode"] == "buy") {
            if (req.body["pfptype"] == 0) {
            var shopitemsobject = JSON.parse(shopitems)
            if (results[0]["branchcoins"] >= shopitemsobject["fg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, foregroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject["fg"][req.body["pfpid"]]), foregrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])
                if (results1["affectedRows"] > 0) {
            res.status(200)
            res.send("1234567890")
        }
        else {
            res.status(401)
            res.send("um")
        }
            }
            }
            else  if (req.body["pfptype"] == 1) {
            var shopitemsobject = JSON.parse(shopitems)
            if (results[0]["branchcoins"] >= shopitemsobject["bg"][req.body["pfpid"]]) {
                const [results1, fields1] = await connection.query('UPDATE bfdibranchesaccount SET branchcoins = ?, backgroundsowned = ? WHERE username = ? AND password = ?',[parseInt(coins) - parseInt(shopitemsobject["bg"][req.body["pfpid"]]), backgrounds1.replace("]", "") + "," + req.body["pfpid"] + "]",req.body["username"], password])   
                if (results1["affectedRows"] > 0) {
            res.status(200)
            res.send("1234567890")
        }
        else {
            res.status(401)
            res.send("um")
        }
            }
            }
        }
    }
    else {
     res.status(401)
     res.send("Invalid Info")
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})
app.post("/moderation/checkifmoderator.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
        const [results, fields] =  await connection.query(
        'SELECT moderator FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (results.length > 0) {
         if (results[0]["moderator"] == 0) {
        res.status(403).send(403)
    }    
    else if (results[0]["moderator"] == 1) {
        res.status(200).send(200)
    }
    else if (results[0]["moderator"] == 2) {
        res.status(201).send(201)
    }    
    }
    else {
     res.status(401).send("Invalid Info")
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.get("/static/levels/" + ":id" + ".json", async (req, res) => {
    let isnum = /^\d+$/.test(req.params.id)
    if (isnum) {
        const [results, fields] =  await connection.query(
        'SELECT data,dataLen FROM bfdibrancheslevel WHERE deleted = 0 AND id = ?',[req.params.id]
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
})

app.post("/getlevel.php", async (req, res) => {
let isnum = /^\d+$/.test(req.body["id"].toString())
console.log("t")
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
})

app.post("/static/levels/" + ":id" + ".json", async (req, res) => {
let isnum = /^\d+$/.test(req.params.id)
    if (isnum) {
        const [results, fields] =  await connection.query(
        'SELECT data,dataLen FROM bfdibrancheslevel WHERE id = ?',[req.params.id]
    );
    if (results.length > 0) {
        res.send(results)
    }
    else {
        res.status(400).end()
    }
    }
    else {
        res.status(400).end()
    }
})

app.post("/getlist.php", async (req, res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
        const [results, fields] =  await connection.query(
        'SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );

    if (req.body["password"] != "" || req.body["username"] != "") {
        if (results.length == 0) {
     res.status(401).send("Invalid Info")
     return
    }
    }
       if (req.body["searchtype"] == "level") {
        if (req.body["searchtitle"] != "") {
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
                             res.status(400)
                            res.end()
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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

                            if (peoplebeatenarray.length > 1) {
                                 results1[i]["date"] =  peoplebeatenarray.length + " Completions\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
                            }
                            else {
                                results1[i]["date"] =  peoplebeatenarray.length + " Completion\n---------------------\nWR: " + results1[i]["worldrecordtime"].toString() + " by\n" + results1[i]["worldrecordholder"] + "\n---------------------\nFirst Completer:\n" + results1[i]["firstcompleter"] + "\n---------------------\nLast Completer:\n" + results1[i]["lastcompleter"] + "\n---------------------\nUpload Date:\n" + results1[i]["date"] + " \n---------------------\n Creator Time:\n" + results1[i]["creatortime"]
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
catch (err) {
     console.log(err)
     res.status(400).end()
    }
})  


app.post("/upload.php", async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])["password"]
        const [results, fields] =  await connection.query(
        'SELECT id, background, foreground FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], password]
    );
    if (results.length > 0) {
        if (req.body["replaceid"] != "") {
            var datet = new Date(Date.now())
        const [results1, fields1] = await connection.query("SELECT username, levelVersion FROM bfdibrancheslevel WHERE id = ?",[req.body["replaceid"]])
            if (results1.length > 0) {
                   if (results1[0]["username"] != req.body["username"]) {
            res.status(403).send("You do not own this level")
        }
        else {
const [results2, fields2] = await connection.query("UPDATE bfdibrancheslevel SET title = ?, description = ?, difficulty = 0, icon = ?, data = ?, dataLen = ?,creatortime = ?,username = ?,date = ?,background = ?,foreground = ?,version = ?, levelVersion = ?,worldrecordholder='Nobody',worldrecordtime='0.00',firstcompleter='Nobody',lastcompleter='Nobody',peoplebeaten='[]', spotlight = 0 WHERE id = ? AND deleted = 0",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate() + " " + datet.getHours() + ":" + datet.getMinutes(),results[0]["background"],results[0]["foreground"],version,results1[0]["levelVersion"] + 1, req.body["replaceid"]])
        if (results2["affectedRows"] > 0) {
            res.status(200).send("Published!")
        }
        else {
            res.status(400).send("Something went wrong")
        }
        }
            }
            else {
                 res.status(404).send("This level doesn't exist")
            }
        }
        else {
            var datet = new Date(Date.now())
        const [results1, fields1] = await connection.query("INSERT INTO bfdibrancheslevel (title, description, difficulty, icon, data, dataLen,creatortime,username,date,background,foreground,version) VALUES (?, ?, 0, ?, ? ,?, ?, ?, ?,?,?,?)",[req.body["title"],req.body["description"],parseInt(req.body["icon"]),req.body["data"],parseInt(req.body["dataLen"]),req.body["creatortime"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate() + " " + datet.getHours() + ":" + datet.getMinutes(),results[0]["background"],results[0]["foreground"],version])
        if (results1["affectedRows"] > 0) {
            res.status(200).send("Published!")
        }
        else {
            res.status(400).send("Something went wrong")
        }
        }
    }
    else {
     res.status(401).send("Invalid Info")
    }
}
catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/signup.php", async (req, res) => {
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
        const [results1, field1] = await connection.query("INSERT INTO bfdibranchesaccount (username, password, date, lastonline,user_rank) VALUES (?, ?, ?, ?,?)",[req.body["username"],req.body["password"],"Account Created: " + datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate() + " " + datet.getHours() + ":" + datet.getMinutes(), datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate() + " " + datet.getHours() + ":" + datet.getMinutes(),parseInt(results.length + 1)])

        if (results1["affectedRows"] > 0) {
              var token = jwt.sign({"password":req.body["password"]}, 'bfdibranchessecrettestthatis256b',{algorithm: 'HS256'})
        res.set({
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'X-Token': token
        })
        res.send("Account Created!\nYour ID is " + (parseInt(results.length) + 1).toString())
        }
    }
})
app.post("/login.php", async (req, res) => {
     try {
        const [results, fields] =  await connection.query(
        'SELECT id, username, password FROM bfdibranchesaccount WHERE username = ? AND password = ?',[req.body["username"], req.body["password"]]
    );
    if (JSON.stringify(results) != "[]") {
        var token = jwt.sign({"password":req.body["password"]}, 'bfdibranchessecrettestthatis256b',{algorithm: 'HS256'})
        res.set({
            'X-Powered-By': 'Express',
            'Content-Type': 'text/html; charset=utf-8',
            'X-Token': token
        })
        res.send("Your User ID: " + results[0]["id"])
        
        
        
    }
    else {
        res.status(401).send("Invalid Info")
    }
        
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }
    
})
function parseJwt (token) {
    try {
        var result = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        var checktoken = jwt.sign(result, "bfdibranchessecrettestthatis256b", { algorithm: "HS256" })

        if (checktoken == token) {
            return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        }
        else {
            return "INVALID"
        }
        
    }
    catch (err) {
        return "INVALID"
    }
}

app.post("/completelevel.php", async (req, res) => {
   try {
    // don't cheat!!!
     let isnum = /^\d+$/.test(req.body["levelid"])
     if (isnum) {
        var password = parseJwt(req.body["password"])["password"]
    const [results, fields] = await connection.query("SELECT id FROM bfdibranchesaccount WHERE username = ? AND password = ?",[req.body["username"],password])
    if (results.length > 0) {
        const [results2, fields2] = await connection.query("SELECT peoplebeaten, worldrecordtime FROM bfdibrancheslevel WHERE id = ?",[parseInt(req.body["levelid"])])
        if (results2.length > 0) {
            
            if (results2[0]["peoplebeaten"].toString().includes("," + results[0]["id"].toString() + ",") || results2[0]["peoplebeaten"].toString().startsWith("[" + results[0]["id"].toString() + ",") || results2[0]["peoplebeaten"].toString().endsWith("," + results[0]["id"].toString() + "]") || results2[0]["peoplebeaten"] == "[" + results[0]["id"].toString() + "]") {
                if (parseFloat(req.body["time"]) < parseFloat(results2[0]["worldrecordtime"])) {
                    const [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET worldrecordtime = ?, worldrecordholder = ? WHERE id = ?", [req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    
                    if (results3["affectedRows"] > 0) {
                        res.status(200).send("Level completed")
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    res.status(200).send("Level completed")
                }
            }
            else {
                if (results2[0]["peoplebeaten"] == "[]") {
                    const [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ?, firstcompleter = ?,worldrecordtime = ?, worldrecordholder = ?  WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + results[0]["id"].toString() + "]",req.body["username"], req.body["username"], req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    if (results3["affectedRows"] > 0) {
                        res.status(200).send("Level completed")
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    const [results3, fields3] = await connection.query("UPDATE bfdibrancheslevel SET peoplebeaten = ?, lastcompleter = ? WHERE id = ?", [results2[0]["peoplebeaten"].toString().slice(0,-1) + "," + results[0]["id"].toString() + "]",req.body["username"], parseInt(req.body["levelid"])])
                 if (parseFloat(req.body["time"]) > parseFloat(results2[0]["worldrecordtime"])) {
                    const [resultt4, fields4] = await connection.query("UPDATE bfdibrancheslevel SET worldrecordtime = ?, worldrecordholder = ? WHERE id = ?", [req.body["time"], req.body["username"], parseInt(req.body["levelid"])])
                    
                    if (results3["affectedRows"] > 0) {
                        res.status(200).send("Level completed")
                    }
                    else (
                        res.status(400).end()
                    )
                }
                else {
                    res.status(200).send("Level completed")
                }
                }
            }
        }
    }
    else {
        res.status(401).send("Invalid Info")
    }
     }
     else {
        res.status(400).send("Invalid format for level id")
     }
   } catch (err) {
        console.log(err)
        res.status(400).end()
    }

}) 
app.post("/getprofile.php", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id,username,bio,date,branchcoins,moderator,badges,foreground,background,frame,usernameColor,lastonline FROM bfdibranchesaccount WHERE username = ?',[req.body["username"]]
    );

   if (JSON.stringify(results).replace("[{","{").replace("}]","}").length == 2) { res.send("{}") } else { res.send(results[0]) }
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }

})

app.post("/moderation/getlevelinfo.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/moderation/getreports.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/moderation/changelevelinfo.php",async (req,res) => {
    try {
        var password = parseJwt(req.body["password"])["password"]
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/reportlevel.php", async (req, res) => {
        try {
        var password = parseJwt(req.body["password"])["password"]
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
        'INSERT INTO bfdibranchesreport (leveltitle,levelid,levelcreatorname,levelcreatorid,reportername,date,description) VALUES (?,?,?,?,?,?,?)',[results2[0]["title"],req.body["levelid"],results2[0]["username"],results3[0]["id"],req.body["username"],datet.getFullYear() + "-" + ("0" + (parseInt(datet.getMonth()) + 1).toString()).slice(-2) + "-" + datet.getDate() + " " + datet.getHours() + ":" + datet.getMinutes(),req.body["description"]]
    );
        if (results4["affectedRows"] > 0) {
            res.status(200).send("Level reported")
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})
app.post("/getprofile.php", async (req, res) => {
    try {
        const [results, fields] =  await connection.query(
        'SELECT id,username,bio,date,branchcoins,moderator,badges,foreground,background,frame,usernameColor,lastonline FROM bfdibranchesaccount WHERE username = ?',[req.body["username"]]
    );

   if (results.length <= 0) { res.send("{}") } else { res.send(results[0]) }
    } catch (err) {
        console.log(err)
        res.status(400).end()
    }

})
app.post("/delete.php", async (req, res) => {
     try {
        var password = parseJwt(req.body["password"])["password"]
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})

app.post("/changelevelinfo.php", async (req, res) => {
      try {
        var password = parseJwt(req.body["password"])["password"]
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
    }
    }
     catch (err) {
     console.log(err)
     res.status(400).end()
    }
})
app.use((req, res, next)=>{
  res.status(404).send({message:"Not Found"});
  console.log("NOT IMPLEMENTED: \"" + req.protocol + "://" + req.get("host") + req.originalUrl + "\"")
  console.log(req.body)
});

app.listen(port)