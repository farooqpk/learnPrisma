import express, { urlencoded } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/allUsers", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.post("/addUser", async (req, res) => {
  const newuser = await prisma.user.create({
    data: req.body,
  });
  res.json(201)
});


app.put("/updateUser", async (req, res) => {
  await prisma.user.update({
    where: { id: req.body.id },
    data: { lastName: req.body.lastName },
  });
  res.status(200)
});


app.delete("/deleteUser/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id }
  });
  res.status(200)
});


app.post("/addHouse",async(req,res)=>{
  const newHouse = await prisma.house.create({
    data: req.body,
  });
  res.json(201)
})


app.get("/allHouse",async(req,res)=>{
  //now if we put these in include we can also get information about owner and builtby from user collection
const houses =await prisma.house.findMany({
  include:{
    builtBy:true,
    owner:true
  }
})
res.json(houses)
})


app.get("/specificHouse/:id",async(req,res)=>{
//specific house with owner only
const house = await prisma.house.findUnique({
  where:{id:req.params.id},
  include:{owner:true,builtBy:true}
})
res.json(house)
})


app.get("/filterHouse",async(req,res)=>{

  const filteredHouses = await prisma.house.findMany({
    where:{
      wifiPassword:{
        not:null
      },
      owner:{
        age:{gte:20}
      }
    },
    orderBy:{
      owner:{
        firstName:"desc"
      }
    },
    include:{
      owner:true,
      builtBy:false
    }
  })

  res.json(filteredHouses)
})



app.listen(4000, () => {
  console.log("http://localhost:4000/");
});
