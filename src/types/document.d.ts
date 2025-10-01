export type FileMetadata = {
  file_name: string;
  mime_type: string;
  thumbnail: ImageThumb;
  thumb: ImageThumb;
  file_id: string;
  file_unique_id: string;
  file_size: number;
};

type ImageThumb = {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
};
