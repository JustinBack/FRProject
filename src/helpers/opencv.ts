import { LoggingManager, IPredictions, DatabaseManager } from '../index';
import { CascadeClassifier, eigen, EigenFaceRecognizer, FaceRecognizer, HAAR_FRONTALFACE_ALT2, imdecodeAsync, imreadAsync, IMREAD_UNCHANGED, Mat } from 'opencv4nodejs';
import * as tmp from 'tmp-promise';
import * as fs from 'fs';


export class OpenCVManager {

    public static DataDir: fs.PathLike = process.env.FR_DATA_DIR || __dirname + '/../../data/';

    public static async getFace(grayImg: Mat): Promise<Mat> {
        let classifier = new CascadeClassifier(HAAR_FRONTALFACE_ALT2);
        let faceRects = classifier.detectMultiScale(grayImg).objects;
        if (!faceRects.length) {
            throw new Error('failed to detect faces');
        }
        LoggingManager.debug("Getting face...");
        return await grayImg.getRegion(faceRects[0]).resizeAsync(80, 80);

    }

    public static getRecognizer(): FaceRecognizer {
        return new EigenFaceRecognizer();
    }

    public static async execPrediction(Recognizer: FaceRecognizer, grayImg: any): Promise<IPredictions> {
        return await Recognizer.predictAsync(grayImg) as IPredictions;
    }


    public static async loadModel(Recognizer: FaceRecognizer, PersonaID: String | Number): Promise<FaceRecognizer> {

        LoggingManager.info("Loading model for persona", PersonaID);

        if (fs.existsSync(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl")) {
            LoggingManager.info("Found model for persona", PersonaID);
            await Recognizer.load(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");
            LoggingManager.info("Loaded model for persona", PersonaID);
        }

        return Recognizer;
    }

    public static async trainModel(Recognizer: FaceRecognizer, images: Mat[], PersonaID: String | Number): Promise<FaceRecognizer> {

        let labels: any[] = [];

        for (var i in images) {
            labels.push(Number(PersonaID));
        }

        LoggingManager.info("Training model for persona", PersonaID);

        await Recognizer.trainAsync(images, labels);

        LoggingManager.info("Saving model for persona", PersonaID);
        LoggingManager.debug(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");
        await Recognizer.save(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");

        return Recognizer;
    }

    public static async prepareImage(data: Mat): Promise<Mat> {
        return await data.resizeAsync(80, 80);
    }


    public static async readImages(data: fs.PathLike): Promise<Mat[]> {

        let images: Mat[] = [];

        LoggingManager.info("Reading image from directory!", data);

        for (var file of fs.readdirSync(data)) {
            LoggingManager.debug("File", data + "/" + file, images);
            images.push(await (await imreadAsync(data + "/" + file, IMREAD_UNCHANGED)).bgrToGrayAsync());
        }

        LoggingManager.info("Loaded", images.length, "images");

        return images;
    }


    public static async readImage(data: Buffer | String | any): Promise<Mat> {
        if (data instanceof Buffer) {
            LoggingManager.debug("Detected a Buffer!");
            return await (await imdecodeAsync(data, IMREAD_UNCHANGED)).bgrToGrayAsync();
        }

        LoggingManager.debug("Reading image from file!", data);
        return await (await imreadAsync(data, IMREAD_UNCHANGED)).bgrToGrayAsync();
    }
}