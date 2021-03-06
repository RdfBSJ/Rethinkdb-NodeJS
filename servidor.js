var express = require('express');
var r = require('rethinkdb');
var bodyParser = require('body-parser');
var method_override = require('method-override');
var app_password = "admin";
var connection = null;

/*r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})*/

var app = express();

app.set("view engine", "jade");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(method_override("_method"));

app.listen(8081);

app.get("/", function(solicitud, respuesta) {
    respuesta.render("index");
});

app.get("/productos/nuevo", function(solicitud, respuesta) {
    respuesta.render("productos/nuevo");
});

app.post("/producto", function(solicitud, respuesta) {
    //console.log(solicitud.body);

    r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.table('Productos').insert({
            Nombre: solicitud.body.nombre,
            Descripcion: solicitud.body.descripcion,
            Precio: solicitud.body.precio,
            Clave: solicitud.body.clave
        }).run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        })
    })

    respuesta.render("productos/nuevo");
});

app.get("/productos/lista", function(solicitud, respuesta) {
    r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.table('Productos').run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.toArray(function(err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result, null, 2));
                respuesta.render("productos/lista", { productos: result })
            });
        });
    })
});

app.get("/admin/form", function(solicitud, respuesta) {
    respuesta.render("admin/form");
});

app.post("/admin", function(solicitud, respuesta) {
    //console.log(solicitud.body);
    if (solicitud.body.clave == app_password) {
        r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
            if (err) throw err;
            connection = conn;

            r.table('Productos').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result, null, 2));
                    respuesta.render("admin/index", { productos: result })
                });
            });
        })
    } else {
        respuesta.redirect("/");
    }
});

app.get("/productos/editar/:id", function(solicitud, respuesta) {
    var producto_id = solicitud.params.id;
    r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
        if (err) throw err;
        connection = conn;
        r.table('Productos').get(producto_id).
        run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            respuesta.render("productos/editar", { producto: result });
        });
    })
});

app.put("/editar/:id", function(solicitud, respuesta) {
    if (solicitud.body.clave == app_password) {
        var producto_id = solicitud.params.id;
        r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
            if (err) throw err;
            connection = conn;

            r.table('Productos').get(producto_id).update({
                Nombre: solicitud.body.nombre,
                Descripcion: solicitud.body.descripcion,
                Precio: solicitud.body.precio,
                Clave: solicitud.body.clave
            }).
            run(connection, function(err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result, null, 2));
                //respuesta.render("admin/index");

                r.table('Productos').run(connection, function(err, cursor) {
                    if (err) throw err;
                    cursor.toArray(function(err, result) {
                        if (err) throw err;
                        //console.log(JSON.stringify(result, null, 2));
                        respuesta.render("admin/index", { productos: result })
                    });
                });

            });
        })
    } else {
        respuesta.redirect("/");
    }
});

app.get("/productos/borrar/:id", function(solicitud, respuesta) {
    var producto_id = solicitud.params.id;
    r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
        if (err) throw err;
        connection = conn;
        r.table('Productos').get(producto_id).
        run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            respuesta.render("productos/borrar", { producto: result });
        });
    })
})

app.delete("/borrar/:id", function(solicitud, respuesta) {
    if (solicitud.body.clave == app_password) {
        var producto_id = solicitud.params.id;
        r.connect({ host: "localhost", port: "28015" }, function(err, conn) {
            if (err) throw err;
            connection = conn;

            r.table('Productos').get(producto_id).delete().
            run(connection, function(err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result, null, 2));
                //respuesta.render("admin/index");

                r.table('Productos').run(connection, function(err, cursor) {
                    if (err) throw err;
                    cursor.toArray(function(err, result) {
                        if (err) throw err;
                        //console.log(JSON.stringify(result, null, 2));
                        respuesta.render("admin/index", { productos: result })
                    });
                });
                
            });
        })
    } else {
        respuesta.redirect("/");
    }
})

