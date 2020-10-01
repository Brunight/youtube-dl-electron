import { remote } from 'electron';
import { resolve } from 'path';
import fs from 'fs';
import ytdl, { Media } from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

interface MoreMedia extends Media {
  album?: string;
}

interface ParsedSongData {
  title: string;
  artist: string;
  album: string;
  comment?: string;
}

interface DownloadAudioRequest extends ParsedSongData {
  path: string;
  coverPath?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
}

class YoutubeVideo {
  url: string;
  id: string;
  title: string;
  author: string;
  durationMs: number;
  thumbnailUrl: string;
  playability: string;
  ytMediaData?: {
    title: string;
    artist: string;
    album: string;
  };

  constructor() {
    const ffmpegPath = [
      resolve('node_modules', 'ffmpeg-static', 'ffmpeg'),
      resolve('resources', 'ffmpeg'),
    ]
      .map(path => (process.platform === 'win32' ? `${path}.exe` : path))
      .find(path => fs.existsSync(path));

    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  async init(url: string): Promise<YoutubeVideo> {
    this.url = url;

    const info = await ytdl.getInfo(this.url);
    const { videoDetails } = info;
    const { thumbnails } = videoDetails.thumbnail;
    const { title, videoId, author } = videoDetails;
    this.title = title;
    this.id = videoId;
    this.author = author.name;
    this.durationMs = parseInt(videoDetails.lengthSeconds, 10) * 1000;
    this.thumbnailUrl = thumbnails[thumbnails.length - 1].url;
    console.log(
      `Found thumbnail with ${thumbnails[thumbnails.length - 1].width} x ${
        thumbnails[thumbnails.length - 1].height
      }`,
    );
    this.playability = info.player_response.playabilityStatus.status;

    const media = videoDetails.media as MoreMedia;

    if (this.isPlayable() && !!media.song) {
      this.ytMediaData = {
        title: media.song,
        artist: media.artist,
        album: media.album,
      };
      console.log(this.ytMediaData);
    }

    return this;
  }

  isPlayable(): boolean {
    return this.playability === 'OK';
  }

  getParsedDataFromTitle(): ParsedSongData {
    const title = this.title.replace('[Official Audio]', '').trim();
    let parsedTitle = title;
    let parsedArtist = '';
    let album = title;

    if (this.ytMediaData && parsedTitle.includes(this.ytMediaData.title)) {
      parsedTitle = this.ytMediaData.title;
      parsedArtist = this.ytMediaData.artist;
      album = this.ytMediaData.artist || title;
    } else if (title.includes(' - ')) {
      const videoTitleArray = title.split(' - ');
      [parsedArtist, parsedTitle] = videoTitleArray;
    }

    return {
      title: parsedTitle,
      artist: parsedArtist,
      album,
      comment: `https://youtu.be/${this.id}`,
    };
  }

  async downloadAudio({
    title,
    artist,
    album,
    comment,
    coverPath,
    startTime,
    endTime,
    duration,
    path,
  }: DownloadAudioRequest): Promise<void> {
    const videoStream = ytdl(this.url, {
      quality: 'highestaudio',
      filter: 'audioonly',
      requestOptions: { maxRedirects: 5 },
    });

    const ffmpegCommand = ffmpeg()
      .input(videoStream)
      .addOption('-map 0:0')
      .videoCodec('copy')
      .audioFilters([
        'volume=1.0',
        'silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse',
      ])
      .format('mp3')
      .on('error', console.error)
      .addOutputOption('-metadata', `title=${title}`)
      .addOutputOption('-metadata', `artist=${artist}`)
      .addOutputOption('-metadata', `album=${album}`)
      .addOutputOption('-metadata', `comment=${comment}`)
      .addOutputOption('-metadata', `copyright=${comment}`)
      .output(path);

    if (startTime) ffmpegCommand.seekInput(startTime);
    if (endTime) {
      if (!duration) throw new Error('Duration should also be present.');
      ffmpegCommand.setDuration(duration);
    }

    if (coverPath && coverPath !== '') {
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

    console.log(`\n💽 Processing has finished!`);

    remote.shell.showItemInFolder(path);
  }
}

export default YoutubeVideo;
