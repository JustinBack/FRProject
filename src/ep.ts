import { Pool } from 'pg';
import * as FRProject from './index';
import * as yargs from 'yargs';
import * as fs from 'fs';
import { basename } from 'path';
import { Mat } from 'opencv4nodejs';

const argv = yargs
    .command('train', 'Train a model for a PersonaID', {
        personaid: {
            description: 'The PersonaID to train',
            alias: 'p',
            type: 'string',
        },
        image: {
            description: 'A directory of images or an image itself',
            alias: 'i',
            type: 'string',
        }
    })
    .command('extract', 'Extract frames from a video', {
        input: {
            description: 'The input file',
            alias: 'i',
            type: 'string',
        },
        output: {
            description: 'The output directory',
            alias: 'o',
            type: 'string',
        }
    })
    .command('predict', 'Predict if the person matches the model', {
        personaid: {
            description: 'The PersonaID to train',
            alias: 'p',
            type: 'string',
        },
        image: {
            description: 'A directory of images or an image itself',
            alias: 'i',
            type: 'string',
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

FRProject.EnvironmentManager.init();

const pool = new Pool();


const DatabaseHelper = new FRProject.DatabaseManager(pool);


async function init() {
    await DatabaseHelper.initializeDatabase();
    let Recognizer = FRProject.OpenCVManager.getRecognizer();

    if (argv._.includes('train')) {

        if (fs.lstatSync(argv.image as fs.PathLike).isDirectory()) {
            let images = await FRProject.OpenCVManager.readImages(argv.image as fs.PathLike);

            let faces: Mat[] = [];
            for (var image of images) {
                faces.push(await FRProject.OpenCVManager.getFace(image));
            }
            Recognizer = await FRProject.OpenCVManager.loadModel(Recognizer, argv.personaid.toString(), DatabaseHelper);


            await FRProject.OpenCVManager.trainModel(Recognizer, faces, argv.personaid.toString(), DatabaseHelper);
        }

    } else if (argv._.includes('extract')) {

        let frames = await FRProject.ffmpegManager.extractFrames(argv.input as fs.PathLike, argv.output as fs.PathLike);


        let faces = await FRProject.ffmpegManager.extractFacesFromFrames(frames);


        fs.mkdirSync(argv.output as fs.PathLike + "/faces/");

        for (var file of faces.faceFiles) {
            await fs.promises.copyFile(file, argv.output as fs.PathLike + "/faces/" + basename(file));
            await fs.promises.unlink(file);

        }



    } else if (argv._.includes('predict')) {

        let image = await FRProject.OpenCVManager.readImage(argv.image as fs.PathLike);
        let face = await FRProject.OpenCVManager.getFace(image);

        let prepared = await FRProject.OpenCVManager.prepareImage(face);

        Recognizer = await FRProject.OpenCVManager.loadModel(Recognizer, argv.personaid.toString(), DatabaseHelper);

        let result = await FRProject.OpenCVManager.execPrediction(Recognizer, prepared);

        FRProject.LoggingManager.info(result);

    }

    await DatabaseHelper.exit();
}

init();
