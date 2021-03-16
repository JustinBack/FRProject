"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const FRProject = require("./index");
const yargs = require("yargs");
const fs = require("fs");
const path_1 = require("path");
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
fs.mkdirSync("../data/");
const pool = new pg_1.Pool();
const DatabaseHelper = new FRProject.DatabaseManager(pool);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield DatabaseHelper.initializeDatabase();
        let Recognizer = FRProject.OpenCVManager.getRecognizer();
        if (argv._.includes('train')) {
            if (fs.lstatSync(argv.image).isDirectory()) {
                let images = yield FRProject.OpenCVManager.readImages(argv.image);
                let faces = [];
                for (var image of images) {
                    faces.push(yield FRProject.OpenCVManager.getFace(image));
                }
                Recognizer = yield FRProject.OpenCVManager.loadModel(Recognizer, argv.personaid.toString());
                yield FRProject.OpenCVManager.trainModel(Recognizer, faces, argv.personaid.toString());
            }
        }
        else if (argv._.includes('extract')) {
            let frames = yield FRProject.ffmpegManager.extractFrames(argv.input, argv.output);
            let faces = yield FRProject.ffmpegManager.extractFacesFromFrames(frames);
            fs.mkdirSync(argv.output + "/faces/");
            for (var file of faces.faceFiles) {
                yield fs.promises.copyFile(file, argv.output + "/faces/" + path_1.basename(file));
                yield fs.promises.unlink(file);
            }
        }
        else if (argv._.includes('predict')) {
            let image = yield FRProject.OpenCVManager.readImage(argv.image);
            let face = yield FRProject.OpenCVManager.getFace(image);
            let prepared = yield FRProject.OpenCVManager.prepareImage(face);
            Recognizer = yield FRProject.OpenCVManager.loadModel(Recognizer, argv.personaid.toString());
            let result = yield FRProject.OpenCVManager.execPrediction(Recognizer, prepared);
            FRProject.LoggingManager.info(result);
        }
        yield DatabaseHelper.exit();
    });
}
init();
