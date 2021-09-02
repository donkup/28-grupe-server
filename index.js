const mysql = require('mysql2/promise');
const server = require('./lib/server');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'barsukas',
    });

    let sql = '';
    let rows = [];

    // perskaitom ka turim is pradziu
    sql = 'SELECT * \
    FROM `cars` \
    WHERE `id` = 5';
    [rows] = await connection.execute(sql);
    console.log(rows);

    // irasom nauja masina
    sql = 'INSERT INTO `cars` \
        (`id`, `marke`, `modelis`, `color`, `engine`, `doors`) \
        VALUES (5, "Audi", "100", "grey", "2.2", "3")';
    [rows] = await connection.execute(sql);
    console.log(rows);

    // atnaujiname
    sql = 'UPDATE `cars` \
        SET `marke` = "Opel", \
            `modelis` = "Zafyra", \
            `color` = "grey" \
        WHERE `cars`.`id` = 5';
    [rows] = await connection.execute(sql);
    console.log(rows);

    // perskaitom ka turim po atnaujinimo
    sql = 'SELECT * \
    FROM `cars` \
    WHERE `id` = 5';
    [rows] = await connection.execute(sql);
    console.log(rows);

    // istrinam
    sql = 'DELETE FROM `cars` \
    WHERE `id` = 5';
    [rows] = await connection.execute(sql);
    console.log(rows);
}

app.init();

module.exports = app;