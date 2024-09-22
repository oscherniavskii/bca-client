export const checkIsImage = (filePath: string) => {
	const imageRegex =
		/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

	return imageRegex.test(filePath);
};
