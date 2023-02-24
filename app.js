const express = require("express");
const app = new express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "cricketTeam.db"),
      driver: sqlite3.Database,
    });
    app.listen(3000);
    console.log("Server started successfully http://localhost:3000/");
  } catch (err) {
    console.log("error connecting to database");
    process.exit(1);
  }
};
initializeDBandServer();

app.get("/players/", async (request, response) => {
    try {
        const query = `
        select *
        from cricket_team;
        `;
        const result = await db.all(query);
        const retur=[];
        for(let i=0;i<result.length;i++)
        {
            retur.push({
                playerId:result[i].player_id,
                playerName:result[i].player_name,
                jerseyNumber:result[i].jersey_number,
                role:result[i].role
            });
        }
        response.send(retur);
    } 
    catch (error) {
        response.send(error);
    }
});

app.post("/players/", async (request, response) => {
    try{
        const b1 = request.body;
        const {playerName,jerseyNumber,role}=request.body;
        const addrowquery=
        `
        Insert into cricket_team(player_name,jersey_number,role) 
        values('${playerName}',${jerseyNumber},'${role}')
        ;`;
        const result=await db.run(addrowquery);
        // response.send({player_id:result.lastID});
        response.send("Player Added to Team");
        // console.log("inserted successfully");
    }
    catch(err)
    {
        console.log(err);
    }
});

app.get('/players/:playerId/',async(request,response)=>{
    try {
        const {playerId}=request.params;
        const query=
        `
        select * 
        from cricket_team
        where player_id=${playerId}
        ;`;
        const result=await db.get(query);
        response.send({
            playerId:result.player_id,
            playerName:result.player_name,
            jerseyNumber:result.jersey_number,
            role:result.role
        });
    } catch (error) {
        response.send(error);
    }
});

app.put('/players/:playerId/',async(request,response)=>{
    try{
        const {playerId}=request.params;
        const playerDetails=request.body;
        const {playerName,jerseyNumber,role}=playerDetails;
        const updatequery=
        `
        update cricket_team
        set 
            player_name='${playerName}',
            jersey_number=${jerseyNumber},
            role='${role}'
        where player_id=${playerId};
        `;
        const result=await db.run(updatequery);
        response.send("Player Details Updated");
    }
    catch(err)
    {
        response.send(err);
    }
});

app.delete('/players/:playerId',async(request,response)=>{
    try {
        const {playerId}=request.params;
        const deletequery=
        `
        Delete from cricket_team
        where 
            player_id=${playerId};
        `;
        await db.run(deletequery);
        response.send("Player Removed");
    } 
    catch (error) {
        response.send(error);
    }
});

module.exports=app;