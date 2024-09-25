import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter Image Endpoint
  // Filter an image from a public url
  app.get( "/filteredimage", async (req, res) => {
    const { image_url } = req.query
    // Validate the image_url query
    if(!image_url) {
      return res.status(400).send(`Image url is required`);
    } else {
      // Call filterImageFromURL(image_url) to filter the image
      filterImageFromURL(image_url).then((filteredpath) => {
        // Send the resulting file in the response
        return res.status(200).sendFile(filteredpath);
      }).catch((error) => {
        return res.status(500).send(`Internal server error: ${error}`);
      }).finally((filteredpath) => {
        if (filteredpath) {
          // deletes any files on the server on finish of the response
          deleteLocalFiles([filteredpath]);
        }
      });
    }    
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );