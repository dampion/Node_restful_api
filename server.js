let Http = require('http'),
    BodyParser = require('body-parser'),
    Router = require('router'),
    server,
    router,
    counter = 0,
    todolist= {};
router = new Router();

// setup node http server
server = Http.createServer( function( request, response ) {
  router( request, response, function(error) {
    if ( !error ) {
      response.writeHead( 404 );
    } else {
      // handle errors
      console.log( error.message, error.stack );
      response.writeHead( 400 );
    }
    response.end( "RESFUL api is running\n" );
  });
});

server.listen( 3005, function() {
  console.log( "Listening on port 3005" );
});
//在 server.listen() 之后用 router.use() 来执得解释，目标是解释成纯文本：
router.use( BodyParser.text() );

// setup router
// 此函示為此路由的handler /todo => createItem();
function createItem( request, response ) {
  let id = counter += 1,
      item = request.body;
  console.log( 'Create Item', id, item );
  todolist[id] = item;
  response.writeHead( 201, {
    'Content-Type' : 'text/plain',
    'Location' : '/todo/' + id
  });
  response.end( item + '\n' );
} 
router.post( '/todo', createItem );

function readItem( request, response ) {
  let id = request.params.id,
      item = todolist[ id ];
  if ( typeof item !== 'string' ) {
    console.log('Item not found', id);
    response.writeHead(404);
    response.end('Error\n');
    return;
  }
  console.log('Read Item', id, item);
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.end( item + '\n' );
}
router.get('/todo/:id', readItem);

function deleteItem( request, response ) {
  let id = request.params.id;
  if (typeof todolist[ id ] !== 'string') {
    console.log('Item not found', id);
    response.writeHead(404);
    response.end('Error\n');
    return;
  }
  console.log('Delete Item', id);

  todolist[ id ] = undefined;
  response.writeHead( 204, {
    'Content-Type': 'text/plain'
  });
  response.end( 'Error\n' );
}
router.delete('/todo/:id', deleteItem);

function readList( request, response ) {
  let item,
      itemList = [],
      listString;
  for ( id in todolist ) {
    if ( !todolist.hasOwnProperty( id ) ) {
      continue;
    }
    item = todolist[ id ];

    if (typeof item !== 'string') {
      continue;
    }

    itemList.push(item);
  }

  console.log( 'Read itemList \n', JSON.stringify(
    itemList,
    null, // replacer
    ' ' // white space
  ));
  listString = itemList.join( '\n' );
  response.writeHead( 200, {
    'Content-Type': 'text/plain'
  });
  response.end( listString );
}
router.get( '/todolist', readList);

function updateItem( request, response ) {
  let id = request.params.id,
      item = request.body;
  
  if ( typeof todolist[ id ] !== 'string' ) {
    console.log( 'Item not found ' + id );
    response.writeHead( 404 );
    response.end( 'Error/n' );
    return;
  }

  todolist[ id ] = item;
  response.writeHead( 201, {
    'Content-Type': 'text/plain',
    'Location': '/todo/' + id
  });
  response.end( item ); // will write in client side
}
router.put( '/todo/:id', updateItem );