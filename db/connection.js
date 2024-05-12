import mysql from "mysql2/promise";

async function database(query, val) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    if(connection){
        console.log("connected to DB");
    }
    const [rows] = await connection.query(query, val);
  connection.end();
    return rows;
}

export default database;