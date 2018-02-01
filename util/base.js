import $sql from '../conf/sql';
import mysql from 'mysql';
// let mysql = require('mysql');

/**
 * MySQL pool 建立函数
 * @param {*} props 
 */
const connectMySQL = (props) => {
    const {
        connectionLimit,
        host,
        user,
        password,
        database
    } = props;

    return mysql.createPool({
        connectionLimit,
        host,
        user,
        password,
        database
    });
}

/**
 * connection 建立函数
 * @param {*} pool 
 */
const connMySQL = async (pool) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            resolve(connection);
        })
    });
}

const connMongo = async (MongoClient, url, dbname) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, client) => {
            console.log("Connected successfully to server");
            if (err) {
                reject(err);
            }

            const db = client.db(dbname);
            resolve({
                db,
                client
            });
        });
    })
}

/**
 * 判断 data 是否需要转换为 JSONP 格式
 * @param {*} data 
 * @param {*} params 
 */
const jsonpTransfer = (data, params) => {
    const callback = params.callback;
    if (callback) {
        return `${callback}(${JSON.stringify(data)})`;
    } else {
        return data;
    }
}

/**
 * 具体 MySQL 数据库单次查询异步函数
 * @param {*} conn Mysql 连接池
 * @param {*} type SQL 语句类型
 * @param {*} params 入参
 * @param {*} func 默认为 false 即 type 对应语句为字符串，否则为函数，函数入参为 func 值
 */
const queryMySQLElements = async (conn, type, params, func = false) => {
    return new Promise((resolve, reject) => {
        let query = func ? $sql[type](func) : $sql[type];
        conn.query(query, params, (err, res) => {
            if (err) {
                reject(err);
            }

            resolve(res);
        });
    })
}

export {
    connectMySQL,
    connMySQL,
    connMongo,
    jsonpTransfer,
    queryMySQLElements
};