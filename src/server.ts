import express, { Express } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app:Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async ( req:express.Request, res:express.Response ) => {
//    let url = req.query.image_url;
    const { image_url } : { image_url: string } = req.query;
    try {if (image_url !== "") {
      await filterImageFromURL(image_url).then((response)=> {
        res.status(200).sendFile(response);
        res.on('Completed, now deleting response', function() {
          deleteLocalFiles([response]);
        });
      });
    } else {res.status(404).send("The URL cannot be found");
    }}catch (Exception){res.status(404).send("The URL cannot be Found");}
  });
  
  // // Root Endpoint
  // // Displays a simple message to the user
  app.get( "/", async ( req:express.Request, res:express.Response ) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();