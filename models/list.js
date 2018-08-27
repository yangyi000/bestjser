var pool = require('./db');

module.exports = {
    // 获取首页的主题
    getIndexList: function (cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            // 连表查询，获取到作者的用户名
            connection.query('SELECT `list`.*, username FROM `list`, `users` WHERE `list`.`uid`=`users`.`id`', function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    },
    addTopic: function (params, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('INSERT INTO `list` SET ?', params, function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    },
    addReply: function (params, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('INSERT INTO `reply` SET ?', params, function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    },
    getListById: function (id, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('SELECT * FROM `list` WHERE `id`=?', [id], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    },
    getReplyById: function (pid, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('SELECT * FROM `reply` WHERE `pid`=?', [pid], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    },
    deleteReplyById: function (pid, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('delete * FROM `reply` WHERE `pid`=?', [pid], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    }
}