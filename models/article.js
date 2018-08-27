var pool = require('./db');
var async = require("async");
module.exports = {
    // get all the article
    getIndexList: function (cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            // get all the article and writer 
            connection.query('SELECT `list`.*, username FROM `list`, `users` WHERE `list`.`uid`=`users`.`id`', function (err, result) {
                if (err) throw err;//
                cb(result);
                connection.release();
            })
        });
    },
    addArticle: function (params, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('INSERT INTO `list` SET ?', params, function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        });
    },
    addReply: function (params, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            async.parallel([
                function (callback) {
                    connection.query('INSERT INTO `reply` SET ?', params, function (err, result) {
                        if (err) throw err;
        
                        callback(result);  
                    });
                },
                function (callback) {
                    var query = 'UPDATE `list` SET `replynum` = '+params[1]+' WHERE `id`= ?';
                    connection.query(query, [params[0].pid], function (err, result) {
                        if (err) throw err;
        
                        callback(result); 
                    });
                }
            ], function (err, results) {
                cb(results);
                connection.release();
            });
        });
    },
    getListById: function (id, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('SELECT * FROM `list` WHERE `id`=?', [id], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
               
            });
        });
    },
    getReplyById: function (pid, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('SELECT * FROM `reply` WHERE `pid`=?', [pid], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
            });
        });
    },
    deleteReplyById: function (pid, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('delete * FROM `reply` WHERE `pid`=?', [pid], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
            });
        });
    }
}