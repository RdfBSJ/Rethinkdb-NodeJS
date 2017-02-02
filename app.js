var express = require('express');
var r = require('rethinkdb');

var connection = null;

/*r.connect({host: "localhost", port: "28015"}, function(err, conn){
	if(err) throw err;
	connection = conn;

	r.db('test').tableCreate('categorias').run(connection, function(err, result) {
    	if (err) throw err;
    	console.log(JSON.stringify(result, null, 2));
	})
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').insert([{
        nombre: "Tornillos"
    }, {
        nombre: "Lamina"
    }, {
        nombre: "Palas"
    }]).run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    })
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').filter(r.row('nombre').eq("Lamina")).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').filter(r.row('cantidad').count().gt(2)).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').get('770d59bd-13f3-4823-93a8-bfa4091883aa').
    run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
})*/

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').changes().run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.each(function(err, row) {
            if (err) throw err;
            console.log(JSON.stringify(row, null, 2));
        });
    });
})*/

r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;

    r.table('categorias').
    filter(r.row('precio').count().lt(3)).
    delete().
    run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
})


var app = express();
app.set("view engine", "jade");
app.use(express.static("public"));
app.get("/", function(solicitud, respuesta) {
    respuesta.render("index");
});

app.listen(8081);
