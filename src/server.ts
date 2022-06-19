import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async ( req, res ) => {
    let url = req.query.image_url;
    try {if (url !== "") {
      await filterImageFromURL(url).then((response)=> {
        res.sendFile(response);
        res.on('Completed, now deleting response', function() {
          deleteLocalFiles([response]);
        });
      });
    } else {res.status(404).send("The URL cannot found");
    }}catch (Exception){res.status(404).send("The URL cannot Found");}
  });
  
  // // Root Endpoint
  // // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();