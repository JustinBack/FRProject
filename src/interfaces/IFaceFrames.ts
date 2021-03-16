import { Mat } from 'opencv4nodejs';

export interface IFaceFrames {
    faceMatrixes: Mat[],
    faceFiles: string[]
}