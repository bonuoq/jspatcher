import { WaveformData } from "../types";

export interface IWaveformWorker {
    generate(buffer: Float32Array[], stepsFactor?: number): WaveformData;
}
