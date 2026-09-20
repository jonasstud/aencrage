const MIN_BAR_HEIGHT = 0.02;

/**
 * Downsamples raw PCM samples into `numBars` peak-amplitude buckets, for
 * rendering a real waveform from an already-decoded AudioBuffer instead of
 * relying on precomputed data that isn't available for every audio source.
 */
export function computePeaksFromSamples(
  samples: Float32Array | number[],
  numBars: number,
): number[] {
  if (numBars <= 0 || samples.length === 0) return [];

  const samplesPerBar = Math.max(1, Math.floor(samples.length / numBars));
  const peaks: number[] = [];

  for (let i = 0; i < numBars; i++) {
    const start = i * samplesPerBar;
    const end = i === numBars - 1 ? samples.length : Math.min(start + samplesPerBar, samples.length);

    let max = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(samples[j]);
      if (abs > max) max = abs;
    }

    peaks.push(Math.max(MIN_BAR_HEIGHT, max));
  }

  return peaks;
}

/**
 * Averages an AudioBuffer's channels down to one array of samples, then
 * computes peaks from it — multi-channel (e.g. stereo) audio would
 * otherwise only reflect a single channel's amplitude.
 */
export function computePeaksFromAudioBuffer(
  buffer: AudioBuffer,
  numBars: number,
): number[] {
  const { numberOfChannels, length } = buffer;

  if (numberOfChannels === 1) {
    return computePeaksFromSamples(buffer.getChannelData(0), numBars);
  }

  const averaged = new Float32Array(length);
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      averaged[i] += channelData[i] / numberOfChannels;
    }
  }

  return computePeaksFromSamples(averaged, numBars);
}
