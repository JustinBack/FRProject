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
exports.ffmpegManager = void 0;
const index_1 = require("../index");
const fs = require("fs");
const process = require("child-process-promise");
class ffmpegManager {
    static extractFrames(inFile, outDir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield process.exec(`ffmpeg -i '${inFile}' -an -qscale:v 1 -vsync 0 -vcodec png '${outDir}/frame_%03d.png'`).then((result) => {
                var stdout = result.stdout;
                console.log('stdout: ', stdout);
            });
            let files = [];
            for (var file of yield fs.promises.readdir(outDir)) {
                files.push(outDir + "/" + file);
            }
            return yield files;
        });
    }
    static extractFacesFromFrames(inFrames) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.LoggingManager.info("Extracting faces from", inFrames);
            let faceFiles = [];
            let faceMatrixes = [];
            for (var file of inFrames) {
                try {
                    let image = yield index_1.OpenCVManager.readImage(file);
                    let face = yield index_1.OpenCVManager.getFace(image);
                    faceFiles.push(file);
                    faceMatrixes.push(face);
                }
                catch (ex) { }
            }
            return yield { faceFiles: faceFiles, faceMatrixes: faceMatrixes };
        });
    }
}
exports.ffmpegManager = ffmpegManager;
