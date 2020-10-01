import { remote } from 'electron';
import { resolve, basename, extname } from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { parseFile } from 'music-metadata';
import Metaflac from 'metaflac-js';

interface SaveFileRequest extends BasicAudioData {
  coverPath?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
}

interface BasicAudioData {
  title: string;
  artist: string;
  album: string;
  comment?: string;
}

class MusicFile implements BasicAudioData {
  path: string;
  title: string;
  artist: string;
  album: string;
  comment: string;
  durationMs: number;
  coverData: string;

  constructor() {
    const ffmpegPath = [
      resolve('node_modules', 'ffmpeg-static', 'ffmpeg'),
      resolve('resources', 'ffmpeg'),
    ]
      .map(path => (process.platform === 'win32' ? `${path}.exe` : path))
      .find(path => fs.existsSync(path));

    ffmpeg.setFfmpegPath(ffmpegPath);
    process.env.FFMPEG_PATH = ffmpegPath;
  }

  async init(path: string): Promise<MusicFile> {
    this.path = path;

    const parsedFile = await parseFile(path);
    const { common, format } = parsedFile;
    const { title, artist, album, comment, picture, copyright } = common;
    const cover =
      picture && picture.find(pic => pic.type === 'Cover (front)' || 'Other');

    this.artist = artist || '';
    this.title = title || '';
    this.album = album || '';
    this.comment = comment ? comment[0] : copyright || '';

    this.durationMs = Math.round(format.duration) * 1000;

    this.coverData = cover
      ? `data:${cover.format};base64,${cover.data.toString('base64')}`
      : '';

    return this;
  }

  getData(): BasicAudioData {
    return {
      title: this.title,
      artist: this.artist,
      album: this.album,
      comment: this.comment,
    };
  }

  async saveFile({
    title,
    artist,
    album,
    comment,
    coverPath,
    startTime,
    endTime,
    duration,
  }: SaveFileRequest): Promise<void> {
    const oldExtension = extname(this.path);
    const newExtension = oldExtension === '.m4a' ? '.mp3' : oldExtension;

    const tmpPath = resolve(remote.app.getPath('temp'), 'youtube-dl-electron');
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }
    const tmpFileName = basename(this.path).replace(oldExtension, newExtension);

    const tmpFilePath = resolve(tmpPath, tmpFileName);

    const ffmpegCommand = ffmpeg()
      .input(this.path)
      .addOption('-map 0:0')
      .videoCodec('copy')
      // .audioFilters([
      //   'volume=1.0',
      //   'silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse',
      // ])
      .on('error', console.error)
      .addOutputOption('-metadata', `title=${title}`)
      .addOutputOption('-metadata', `artist=${artist}`)
      .addOutputOption('-metadata', `album=${album}`)
      .addOutputOption('-metadata', `comment=${comment}`)
      .addOutputOption('-metadata', `copyright=${comment}`)
      .output(tmpFilePath);

    if (startTime) ffmpegCommand.seekInput(startTime);
    if (endTime) {
      if (!duration) throw new Error('Duration should also be present.');
      ffmpegCommand.setDuration(duration);
    }

    if (oldExtension === '.m4a') ffmpegCommand.format('mp3');

    if (coverPath && coverPath !== '') {
      if (extname(this.path) !== '.flac')
        ffmpegCommand
          .addInput(coverPath)
          .addOption('-map 1:0')
          .addOutputOption('-metadata:s:v', 'title="Album cover"')
          .addOutputOption('-metadata:s:v', 'comment="Cover (front)"')
          .addOutputOption('-id3v2_version', '3');
    }

    ffmpegCommand.run();

    console.log(`💥 Processing has started!`);
    console.log(`📝 Data will be:`);
    console.log(`  🎵 Title: ${title}`);
    console.log(`  🎤 Artist: ${artist}`);
    console.log(`  💿 Album: ${album}`);
    console.log(`  💬 Comment: ${comment}`);
    console.log(`  🎨 Cover: ${coverPath}`);

    await new Promise(presolve => {
      ffmpegCommand.on('end', () => presolve());
    });

    if (extname(this.path) === '.flac') {
      const flac = new Metaflac(tmpFilePath);
      flac.pictures = [];
      flac.importPictureFrom(coverPath);
      flac.save();
    }

    console.log(`\n💽 Processing has finished!`);

    fs.unlinkSync(this.path);

    const newPath = this.path.replace(oldExtension, newExtension);

    fs.copyFileSync(tmpFilePath, newPath);

    remote.shell.showItemInFolder(newPath);
  }
}

export default MusicFile;
