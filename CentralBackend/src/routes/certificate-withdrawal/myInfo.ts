import express, { Request, Response } from "express";
import db, {Database, TableName} from "../../database"
import {z} from "zod"
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../../helper/paginatedResults";
import { CertificateWithdrawalAttachments } from "../../types/CertificateWithdrawalTables";
import { verifySession } from "../../middlewares/verifySession";
const myInfo = express.Router();

myInfo.get("/", verifySession, async(req, res)=>{
    const bearerHeader = z.string().parse(req.headers["authorization"]);
    const token = z.string().parse(bearerHeader.split(" ")[1]);

   try{
    const userID = await db.selectFrom("Auth_Session").where("Auth_Session.session_id", "=", token).select("Auth_Session.user_id").executeTakeFirst()
    if(userID){
        console.log(userID)
        const user : any = await db
        .selectFrom("User")
        .where("User.user_id", "=", userID.user_id).selectAll().executeTakeFirst() 

        user.password = ""

        const role = await db
        .selectFrom("Roles")
        .where("Roles.user_id", "=", userID.user_id)
        .select("Roles.role")
        .executeTakeFirst()
        //  || {role: ""}
        console.log(role)

        var userInfo = {
            session_id: token,
            user,
            role
        }

        res.status(200).send(userInfo)
    }
   }catch(error){
     console.log(error)
     res.status(500).json({ message: "Internal server error", error });
   }
    
})

export default myInfo