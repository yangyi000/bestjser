var pool = require('./db') // 连接数据库

module.exports = {
    getArticle: function (uid, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query('SELECT * FROM `list` WHERE `uid`=?', [uid], function (err, result) {
                if (err) throw err;

                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        });
    }
}