import { LoggingManager, OpenCVManager, IFaceFrames } from '../index';
import * as tmp from 'tmp-promise';
import * as fs from 'fs';
import * as ffmpeg from 'ffmpeg';
import * as process from 'child-process-promise';
import { Mat } from 'opencv4nodejs';

export class ffmpegManager {

    public static async extractFrames(inFile: fs.PathLike, outDir: fs.PathLike): Promise<any> {


        await process.exec(`ffmpeg -i '${inFile}' -an -qscale:v 1 -vsync 0 -vcodec png '${outDir}/frame_%03d.png'`).then((result) => {
            var stdout = result.stdout;
            console.log('stdout: ', stdout);
        });

        let files: any[] = [];

        for (var file of await fs.promises.readdir(outDir)) {
            files.push(outDir + "/" + file);
        }

        return await files;

    }

    public static async extractFacesFromFrames(inFrames: Array<any>): Promise<IFaceFrames> {
        LoggingManager.info("Extracting faces from", inFrames);
        let faceFiles: string[] = [];
        let faceMatrixes: Mat[] = [];
        for (var file of inFrames) {
            try {
                let image = await OpenCVManager.readImage(file);
                let face = await OpenCVManager.getFace(image);
                faceFiles.push(file);
                faceMatrixes.push(face);
            } catch (ex) { }
        }
        return await { faceFiles: faceFiles, faceMatrixes: faceMatrixes } as IFaceFrames;
    }


}