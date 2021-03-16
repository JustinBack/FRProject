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
exports.OpenCVManager = void 0;
const index_1 = require("../index");
const opencv4nodejs_1 = require("opencv4nodejs");
const fs = require("fs");
class OpenCVManager {
    static getFace(grayImg) {
        return __awaiter(this, void 0, void 0, function* () {
            let classifier = new opencv4nodejs_1.CascadeClassifier(opencv4nodejs_1.HAAR_FRONTALFACE_ALT2);
            let faceRects = classifier.detectMultiScale(grayImg).objects;
            if (!faceRects.length) {
                throw new Error('failed to detect faces');
            }
            index_1.LoggingManager.debug("Getting face...");
            return yield grayImg.getRegion(faceRects[0]).resizeAsync(80, 80);
        });
    }
    static getRecognizer() {
        return new opencv4nodejs_1.EigenFaceRecognizer();
    }
    static execPrediction(Recognizer, grayImg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recognizer.predictAsync(grayImg);
        });
    }
    static loadModel(Recognizer, PersonaID) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.LoggingManager.info("Loading model for persona", PersonaID);
            if (fs.existsSync(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl")) {
                index_1.LoggingManager.info("Found model for persona", PersonaID);
                yield Recognizer.load(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");
                index_1.LoggingManager.info("Loaded model for persona", PersonaID);
            }
            return Recognizer;
        });
    }
    static trainModel(Recognizer, images, PersonaID) {
        return __awaiter(this, void 0, void 0, function* () {
            let labels = [];
            for (var i in images) {
                labels.push(Number(PersonaID));
            }
            index_1.LoggingManager.info("Training model for persona", PersonaID);
            yield Recognizer.trainAsync(images, labels);
            index_1.LoggingManager.info("Saving model for persona", PersonaID);
            index_1.LoggingManager.debug(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");
            yield Recognizer.save(OpenCVManager.DataDir + "/models/" + PersonaID + ".frpmdl");
            return Recognizer;
        });
    }
    static prepareImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data.resizeAsync(80, 80);
        });
    }
    static readImages(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let images = [];
            index_1.LoggingManager.info("Reading image from directory!", data);
            for (var file of fs.readdirSync(data)) {
                index_1.LoggingManager.debug("File", data + "/" + file, images);
                images.push(yield (yield opencv4nodejs_1.imreadAsync(data + "/" + file, opencv4nodejs_1.IMREAD_UNCHANGED)).bgrToGrayAsync());
            }
            index_1.LoggingManager.info("Loaded", images.length, "images");
            return images;
        });
    }
    static readImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data instanceof Buffer) {
                index_1.LoggingManager.debug("Detected a Buffer!");
                return yield (yield opencv4nodejs_1.imdecodeAsync(data, opencv4nodejs_1.IMREAD_UNCHANGED)).bgrToGrayAsync();
            }
            index_1.LoggingManager.debug("Reading image from file!", data);
            return yield (yield opencv4nodejs_1.imreadAsync(data, opencv4nodejs_1.IMREAD_UNCHANGED)).bgrToGrayAsync();
        });
    }
}
exports.OpenCVManager = OpenCVManager;
OpenCVManager.DataDir = process.env.FR_DATA_DIR || __dirname + '/../../data/';
