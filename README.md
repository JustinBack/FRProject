# FR Project

FRProject aims to make Facial Recognition easy for education purposes.



#### How does FRProject work?

The difference in FRProject is that models are not stored in a single file.

Each persona gets its own model, saved on disk.

The huge advantage is less overheap is created when loading a model.


#### What are the advantages of FRProject?

FRProject is just a wrapper around [opencv4nodejs](opencv4nodejs#readme).

You can use it as a library, as well as a standalone (see ep.ts).

FRProject provides wrappers for ffmpeg, opencv and its database component postgres, which is not required in the library **but** in the standalone version.


#### How to use FRProject?

##### Standalone

You can use the Standalone entrypoint if you do not wish to code yourself.

The standalone provides access to every feature (as well beyond, such as persona management via postgres) existing in the library, however to make it easy, FRProject can be integrated within your application.

##### Library

As a library, simply include the module OR the production/index.js file. That way you have access to the `FRProject` namespace with all helper functions and interfaces.



#### What is a persona?


A persona is simply an ID of the person assigned to the model.

The model gets saved as `{PersonaID}.frpmdl`

Use the persona in your own storage functions to identify the model.

**All labels use the persona ID in the prediction**


#### Are there examples?

Not yet, make sure to look in the ep.ts though, as its really simple made.


#### Do I need the .env file?

Only if you intend to use the standalone version.