const FILENAME_REGEXP = /\/?([^\/]+)\.[^$]+$/;

export const basename = (filename: string) => {
  const match = FILENAME_REGEXP.exec(filename);
  return match ? match[1] : filename;
};